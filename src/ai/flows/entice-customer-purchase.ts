'use server';

/**
 * @fileOverview A flow that generates an engaging and mouth-watering arrangement of menu items to entice customers to make a purchase.
 *
 * - enticeCustomerPurchase - A function that takes a list of menu items and returns a visually appealing arrangement of them.
 * - EnticeCustomerPurchaseInput - The input type for the enticeCustomerPurchase function.
 * - EnticeCustomerPurchaseOutput - The return type for the enticeCustomerPurchase function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MenuItemSchema = z.object({
  name: z.string().describe('The name of the menu item.'),
  description: z.string().describe('A description of the menu item.'),
  imageUrl: z.string().describe('URL of the menu item image.'),
  price: z.number().describe('The price of the menu item.'),
});

const EnticeCustomerPurchaseInputSchema = z.object({
  menuItems: z.array(MenuItemSchema).describe('A list of menu items to display.'),
});

export type EnticeCustomerPurchaseInput = z.infer<typeof EnticeCustomerPurchaseInputSchema>;

const EnticeCustomerPurchaseOutputSchema = z.object({
  arrangementDescription: z.string().describe('A description of the arrangement of menu items.'),
  imagePrompt: z.string().describe('A prompt suitable for use with an image generation model to create a visually appealing arrangement of the menu items'),
});

export type EnticeCustomerPurchaseOutput = z.infer<typeof EnticeCustomerPurchaseOutputSchema>;

export async function enticeCustomerPurchase(input: EnticeCustomerPurchaseInput): Promise<EnticeCustomerPurchaseOutput> {
  return enticeCustomerPurchaseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'enticeCustomerPurchasePrompt',
  input: {schema: EnticeCustomerPurchaseInputSchema},
  output: {schema: EnticeCustomerPurchaseOutputSchema},
  prompt: `You are a creative marketing specialist tasked with creating engaging food displays.
  Given the following menu items, create a description of an arrangement that would entice customers to make a purchase.
  Also generate an image prompt that could be used to generate an image of this arrangement.

  Menu Items:
  {{#each menuItems}}
  - Name: {{name}}
    Description: {{description}}
    Image URL: {{imageUrl}}
    Price: {{price}}
  {{/each}}

  The arrangement description should focus on visual appeal and mouth-watering details.
  The image prompt should be detailed enough to generate a realistic image of the arrangement.

  Here's an example output format:
  {
    "arrangementDescription": "A mouth-watering display of our featured menu items, arranged on a rustic wooden table with soft lighting.",
    "imagePrompt": "A high-resolution photograph of a rustic wooden table laden with Francisco Edibles most popular dishes. The dishes are artfully arranged with garnishes. Soft, warm lighting creates an inviting atmosphere."
  }
  `,
});

const enticeCustomerPurchaseFlow = ai.defineFlow(
  {
    name: 'enticeCustomerPurchaseFlow',
    inputSchema: EnticeCustomerPurchaseInputSchema,
    outputSchema: EnticeCustomerPurchaseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
