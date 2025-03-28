
import React from 'react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface ResponseDisplayProps {
  response: string | null;
  isLoading: boolean;
}

const ResponseDisplay = ({ response, isLoading }: ResponseDisplayProps) => {
  if (!response && !isLoading) return null;
  
  return (
    <div className="law-card mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-law-navy">Analysis Results</h2>
        {isLoading && (
          <div className="flex items-center">
            <div className="animate-spin h-4 w-4 border-2 border-law-navy border-t-transparent rounded-full mr-2"></div>
            <span className="text-sm text-law-gray">Processing...</span>
          </div>
        )}
      </div>
      
      <Separator className="mb-4" />
      
      {isLoading ? (
        <div className="p-4 text-center">
          <p className="text-law-blue mb-2">Analyzing your contract...</p>
          <p className="text-sm text-law-gray">This may take a moment depending on the contract's complexity</p>
        </div>
      ) : response ? (
        <Card className="p-4 bg-white border border-law-light-gray">
          <div className="prose max-w-none">
            <p className="text-law-navy whitespace-pre-line">{response}</p>
          </div>
        </Card>
      ) : null}
    </div>
  );
};

export default ResponseDisplay;
