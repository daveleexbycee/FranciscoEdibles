"use client";

import { useState, useEffect } from "react";
import MenuCard from "@/components/menu/menu-card";
import { type MenuItem } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search } from "lucide-react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

type MenuItemWithId = MenuItem & { id: string };

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItemWithId[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchMenuItems = async () => {
      setIsLoading(true);
      try {
        const q = query(collection(db, "menuItems"), where("soldOut", "==", false));
        const querySnapshot = await getDocs(q);
        const itemsData = querySnapshot.docs.map(doc => ({ ...doc.data() as MenuItem, id: doc.id }));
        setMenuItems(itemsData);
        
        const uniqueCategories = ['All', ...new Set(itemsData.map(item => item.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching menu items: ", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMenuItems();
  }, []);

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch && !item.soldOut;
  });

  return (
    <div className="container mx-auto px-4 py-8 sm:py-16">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">Our Menu</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Explore our wide range of delicious dishes, crafted with the freshest ingredients.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-8 sticky top-16 bg-background/90 py-4 z-40">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search for a dish..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex-shrink-0 flex-grow-0">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="shrink-0"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredItems.map(item => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">No dishes found. Try a different search or category.</p>
        </div>
      )}
    </div>
  );
}
