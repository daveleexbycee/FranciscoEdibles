
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
  GoogleAuthProvider,
  signInWithPopup,
  getAdditionalUserInfo
} from "firebase/auth"
import { sendWelcomeEmail } from "@/ai/flows/send-welcome-email"

const GoogleIcon = () => (
  <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 111.8 512 0 400.2 0 261.8S111.8 11.6 244 11.6c67.8 0 125.2 28.2 166.7 73.1l-66.2 64.9c-20-18.4-47.9-30.8-79.5-30.8-62.3 0-113.8 52.3-113.8 116.8s51.5 116.8 113.8 116.8c70.4 0 98.7-52.9 103.5-79.2H244v-64.8h242.1c2.9 15.6 4.9 31.9 4.9 48.9z"></path></svg>
)

export default function AuthForm() {
  const router = useRouter()
  const { toast } = useToast()
  
  const [signInEmail, setSignInEmail] = useState("")
  const [signInPassword, setSignInPassword] = useState("")
  
  const [signUpName, setSignUpName] = useState("")
  const [signUpEmail, setSignUpEmail] = useState("")
  const [signUpPassword, setSignUpPassword] = useState("")

  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setGoogleLoading] = useState(false)

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

      if (user.email?.toLowerCase() === "agbidave40@gmail.com") {
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

      if (user.email) {
        try {
          await sendWelcomeEmail({ name: signUpName, email: user.email });
        } catch (emailError) {
          console.error("Failed to send welcome email:", emailError);
        }
      }

      toast({
        title: "Account Created!",
        description: "Welcome to Francisco Edibles!",
      })
      if (user.email?.toLowerCase() === "agbidave40@gmail.com") {
        router.push("/admin")
      } else {
        router.push("/")
      }
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

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const additionalUserInfo = getAdditionalUserInfo(result);
      if (additionalUserInfo?.isNewUser && user.email) {
        try {
          await sendWelcomeEmail({ name: user.displayName || "there", email: user.email });
        } catch (emailError) {
          console.error("Failed to send welcome email for Google sign-up:", emailError);
        }
      }

      toast({
        title: "Login Successful",
        description: `Welcome, ${user.displayName || user.email}!`,
      });
      if (user.email?.toLowerCase() === "agbidave40@gmail.com") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (error: any) {
       toast({
        variant: "destructive",
        title: "Google Sign-In Failed",
        description: error.message.replace('Firebase: ', '') || "Could not sign in with Google. Please try again.",
      });
    } finally {
      setGoogleLoading(false);
    }
  };


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
                  disabled={isLoading || isGoogleLoading}
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
                  disabled={isLoading || isGoogleLoading}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={isLoading || isGoogleLoading}>
                {isLoading && !isGoogleLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
               <div className="relative w-full">
                <div aria-hidden="true" className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                    Or continue with
                    </span>
                </div>
              </div>
               <Button variant="outline" type="button" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading || isGoogleLoading}>
                 {isGoogleLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                 {!isGoogleLoading && <GoogleIcon />}
                Sign in with Google
              </Button>
              <Button variant="link" size="sm" className="text-muted-foreground mt-2">Forgot your password?</Button>
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
                  disabled={isLoading || isGoogleLoading}
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
                  disabled={isLoading || isGoogleLoading}
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
                  disabled={isLoading || isGoogleLoading}
                  minLength={6}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button className="w-full" type="submit" disabled={isLoading || isGoogleLoading}>
                {isLoading && !isGoogleLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Account
              </Button>
               <div className="relative w-full">
                <div aria-hidden="true" className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                    Or continue with
                    </span>
                </div>
              </div>
               <Button variant="outline" type="button" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading || isGoogleLoading}>
                 {isGoogleLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                 {!isGoogleLoading && <GoogleIcon />}
                Sign up with Google
              </Button>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

    