
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Search } from 'lucide-react';

const QueryInput = ({ 
  onSubmitQuery, 
  isFileUploaded 
}: { 
  onSubmitQuery: (query: string) => void,
  isFileUploaded: boolean
}) => {
  const [query, setQuery] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && isFileUploaded) {
      onSubmitQuery(query);
    }
  };
  
  const examples = [
    "What are the key obligations for both parties?",
    "Identify any termination clauses in this contract.",
    "Is there a non-compete clause?",
    "What is the payment schedule outlined in the contract?"
  ];
  
  return (
    <div className="law-card mt-6">
      <h2 className="text-xl font-semibold text-law-navy mb-4">Ask a Question</h2>
      
      <form onSubmit={handleSubmit}>
        <Textarea
          placeholder={isFileUploaded 
            ? "What would you like to know about this contract?" 
            : "Please upload a contract file first..."}
          className="min-h-[120px] mb-4 border-law-light-gray focus:border-law-blue"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={!isFileUploaded}
        />
        
        <Button 
          type="submit" 
          className="w-full bg-law-navy hover:bg-law-blue text-white"
          disabled={!isFileUploaded || !query.trim()}
        >
          <Search className="mr-2 h-4 w-4" /> Submit Query
        </Button>
      </form>
      
      {isFileUploaded && (
        <div className="mt-6">
          <p className="text-sm text-law-gray mb-2">Example questions:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {examples.map((example, index) => (
              <button
                key={index}
                className="text-left text-sm p-2 bg-law-light-gray hover:bg-gray-200 rounded text-law-blue transition-colors"
                onClick={() => setQuery(example)}
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QueryInput;
