import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, Chrome, Mail, Home } from 'lucide-react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

const Login = () => {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, loading } = useAuth()
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [isSigningUp, setIsSigningUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true)
    try {
      const { error } = await signInWithGoogle()
      if (error) {
        toast.error('Failed to sign in with Google: ' + error.message)
      }
    } catch (error) {
      toast.error('An unexpected error occurred during sign in')
    } finally {
      setIsSigningIn(false)
    }
  }

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Please fill in all fields')
      return
    }

    setIsSigningIn(true)
    try {
      const { error } = await signInWithEmail(email, password)
      if (error) {
        toast.error('Failed to sign in: ' + error.message)
      }
    } catch (error) {
      toast.error('An unexpected error occurred during sign in')
    } finally {
      setIsSigningIn(false)
    }
  }

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password || !confirmPassword) {
      toast.error('Please fill in all fields')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long')
      return
    }

    setIsSigningUp(true)
    try {
      const { error } = await signUpWithEmail(email, password)
      if (error) {
        toast.error('Failed to sign up: ' + error.message)
      } else {
        toast.success('Account created! Please check your email to verify your account.')
      }
    } catch (error) {
      toast.error('An unexpected error occurred during sign up')
    } finally {
      setIsSigningUp(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Home Button */}
      <div className="p-4">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/" className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </Button>
      </div>

      {/* Login Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Welcome to VoiceAI</CardTitle>
            <CardDescription>
              Sign in to access your dashboard and manage your voice AI assistant
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="email" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </TabsTrigger>
                <TabsTrigger value="google" className="flex items-center gap-2">
                  <Chrome className="h-4 w-4" />
                  Google
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="email" className="space-y-4">
                <Tabs defaultValue="signin" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="signin">Sign In</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="signin">
                    <form onSubmit={handleEmailSignIn} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={isSigningIn}
                        className="w-full"
                      >
                        {isSigningIn ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Signing in...
                          </>
                        ) : (
                          'Sign In'
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="signup">
                    <form onSubmit={handleEmailSignUp} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-email">Email</Label>
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Password</Label>
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="Create a password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm Password</Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          placeholder="Confirm your password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={isSigningUp}
                        className="w-full"
                      >
                        {isSigningUp ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating account...
                          </>
                        ) : (
                          'Sign Up'
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </TabsContent>
              
              <TabsContent value="google" className="space-y-4">
                <Button
                  onClick={handleGoogleSignIn}
                  disabled={isSigningIn}
                  className="w-full"
                  variant="outline"
                >
                  {isSigningIn ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <Chrome className="mr-2 h-4 w-4" />
                      Continue with Google
                    </>
                  )}
                </Button>
              </TabsContent>
            </Tabs>
            
            <div className="text-center text-sm text-muted-foreground mt-6">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Login
