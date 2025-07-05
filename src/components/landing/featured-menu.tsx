import { menuItems } from "@/lib/mock-data";
import MenuCard from "../menu/menu-card";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function FeaturedMenu() {
  const featured = menuItems.filter(item => !item.soldOut).slice(0, 3);

  return (
    <section id="featured" className="py-12 sm:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl md:text-4xl font-bold">Our Featured Dishes</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Handpicked by our chefs, these are the dishes you don't want to miss.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map(item => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
        <div className="text-center mt-12">
            <Button size="lg" asChild>
                <Link href="/menu">
                    View Full Menu
                    <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
            </Button>
        </div>
      </div>
    </section>
  );
}
