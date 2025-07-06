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
import { Flame } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function AuthForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [signInEmail, setSignInEmail] = useState("")
  const [signInPassword, setSignInPassword] = useState("")

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    if (signInEmail === "georgebowman1972@gmail.com" && signInPassword === "Fransiscoedibles") {
      toast({
        title: "Login Successful",
        description: "Welcome back, Admin!",
      })
      router.push("/admin")
    } else {
      toast({
        variant: "destructive",
        title: "Invalid Credentials",
        description: "Please check your email and password and try again.",
      })
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
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full">Sign In</Button>
              <Button variant="link" size="sm" className="text-muted-foreground">Forgot your password?</Button>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>
      <TabsContent value="sign-up">
        <Card>
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>
              Create an account to start ordering your favorite meals.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name-signup">Full Name</Label>
              <Input id="name-signup" placeholder="John Doe" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-signup">Email</Label>
              <Input id="email-signup" type="email" placeholder="m@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password-signup">Password</Label>
              <Input id="password-signup" type="password" required />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Create Account</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
