import MenuCard from "../menu/menu-card";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { MenuItem } from "@/lib/mock-data";

async function getFeaturedItems(): Promise<MenuItem[]> {
   try {
    const q = query(
      collection(db, "menuItems"), 
      where("soldOut", "==", false), 
      limit(3)
    );
    const querySnapshot = await getDocs(q);
    const itemsData = querySnapshot.docs.map(doc => ({ ...(doc.data() as Omit<MenuItem, 'id'>), id: doc.id }));
    return itemsData;
  } catch (error) {
    console.error("Error fetching featured menu items: ", error);
    return [];
  }
}

export default async function FeaturedMenu() {
  const featured = await getFeaturedItems();

  return (
    <section id="featured" className="py-12 sm:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl md:text-4xl font-bold">Our Featured Dishes</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Handpicked by our chefs, these are the dishes you don't want to miss.
          </p>
        </div>
        {featured.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featured.map(item => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
           <div className="text-center text-muted-foreground">
             <p>Our featured dishes are being prepared. Please check back soon!</p>
           </div>
        )}
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
