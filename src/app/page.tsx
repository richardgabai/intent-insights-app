"use client";

import { useState } from "react";
import { Lightbulb, Bot, Hash, User, Building, Mail, Phone, Tag } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { SummarizeIntentOutput } from "@/ai/flows/intent-summarization";
import { IntentForm } from "@/components/intent-form";
import { SaveButton } from "@/components/save-button";
import { Badge } from "@/components/ui/badge";

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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-foreground/90 mb-2 flex items-center gap-2"><Tag className="w-4 h-4" /> Intent Type</h4>
                    <Badge variant="secondary">{result.intentType}</Badge>
                  </div>
                  <div>
                     <h4 className="font-semibold text-foreground/90 mb-2 flex items-center gap-2"><Hash className="w-4 h-4" /> Keywords</h4>
                     <div className="flex flex-wrap gap-2">
                      {result.keywords.map((keyword, index) => (
                        <Badge key={index} variant="outline">{keyword}</Badge>
                      ))}
                    </div>
                  </div>
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
                
                {result.contacts && result.contacts.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3 text-foreground/90">Contacts Identified</h3>
                    <div className="space-y-4">
                      {result.contacts.map((contact, index) => (
                        <div key={index} className="p-3 bg-secondary/50 rounded-md border">
                          <ul className="space-y-2 text-sm text-muted-foreground">
                            {contact.name && <li className="flex items-center gap-2"><User className="w-4 h-4 text-accent" /> {contact.name}</li>}
                            {contact.company && <li className="flex items-center gap-2"><Building className="w-4 h-4 text-accent" /> {contact.company}</li>}
                            {contact.email && <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-accent" /> {contact.email}</li>}
                            {contact.phone && <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-accent" /> {contact.phone}</li>}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
              </CardContent>
              <CardFooter>
                <SaveButton insight={result} />
              </CardFooter>
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
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Skeleton className="h-5 w-24 mb-2" />
                <Skeleton className="h-6 w-32" />
              </div>
              <div>
                 <Skeleton className="h-5 w-24 mb-2" />
                 <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
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
            </div>
          </div>
          <div>
            <Skeleton className="h-5 w-40 mb-3" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
