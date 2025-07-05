import { enticeCustomerPurchase } from '@/ai/flows/entice-customer-purchase';
import { menuItems } from '@/lib/mock-data';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import {
  Card,
  CardContent,
} from "@/components/ui/card"

export default async function Hero() {
  const featuredItemsForAI = menuItems.slice(0, 3);
  let aiData;
  try {
    aiData = await enticeCustomerPurchase({ menuItems: featuredItemsForAI });
  } catch (error) {
    console.error("AI flow failed, using fallback data.", error);
    aiData = {
      arrangementDescription: "A delicious spread of our finest dishes, perfectly arranged to tempt your taste buds. From savory mains to delightful sides, there's something for everyone.",
      imagePrompt: "delicious food",
    };
  }

  // Extract keywords for the data-ai-hint
  const hintKeywords = aiData.imagePrompt.split(' ').slice(0, 2).join(' ');

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary/30">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_550px] lg:gap-12 xl:grid-cols-[1fr_650px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-4">
              <h1 className="font-headline text-4xl font-bold tracking-tighter text-primary sm:text-5xl xl:text-6xl/none">
                A Symphony of Authentic Flavors
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                {aiData.arrangementDescription}
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button size="lg" asChild>
                <Link href="/menu">
                  Order Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#featured">
                  View Specials
                </Link>
              </Button>
            </div>
          </div>
          <Card className="overflow-hidden">
            <CardContent className="p-0">
               <Image
                src="https://placehold.co/650x550.png"
                alt="A delicious spread of food from Francisco Edibles"
                width={650}
                height={550}
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:aspect-square"
                data-ai-hint={hintKeywords}
                priority
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
