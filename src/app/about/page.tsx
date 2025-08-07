import Image from "next/image";
import { chefs, awards } from "@/lib/mock-data";
import ChefCard from "@/components/about/chef-card";
import { Award } from "lucide-react";
import Script from "next/script";

export default function AboutPage() {
  return (
    <>
      <div className="container mx-auto px-4 py-8 sm:py-16">
        <div className="text-center mb-12">
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">About Us</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            The story, the people, and the passion behind Francisco Edibles.
          </p>
        </div>

        <section id="chefs" className="mb-16">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-8">Meet Our Culinary Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {chefs.map(chef => (
              <ChefCard key={chef.id} chef={chef} />
            ))}
          </div>
        </section>

        <section id="awards">
           <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-8">Our Accolades</h2>
           <div className="max-w-2xl mx-auto">
              <div className="border rounded-lg shadow-sm">
                  {awards.map((award, index) => (
                      <div key={award.id} className={`p-4 flex items-center gap-4 ${index < awards.length - 1 ? 'border-b' : ''}`}>
                          <div className="bg-primary/10 p-3 rounded-full">
                              <Award className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                              <p className="font-semibold">{award.title} - {award.year}</p>
                              <p className="text-sm text-muted-foreground">Issued by: {award.issuer}</p>
                          </div>
                      </div>
                  ))}
              </div>
           </div>
        </section>
      </div>
      <Script type='text/javascript' src='//pl27370345.profitableratecpm.com/a9/90/fc/a990fcf2a106aa98c0fdb25760e4dae5.js' />
    </>
  );
}
