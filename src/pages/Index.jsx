import React, { useState } from "react";
import Header from "@/components/Header";
import FileUpload from "@/components/FileUpload";
import QueryInput from "@/components/QueryInput";
import ResponseDisplay from "@/components/ResponseDisplay";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { analyzeDocument } from "@/lib/api"; // Adjust the import path as necessary

const Index = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [query, setQuery] = useState(null);
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Function to handle file upload
  const handleFileUpload = (file) => {
    setUploadedFile(file);
    // Reset the query and response when a new file is uploaded
    setQuery(null);
    setResponse(null);
  };

  // Function to handle query submission
  const handleSubmitQuery = async (queryText) => {
    setQuery(queryText);
    setIsLoading(true);
    toast.success("Query submitted successfully!");

    console.log("Query submitted:", queryText);
    console.log("Uploaded file:", uploadedFile);

    // Call API to analyze the document
    const response = await analyzeDocument(queryText, uploadedFile);
    console.log(response.answer);

    const formatResponse = (response) => {
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(response); // Parse the response string into a JSON object
      } catch (error) {
        console.error("Error parsing response:", error);
        return "Error parsing the response.";
      }

      return `
    Date: ${date}
    Confidence: ${confidence}
    Source Text: ${source_text}
  `;
    };

    const responseText = formatResponse(response.answer);
    setResponse(responseText);

    // Update response after sanitizing curly braces
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col law-background">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-law-navy mb-4">
              Contract Analysis Made Simple
            </h1>
            <p className="text-law-blue max-w-2xl mx-auto">
              Upload your legal contract and ask questions in plain English. Our
              AI-powered analysis will provide you with quick, accurate
              insights.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <FileUpload onFileUpload={handleFileUpload} />
            <QueryInput
              onSubmitQuery={handleSubmitQuery}
              isFileUploaded={!!uploadedFile}
            />
            <ResponseDisplay response={response} isLoading={isLoading} />
          </div>

          {!uploadedFile && !query && !response && (
            <div className="mt-12">
              <h2 className="text-xl text-center font-semibold text-law-navy mb-6">
                How It Works
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="law-card text-center">
                  <div className="bg-law-light-gray inline-flex items-center justify-center w-12 h-12 rounded-full mb-4">
                    <span className="text-law-navy font-bold text-xl">1</span>
                  </div>
                  <h3 className="text-lg font-semibold text-law-navy mb-2">
                    Upload Contract
                  </h3>
                  <p className="text-law-gray text-sm">
                    Upload your contract in PDF, DOCX, or TXT format.
                  </p>
                </div>

                <div className="law-card text-center">
                  <div className="bg-law-light-gray inline-flex items-center justify-center w-12 h-12 rounded-full mb-4">
                    <span className="text-law-navy font-bold text-xl">2</span>
                  </div>
                  <h3 className="text-lg font-semibold text-law-navy mb-2">
                    Ask Questions
                  </h3>
                  <p className="text-law-gray text-sm">
                    Enter your legal query in plain English.
                  </p>
                </div>

                <div className="law-card text-center">
                  <div className="bg-law-light-gray inline-flex items-center justify-center w-12 h-12 rounded-full mb-4">
                    <span className="text-law-navy font-bold text-xl">3</span>
                  </div>
                  <h3 className="text-lg font-semibold text-law-navy mb-2">
                    Get Insights
                  </h3>
                  <p className="text-law-gray text-sm">
                    Receive detailed analysis and insights about your contract.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
