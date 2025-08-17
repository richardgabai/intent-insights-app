"use client";

import { useState } from 'react';
import { Search } from 'lucide-react';
import { getIntentInsights } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { SummarizeIntentOutput } from "@/ai/flows/intent-summarization";
import { useToast } from "@/hooks/use-toast";

interface IntentFormProps {
    onAction: (data: SummarizeIntentOutput | null, loading: boolean) => void;
}

export function IntentForm({ onAction }: IntentFormProps) {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        onAction(null, true);

        const formData = new FormData(event.currentTarget);
        const result = await getIntentInsights(formData);

        if (result.error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: result.error,
            });
            onAction(null, false);
        } else if (result.data) {
            onAction(result.data, false);
        }
        
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Describe your Product</CardTitle>
                    <CardDescription>
                        Enter details about a product and its category to generate purchase intent signals.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="product">Product</Label>
                        <Input
                            id="product"
                            name="product"
                            placeholder="e.g., Payment orchestration platform"
                            required
                            disabled={loading}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Input
                            id="category"
                            name="category"
                            placeholder="e.g., Fintech"
                            required
                            disabled={loading}
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <Search className="mr-2 h-4 w-4" />
                                Generate Insights
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
}
