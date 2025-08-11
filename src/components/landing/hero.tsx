
"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import InstallPWA from '../shared/install-pwa';

const carouselImages = [
  { src: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxuaWdlcmlhbiUyMGZvb2RzfGVufDB8fHx8MTc1MTk3MjE3Mnww&ixlib=rb-4.1.0&q=80&w=1080', alt: 'A spread of delicious Nigerian dishes', hint: 'nigerian food' },
  { src: 'https://images.unsplash.com/photo-1638436684761-7e59f8a9072f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8bmlnZXJpYW4lMjBmb29kfGVufDB8fHx8MTc1MTk3MjI3Nnww&ixlib=rb-4.1.0&q=80&w=1080', alt: 'Grilled Suya skewers', hint: 'suya skewers' },
  { src: 'https://images.unsplash.com/photo-1595272568891-123402d0fb3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxNXx8Y2FrZXN8ZW58MHx8fHwxNzUxOTcyNDA5fDA&ixlib=rb-4.1.0&q=80&w=1080', alt: 'Egusi soup with fufu', hint: 'egusi soup' },
  { src: 'https://images.unsplash.com/photo-1608039783021-6116a558f0c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxwYXN0cnl8ZW58MHx8fHwxNzUxOTcyNDU0fDA&ixlib=rb-4.1.0&q=80&w=1080', alt: 'Fried plantains', hint: 'fried plantains' },
];

export default function Hero() {
  
  return (
    <section className="w-full py-16 sm:py-24 md:py-32 bg-secondary/30">
      <div className="container px-4 md:px-6">
        <div className="grid gap-8 lg:grid-cols-1">
          <div className="flex flex-col justify-center items-center text-center space-y-6">
            <h1 className="font-headline text-4xl font-bold tracking-tighter text-primary sm:text-5xl xl:text-6xl/none">
              A Symphony of Authentic Flavors
            </h1>
            
            <Carousel className="w-full max-w-2xl rounded-xl overflow-hidden" opts={{ loop: true }}>
              <CarouselContent>
                {carouselImages.map((image, index) => (
                  <CarouselItem key={index}>
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={650}
                      height={550}
                      className="w-full aspect-video object-cover"
                      data-ai-hint={image.hint}
                      priority={index === 0}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-4 hidden sm:flex" />
              <CarouselNext className="absolute right-4 hidden sm:flex" />
            </Carousel>

            <p className="max-w-[600px] text-muted-foreground md:text-xl">
              Experience the vibrant flavors of Nigeria, delivered right to your door. We bring authentic dishes to life with every meal.
            </p>

            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button size="lg" asChild>
                <Link href="/menu">
                  Order Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <InstallPWA displayType="button" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
