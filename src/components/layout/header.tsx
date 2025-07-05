"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import CartIcon from '@/components/cart/cart-icon';
import { Flame, Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ThemeToggle } from './theme-toggle';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Flame className="h-7 w-7 text-primary" />
          <span className="hidden md:inline font-headline text-xl font-bold tracking-wide">Francisco Edibles</span>
        </Link>
        <nav className="hidden md:flex gap-6 items-center">
          <Link href="/menu" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Menu
          </Link>
          <Link href="/#about" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            About
          </Link>
          <Link href="/#contact" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Contact
          </Link>
        </nav>
        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
          <CartIcon />
          <Button className="hidden sm:inline-flex" asChild>
            <Link href="/login">Sign In</Link>
          </Button>
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="flex flex-col">
                <div className="mt-8">
                  <Link href="/" className="mb-8 flex items-center gap-2">
                    <Flame className="h-7 w-7 text-primary" />
                    <span className="font-headline text-xl font-bold tracking-wide">Francisco Edibles</span>
                  </Link>
                  <div className="flex flex-col gap-6">
                    <Link href="/menu" className="text-lg font-medium">
                      Menu
                    </Link>
                    <Link href="/#about" className="text-lg font-medium">
                      About
                    </Link>
                    <Link href="/#contact" className="text-lg font-medium">
                      Contact
                    </Link>
                  </div>
                </div>

                <div className="mt-auto flex flex-col gap-4 border-t pt-6">
                  <Button asChild>
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <div className="flex items-center justify-between rounded-md border p-2">
                    <span className="text-sm font-medium">Switch Theme</span>
                    <ThemeToggle />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
