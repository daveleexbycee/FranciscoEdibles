"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Flame, Loader2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { auth } from "@/lib/firebase"
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth"

export default function AuthForm() {
  const router = useRouter()
  const { toast } = useToast()
  
  const [signInEmail, setSignInEmail] = useState("")
  const [signInPassword, setSignInPassword] = useState("")
  
  const [signUpName, setSignUpName] = useState("")
  const [signUpEmail, setSignUpEmail] = useState("")
  const [signUpPassword, setSignUpPassword] = useState("")

  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const userCredential = await signInWithEmailAndPassword(auth, signInEmail, signInPassword)
      const user = userCredential.user;

      toast({
        title: "Login Successful",
        description: `Welcome back, ${user.displayName || user.email}!`,
      })

      if (user.email === "georgebowman1972@gmail.com") {
        router.push("/admin")
      } else {
        router.push("/")
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message.replace('Firebase: ', '') || "Please check your credentials and try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword)
      const user = userCredential.user;
      
      await updateProfile(user, {
        displayName: signUpName,
      });

      toast({
        title: "Account Created!",
        description: "Welcome to Francisco Edibles!",
      })
      router.push("/")
    } catch (error: any) {
       toast({
        variant: "destructive",
        title: "Sign-up Failed",
        description: error.message.replace('Firebase: ', '') || "Could not create your account. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Tabs defaultValue="sign-in" className="w-full">
      <div className="flex justify-center mb-6">
        <Link href="/" className="flex items-center gap-2">
            <Flame className="h-8 w-8 text-primary" />
            <span className="font-headline text-2xl font-bold tracking-wide">Francisco Edibles</span>
        </Link>
      </div>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="sign-in">Sign In</TabsTrigger>
        <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
      </TabsList>
      <TabsContent value="sign-in">
        <Card>
          <form onSubmit={handleSignIn}>
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>
                Welcome back! Sign in to access your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-signin">Email</Label>
                <Input 
                  id="email-signin" 
                  type="email" 
                  placeholder="m@example.com" 
                  required 
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-signin">Password</Label>
                <Input 
                  id="password-signin" 
                  type="password" 
                  required 
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
              <Button variant="link" size="sm" className="text-muted-foreground">Forgot your password?</Button>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>
      <TabsContent value="sign-up">
        <Card>
          <form onSubmit={handleSignUp}>
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>
                Create an account to start ordering your favorite meals.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name-signup">Full Name</Label>
                <Input 
                  id="name-signup" 
                  placeholder="John Doe" 
                  required 
                  value={signUpName}
                  onChange={(e) => setSignUpName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-signup">Email</Label>
                <Input 
                  id="email-signup" 
                  type="email" 
                  placeholder="m@example.com" 
                  required 
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-signup">Password (min. 6 characters)</Label>
                <Input 
                  id="password-signup" 
                  type="password" 
                  required 
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  disabled={isLoading}
                  minLength={6}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Account
              </Button>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
