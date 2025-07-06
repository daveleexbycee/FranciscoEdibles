'use server';

/**
 * @fileOverview A flow to compose and "send" a welcome email to new users.
 *
 * - sendWelcomeEmail - Composes and logs a welcome email for a new user.
 * - WelcomeEmailInput - The input type for the sendWelcomeEmail function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WelcomeEmailInputSchema = z.object({
  name: z.string().describe("The new user's name."),
  email: z.string().email().describe("The new user's email address."),
});
export type WelcomeEmailInput = z.infer<typeof WelcomeEmailInputSchema>;

const EmailContentSchema = z.object({
  subject: z.string().describe('The subject line of the email.'),
  body: z.string().describe('The HTML body of the email. It should include a call to action button linking to "/menu".'),
});

export async function sendWelcomeEmail(input: WelcomeEmailInput): Promise<void> {
  return sendWelcomeEmailFlow(input);
}

const prompt = ai.definePrompt({
  name: 'welcomeEmailPrompt',
  input: {schema: WelcomeEmailInputSchema},
  output: {schema: EmailContentSchema},
  prompt: `You are a marketing assistant for "Francisco Edibles", a Nigerian food delivery service.
  Generate a short and simple welcome email for a new user.

  User's Name: {{name}}

  The email should have a friendly and welcoming tone.
  The body must contain an HTML link that looks like a button, inviting the user to view the menu. The link's href should be "/menu".

  Example response format:
  {
    "subject": "Welcome to Francisco Edibles!",
    "body": "<h3>Hi {{name}}!</h3><p>Welcome to the family. We're so excited to bring the taste of Nigeria to you. Ready to explore our delicious dishes?</p><a href='/menu' style='display:inline-block;padding:10px 20px;background-color:#A55519;color:white;text-decoration:none;border-radius:5px;'>View Menu</a>"
  }`,
});

const sendWelcomeEmailFlow = ai.defineFlow(
  {
    name: 'sendWelcomeEmailFlow',
    inputSchema: WelcomeEmailInputSchema,
    outputSchema: z.void(),
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      console.error('Failed to generate welcome email content.');
      return;
    }

    // In a real application, you would integrate an email sending service here.
    // For this prototype, we'll log the composed email to the console.
    console.log('--- SIMULATING WELCOME EMAIL ---');
    console.log(`To: ${input.email}`);
    console.log(`Subject: ${output.subject}`);
    console.log(`Body:`);
    console.log(output.body);
    console.log('-------------------------------');
  }
);
