from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client
import uvicorn
import pdfplumber
import tiktoken
import numpy as np
import openai
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from dotenv import load_dotenv
import os
import io
import uuid

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5175"], #change this on prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load environment variables
load_dotenv()
client = openai.OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

# Initialize Supabase
supabase = create_client(
    os.getenv('SUPABASE_URL'),
    os.getenv('SUPABASE_ANON_KEY')
)

# Modified to work with Supabase
def openFile(file_path):
    try:
        # Get file from Supabase storage
        response = supabase.storage.from_('contracts').download(file_path)
        
        # Create BytesIO object from the downloaded content
        pdf_content = io.BytesIO(response)
        
        text = []
        with pdfplumber.open(pdf_content) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text.append(page_text)
        return '\n'.join(text)
    except Exception as e:
        print(f"Error reading PDF: {e}")
        raise

# Your other existing functions remain the same
def chunk_text(text, max_tokens=512):
    tokenizer = tiktoken.get_encoding('cl100k_base')
    tokens = tokenizer.encode(text)

    chunks = []
    for i in range(0,len(tokens), max_tokens):
        chunk_tokens = tokens[i:i + max_tokens]
        chunk_text = tokenizer.decode(chunk_tokens)
        chunks.append(chunk_text)
    #print("Chunks", chunks)
    return chunks

def generate_embeddings(chunks):
    vectorizer = TfidfVectorizer()
    embeddings = vectorizer.fit_transform(chunks).toarray()
    return embeddings, vectorizer

def retrieve_similar_chunks(query, embeddings, chunks, vectorizer, top_k=5):
    query_vector = vectorizer.transform([query]).toarray()
    
    # Calculate cosine similarity
    similarities = cosine_similarity(query_vector, embeddings)[0]
    
    # Get top k similar chunks
    top_indices = np.argsort(similarities)[-top_k:][::-1]
    similar_chunks = [chunks[i] for i in top_indices]
    return similar_chunks

def query_chatgpt(query, similar_chunks):
    context = "\n".join(similar_chunks)
    # Add explicit instructions to prevent hallucinations
    prompt = f"""Based STRICTLY on the provided context from the PDF document, please answer the question.
If the information cannot be found in the context, respond with 'Information not found in document.'
Do not make assumptions or use external knowledge.

Context: {context}

Question: {query}

If the question is about a date, please return it in the format:
{{
    "date": "YYYY-MM-DD",
    "confidence": "HIGH/MEDIUM/LOW",
    "source_text": "exact text from context that contains this date"
}}

If the question is not about a date, provide a direct answer using only information from the context."""

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a precise document analyzer. Only use information from the provided context."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.3  # Lower temperature for more focused responses
    )
    return response.choices[0].message.content.strip()
    

# Storage for processed files
pdf_storage = {}

class Query(BaseModel):
    query: str
    file_id: str


@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        # Read file content
        content = await file.read()

        file_extension = os.path.splitext(file.filename)[1]
        #print(file_extension)
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        # Check file type
        
        # Upload to Supabase Storage
        file_path = f"{unique_filename}"
        response = supabase.storage \
            .from_('contracts') \
            .upload(file_path, content)

        if hasattr(response, 'error') and response.error:
            raise Exception(response.error.message)

        # Get public URL
        file_url = supabase.storage \
            .from_('contracts') \
            .get_public_url(file_path)

        # Process the PDF
        pdf_text = openFile(file_path)  # Now uses Supabase storage
        #print(pdf_text)
        if not pdf_text:
            raise Exception("No text extracted from PDF")
        # Chunk and generate embeddings
        chunks = chunk_text(pdf_text)
        embeddings, vectorizer = generate_embeddings(chunks)
        
        # Store processing results
        file_id = str(len(pdf_storage))
        pdf_storage[file_id] = {
            "chunks": chunks,
            "embeddings": embeddings,
            "vectorizer": vectorizer,
            "file_path": file_path
        }

        print(pdf_storage)
        
        return {
            "file_id": file_id,
            "file_url": file_url,
            "message": "File uploaded successfully"
        }
    
    except Exception as e:
        print(f"Upload error: {e}")
        return {"error": str(e)}

@app.post("/analyze")
async def analyze_document(query: Query):
    try:
        doc_data = pdf_storage.get(query.file_id)
        if not doc_data:
            return {"error": "File not found"}
        
        similar_chunks = retrieve_similar_chunks(
            query.query,
            doc_data["embeddings"],
            doc_data["chunks"],
            doc_data["vectorizer"]
        )
        
        answer = query_chatgpt(query.query, similar_chunks)
        
        return {"answer": answer}
    
    except Exception as e:
        print(f"Analysis error: {e}")
        return {"error": str(e)}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 