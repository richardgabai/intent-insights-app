'use server';

/**
 * @fileOverview Summarizes intent to purchase from scraped search results.
 *
 * - summarizeIntent - A function that summarizes purchase intent.
 * - SummarizeIntentInput - The input type for the summarizeIntent function.
 * - SummarizeIntentOutput - The return type for the summarizeIntent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeIntentInputSchema = z.object({
  scrapedContent: z
    .string()
    .describe('The scraped content from search engine results pages.'),
  product: z.string().describe('The product of interest.'),
  category: z.string().describe('The product category of interest.'),
});
export type SummarizeIntentInput = z.infer<typeof SummarizeIntentInputSchema>;

const SummarizeIntentOutputSchema = z.object({
  summary: z.string().describe('A summary of the purchase intent.'),
  productName: z.string().describe('The name of the product mentioned.'),
  reasons: z.array(z.string()).describe('Reasons for the purchase intent.'),
});
export type SummarizeIntentOutput = z.infer<typeof SummarizeIntentOutputSchema>;

export async function summarizeIntent(input: SummarizeIntentInput): Promise<SummarizeIntentOutput> {
  return summarizeIntentFlow(input);
}

const summarizeIntentPrompt = ai.definePrompt({
  name: 'summarizeIntentPrompt',
  input: {schema: SummarizeIntentInputSchema},
  output: {schema: SummarizeIntentOutputSchema},
  prompt: `You are an AI assistant helping to identify purchase intent from scraped search results for B2B products.
  Your goal is to extract and summarize key information indicating a user's intent to purchase a specific product.

  Category: {{{category}}}
  Product: {{{product}}}
  Scraped Content: {{{scrapedContent}}}

  Instructions:
  1. Analyze the scraped content to identify any signals indicating purchase intent, such as mentions of pricing, demo requests, competitor comparisons, and timelines.
  2. Extract the name of the specific product being considered.
  3. List the reasons or motivations behind the purchase intent, based on the scraped content.

  Output:
  Provide a concise summary of the purchase intent, the specific product name, and a list of reasons for the intent.
  Follow the schema description for formatting.`,
});

const summarizeIntentFlow = ai.defineFlow(
  {
    name: 'summarizeIntentFlow',
    inputSchema: SummarizeIntentInputSchema,
    outputSchema: SummarizeIntentOutputSchema,
  },
  async input => {
    const {output} = await summarizeIntentPrompt(input);
    return output!;
  }
);
