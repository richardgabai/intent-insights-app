"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { saveInsight } from "@/app/actions";
import { Button } from "@/components/ui/button";
import type { SummarizeIntentOutput } from "@/ai/flows/intent-summarization";
import { useToast } from "@/hooks/use-toast";

interface SaveButtonProps {
  insight: SummarizeIntentOutput;
}

export function SaveButton({ insight }: SaveButtonProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    const result = await saveInsight(insight);

    if (result.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      });
    } else if (result.success) {
      toast({
        title: "Success",
        description: "Insight saved successfully.",
      });
    }

    setLoading(false);
  };

  return (
    <Button onClick={handleSave} className="w-full" disabled={loading}>
      {loading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Saving...
        </>
      ) : (
        <>
          <Save className="mr-2 h-4 w-4" />
          Save Insight
        </>
      )}
    </Button>
  );
}
