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

  const handleFileUpload = (file) => {
    setUploadedFile(file);
    // Reset the query and response when a new file is uploaded
    setQuery(null);
    setResponse(null);
  };

  const handleSubmitQuery = async (queryText) => {
    setQuery(queryText);
    setIsLoading(true);
    toast.success("Query submitted successfully!");

    console.log("Query submitted:", queryText);
    console.log("Uploaded file:", uploadedFile);

    const response = await analyzeDocument(queryText, uploadedFile);
    console.log(response.answer);

    setResponse(response.answer);
    setIsLoading(false);
    // Show a toast notification for the response
    toast.success("Response received!");
    // Show a toast notification for the query

    // Simulate API call to backend
    /*setTimeout(() => {
      // This is where you would normally make an API call to your backend
      // For now, we'll simulate a response
      
      const mockResponses = {
        "What are the key obligations for both parties?": 
          "Based on the analysis of the uploaded contract, the key obligations are:\n\n" +
          "For the Client:\n" +
          "• Payment of $10,000 in monthly installments\n" +
          "• Providing necessary information and materials\n" +
          "• Reviewing and approving deliverables within 7 business days\n\n" +
          "For the Service Provider:\n" +
          "• Delivering services according to the agreed timeline\n" +
          "• Maintaining confidentiality of client information\n" +
          "• Providing weekly progress reports\n" +
          "• Making revisions as requested (up to 2 rounds per deliverable)",
          
        "Identify any termination clauses in this contract.":
          "The contract contains the following termination clauses:\n\n" +
          "1. Termination for Convenience: Either party may terminate with 30 days written notice\n\n" +
          "2. Termination for Cause: Immediate termination is permitted if:\n" +
          "   • Either party breaches a material term and fails to cure within 15 days\n" +
          "   • Either party files for bankruptcy or insolvency\n\n" +
          "3. Effect of Termination:\n" +
          "   • Client must pay for all services rendered up to termination date\n" +
          "   • All confidential information must be returned or destroyed\n" +
          "   • Sections on confidentiality, intellectual property, and limitation of liability survive termination",
          
        "Is there a non-compete clause?":
          "Yes, the contract contains a non-compete clause in Section 8.2.\n\n" +
          "Key provisions of the non-compete clause:\n\n" +
          "• The service provider agrees not to directly or indirectly engage in business activities that compete with the client's core business\n" +
          "• Geographic limitation: Within a 50-mile radius of client's primary place of business\n" +
          "• Duration: For the term of the agreement and 12 months following termination\n" +
          "• The clause specifically excludes existing clients of the service provider as listed in Exhibit B\n\n" +
          "Note: The enforceability of this clause may vary by jurisdiction. In some states, non-compete provisions are subject to stringent requirements or may be unenforceable.",
          
        "What is the payment schedule outlined in the contract?":
          "The payment schedule outlined in the contract is as follows:\n\n" +
          "• Initial deposit: 25% of total contract value ($2,500) due upon signing\n" +
          "• Progress payment 1: 25% ($2,500) due upon completion of milestone 1 (delivery of initial draft)\n" +
          "• Progress payment 2: 25% ($2,500) due upon completion of milestone 2 (delivery of revised draft)\n" +
          "• Final payment: 25% ($2,500) due upon project completion and client approval\n\n" +
          "Additional payment terms:\n" +
          "• All invoices are payable within 15 days of receipt\n" +
          "• Late payments are subject to a 1.5% monthly interest charge\n" +
          "• All payments are to be made via bank transfer to the account specified in Exhibit A"
      };
      
      // Generate a response based on the query
      const defaultResponse = "Based on the analysis of your contract, I couldn't find specific information related to your query. Please try rephrasing your question or ask about a different aspect of the contract.";
      
      // Check if there's a mock response for this exact query, otherwise generate a generic response
      const responseText = mockResponses[queryText] || defaultResponse;
      
      setResponse(responseText);
      setIsLoading(false);
    }, 2000);*/
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
