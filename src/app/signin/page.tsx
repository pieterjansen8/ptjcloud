'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { login } from "@/api/sing-in"
import { Switch } from '@/components/ui/switch'
import { useRouter } from 'next/navigation'
import { validate_refresh_key } from '@/api/refresh_key_validator'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [register, setRegister] = useState(false)
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  useEffect(() => { 
    const setup = async () => { 
      if(localStorage.getItem("refresh_token") !== undefined){
        const val = await validate_refresh_key(localStorage.getItem("refresh_token")!)
        if(val == true){
          router.push("../dash")
          return
        }
        else{
          return
        }
      }
    }
    setup()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')
    const [login_request, session_data] = await login(password, email, register)
    if(login_request == "200"){
      router.push("../dash?token=" + session_data)
      setMessage("Successfully logged in!")
    }
    else if(login_request == "200-register"){
      setMessage("Successfully created an account!")
    }
    else{ 
      setMessage(login_request!.toString())
    }
    setIsLoading(false)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[350px] bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-800">Cloud App Auth</CardTitle>
          <CardDescription className="text-gray-600">
            Enter your credentials to access your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">Email</Label>
              <Input 
                id="email" 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500"
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">Password</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
              />
            </div>
            <div className='flex items-center space-x-2'>
              <Switch 
                id="register"  
                onCheckedChange={() => setRegister(!register)}   
                className='data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-200'
              />
              <Label htmlFor="register" className='text-gray-700 font-medium'>Register</Label>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          {message && (
            <p 
              className={`text-sm ${message.includes('Successfully') ? 'text-green-600' : 'text-red-600'}`} 
              role="status"
            >
              {message}
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

