"use client";

import { useState } from "react";
import { Lightbulb, Bot } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { SummarizeIntentOutput } from "@/ai/flows/intent-summarization";
import { IntentForm } from "@/components/intent-form";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SummarizeIntentOutput | null>(null);

  const handleFormAction = (data: SummarizeIntentOutput | null, isLoading: boolean) => {
    setLoading(isLoading);
    setResult(data);
  };
  
  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12 lg:p-24">
      <div className="w-full max-w-2xl">
        <header className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <Lightbulb className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight text-primary">
              Intent Insights
            </h1>
          </div>
          <p className="text-muted-foreground">
            Uncover customer purchase intentions by analyzing product descriptions and categories.
          </p>
        </header>
        
        <IntentForm onAction={handleFormAction} />

        {loading && <ResultsSkeleton />}

        {!loading && result && (
          <div className="mt-8 animate-in fade-in-50 duration-500">
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                     <Bot className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Purchase Intent Summary</CardTitle>
                    <CardDescription>Generated for: {result.productName}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2 text-foreground/90">Summary</h3>
                  <p className="text-muted-foreground leading-relaxed">{result.summary}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-3 text-foreground/90">Potential Reasons for Purchase</h3>
                  <ul className="space-y-3">
                    {result.reasons.map((reason, index) => (
                      <li key={index} className="flex items-start gap-3">
                         <svg
                          className="w-5 h-5 mt-0.5 text-accent shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                        <span className="text-muted-foreground">{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}

function ResultsSkeleton() {
  return (
    <div className="mt-8">
      <Card className="shadow-lg">
        <CardHeader>
            <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-32" />
                </div>
            </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Skeleton className="h-5 w-32 mb-2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5 mt-2" />
          </div>
          <div>
            <Skeleton className="h-5 w-56 mb-3" />
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Skeleton className="w-5 h-5 mt-0.5 rounded-full" />
                <Skeleton className="h-4 w-full" />
              </div>
              <div className="flex items-start gap-3">
                <Skeleton className="w-5 h-5 mt-0.5 rounded-full" />
                <Skeleton className="h-4 w-11/12" />
              </div>
              <div className="flex items-start gap-3">
                <Skeleton className="w-5 h-5 mt-0.5 rounded-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
