'use server';

import { z } from 'zod';
import { refineSearchQueries } from '@/ai/flows/query-refinement';
import { summarizeIntent, type SummarizeIntentOutput } from '@/ai/flows/intent-summarization';

const insightSchema = z.object({
  product: z.string().min(2, { message: 'Product must be at least 2 characters.' }),
  category: z.string().min(2, { message: 'Category must be at least 2 characters.' }),
});

export async function getIntentInsights(
  formData: FormData
): Promise<{ data?: SummarizeIntentOutput; error?: string }> {
  const validatedFields = insightSchema.safeParse({
    product: formData.get('product'),
    category: formData.get('category'),
  });

  if (!validatedFields.success) {
    const errorMessages = Object.values(validatedFields.error.flatten().fieldErrors).flat();
    return {
      error: errorMessages.join(' ') || 'Invalid input.'
    };
  }
  
  const { product, category } = validatedFields.data;

  try {
    const { refinedQueries } = await refineSearchQueries({
      productDescription: product,
      category: category,
    });
    
    if (!refinedQueries || refinedQueries.length === 0) {
        return { error: "Could not generate refined queries to analyze." };
    }

    // Simulate SERP scraping by concatenating the refined queries.
    // In a real application, you would use a web scraping service here.
    const scrapedContent = refinedQueries.join('\n');

    const intentSummary = await summarizeIntent({
      scrapedContent,
      product,
      category,
    });

    return { data: intentSummary };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred.';
    return { error: `Analysis failed: ${errorMessage}` };
  }
}
