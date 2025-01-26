"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { login, LoginWithOauth } from "@/api/sing-in"
import { Switch } from "@/components/ui/switch"
import { useRouter } from "next/navigation"
import { validate_refresh_key } from "@/api/refresh_key_validator"
import { ChromeIcon as Google } from "lucide-react"
import { AuroraBackground } from "@/components/ui/aurora-background"
import { motion} from "motion/react"
export default function AuthPage() {
  const [email, setEmail] = useState("")
  const [register, setRegister] = useState(false)
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  useEffect(() => {
    const setup = async () => {
      if (localStorage.getItem("refresh_token") !== undefined) {
        const val = await validate_refresh_key(localStorage.getItem("refresh_token")!)
        if (val == true) {
          router.push("../dash")
          return
        } else {
          return
        }
      }
    }
    setup()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")
    const [login_request, session_data] = await login(password, email, register)
    if (login_request == "200") {
      router.push("../dash?token=" + session_data)
      setMessage("Successfully logged in!")
    } else if (login_request == "200-register") {
      setMessage("Successfully created an account!")
    } else {
      setMessage(login_request!.toString())
    }
    setIsLoading(false)
  }

  const handleGoogleLogin = () => {
    LoginWithOauth()
  }

  return (
    <AuroraBackground>
      <motion.div
          initial={{ opacity: 0.0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="relative flex flex-col gap-4 items-center justify-center px-4"
      >
       <div>
       <Card className="w-[350px] shadow-lg border border-white/10 bg-transparent">
        <CardHeader>
          <CardTitle className="text-white">Cloud App Auth</CardTitle>
          <CardDescription className="text-gray-400">Enter your credentials to access your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent border-white/20 text-white focus:ring-white focus:border-white"
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent border-white/20 text-white focus:ring-white focus:border-white"
                placeholder="••••••••"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="register"
                onCheckedChange={() => setRegister(!register)}
                className="text-white data-[state=checked]:bg-white/30 data-[state=unchecked]:bg-transparent border-white/20"
              />
              <Label htmlFor="register" className="text-white font-medium ">
                Register
              </Label>
            </div>
            <Button type="submit" className="w-full bg-transparent  border border-white/20 hover:bg-white/10  text-white cursor-pointer" disabled={isLoading}>
              {isLoading ? "Processing..." : "Sign In"}
            </Button>
          </form>
          <div className="mt-4">
            <Button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full bg-transparent text-white border border-white/20 hover:bg-white/10 cursor-pointer"
            >
              <Google className="w-5 h-5 mr-2" />
              Login with Google
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          {message && (
            <p
              className={`text-sm ${message.includes("Successfully") ? "text-white/20" : "text-red-500"}`}
              role="status"
            >
              {message}
            </p>
          )}
        </CardFooter>
      </Card>
       </div>
    </motion.div>
    </AuroraBackground>
    
  )
}

