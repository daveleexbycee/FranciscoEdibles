"use client"

import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2 } from "lucide-react"

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

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
           
           <div className="space-y-2">
              <h3 className="font-semibold">Account Details</h3>
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
