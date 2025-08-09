
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import CartIcon from '@/components/cart/cart-icon';
import { Flame, Menu, LogOut, User as UserIcon, Shield, Loader2, BookOpen, Info, Mail } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet"
import { ThemeToggle } from './theme-toggle';
import { useAuth } from '@/context/auth-context';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


export default function Header() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  }

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  const UserNav = () => {
    if (loading) {
      return <Button variant="ghost" size="icon" className="w-10 h-10"><Loader2 className="animate-spin" /></Button>
    }

    if (user) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.displayName}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {user.email?.toLowerCase() === "agbidave40@gmail.com" && (
               <DropdownMenuItem onClick={() => router.push('/admin')}>
                <Shield className="mr-2 h-4 w-4" />
                <span>Admin</span>
              </DropdownMenuItem>
            )}
             <DropdownMenuItem onClick={() => router.push('/profile')}>
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }

    return (
      <Button asChild>
        <Link href="/login">Sign In</Link>
      </Button>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Flame className="h-7 w-7 text-primary" />
          <span className="hidden md:inline font-headline text-xl font-bold tracking-wide">Francisco Edibles</span>
        </Link>
        <nav className="hidden md:flex gap-8 items-center">
          <Link href="/menu" className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            <BookOpen className="h-4 w-4" />
            <span>Menu</span>
          </Link>
          <Link href="/about" className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            <Info className="h-4 w-4" />
            <span>About</span>
          </Link>
          <Link href="/#contact" className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            <Mail className="h-4 w-4" />
            <span>Contact</span>
          </Link>
        </nav>
        <div className="flex items-center gap-2 md:gap-4">
          <CartIcon />
          <div className="flex items-center gap-2">
            <UserNav />
            <ThemeToggle />
          </div>
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="flex flex-col">
                <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                <div className="mt-8">
                  <Link href="/" className="mb-8 flex items-center gap-2">
                    <Flame className="h-7 w-7 text-primary" />
                    <span className="font-headline text-xl font-bold tracking-wide">Francisco Edibles</span>
                  </Link>
                  <div className="flex flex-col gap-6">
                    <SheetClose asChild>
                      <Link href="/menu" className="text-lg font-medium">Menu</Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link href="/about" className="text-lg font-medium">About</Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link href="/#contact" className="text-lg font-medium">Contact</Link>
                    </SheetClose>
                  </div>
                </div>

                <div className="mt-auto flex flex-col gap-4 border-t pt-6">
                  {loading ? <Button disabled><Loader2 className="mr-2 h-4 w-4 animate-spin" />Loading...</Button> : user ? (
                    <>
                      {user.email?.toLowerCase() === "agbidave40@gmail.com" && (
                        <SheetClose asChild>
                           <Button variant="outline" onClick={() => router.push('/admin')}>Admin</Button>
                        </SheetClose>
                      )}
                      <SheetClose asChild>
                         <Button onClick={() => router.push('/profile')}>My Profile</Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button variant="secondary" onClick={handleSignOut}>Sign Out</Button>
                      </SheetClose>
                    </>
                  ) : (
                    <SheetClose asChild>
                       <Button asChild>
                        <Link href="/login">Sign In</Link>
                      </Button>
                    </SheetClose>
                  )}
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

    