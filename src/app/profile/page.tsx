
"use client"

import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Download, Loader2 } from "lucide-react"

// Define the type for the beforeinstallprompt event
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed',
    platform: string
  }>;
  prompt(): Promise<void>;
}


export default function ProfilePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);


  useEffect(() => {
    // Check if the app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsAppInstalled(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);


  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  }

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  const handleDownloadClick = async () => {
    if (!deferredPrompt) {
      return;
    }
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    // We've used the prompt, and can't use it again, so clear it
    setDeferredPrompt(null);
    if (outcome === 'accepted') {
      setIsAppInstalled(true);
    }
  };


  if (loading || !user) {
    return (
        <div className="container flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:py-16">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-headline">My Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
           <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                <AvatarFallback className="text-3xl">{getInitials(user.displayName)}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                  <p className="text-xl font-semibold">{user.displayName}</p>
                  <p className="text-muted-foreground">{user.email}</p>
              </div>
           </div>
           
           <div className="space-y-4">
              <h3 className="font-semibold">Account Details</h3>
               {deferredPrompt && !isAppInstalled && (
                <Card className="p-4 bg-muted/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Get the App</p>
                      <p className="text-sm text-muted-foreground">Install Francisco Edibles on your home screen.</p>
                    </div>
                    <Button onClick={handleDownloadClick}>
                      <Download className="mr-2 h-4 w-4" />
                      Install
                    </Button>
                  </div>
                </Card>
              )}
              <p className="text-sm text-muted-foreground">More profile management features coming soon!</p>
           </div>
           
           <Button onClick={handleSignOut} variant="outline" className="w-full">
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
