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

const ContactInfoSchema = z.object({
    name: z.string().optional().describe('Contact name.'),
    email: z.string().optional().describe('Contact email address.'),
    phone: z.string().optional().describe('Contact phone number.'),
    company: z.string().optional().describe('Company name.'),
}).describe('Contact information extracted from the content.');


const SummarizeIntentOutputSchema = z.object({
  summary: z.string().describe('A summary of the purchase intent.'),
  productName: z.string().describe('The name of the product mentioned.'),
  reasons: z.array(z.string()).describe('Reasons for the purchase intent.'),
  intentType: z.string().describe('The type of intent signal identified (e.g., "keyword search", "trial download", "pricing page visit", "competitor comparison").'),
  keywords: z.array(z.string()).describe('A list of keywords that triggered the intent signal.'),
  contacts: z.array(ContactInfoSchema).describe('A list of potential contacts related to the purchase intent.'),
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
  1. Analyze the scraped content to identify any signals indicating purchase intent.
  2. Determine the type of intent (e.g., "keyword search", "trial download", "pricing page visit", "competitor comparison").
  3. Extract the name of the specific product being considered.
  4. List the reasons or motivations behind the purchase intent.
  5. Identify and list the specific keywords from the content that indicate this intent.
  6. Extract any contact information available, such as names, emails, phone numbers, and company names. If no contact information is found, return an empty array for contacts.

  Output:
  Provide a concise summary, the product name, reasons for intent, the intent type, a list of keywords, and any contact information found.
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
