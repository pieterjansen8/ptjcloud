'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {login} from "@/api/sing-in"
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

   useEffect( () => { 
    const setup = async () => { 
      if(localStorage.getItem("refresh_token")!=undefined){
        const val = await validate_refresh_key(localStorage.getItem("refresh_token")!)
        if(val==true){
          router.push("/dash")
          return
        }
        else{
          return
        }
      }
    }
    setup()
   })
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')
    const [login_request, session_data] = await login(password, email, register)
    if(login_request=="200"){
      router.push("/dash?token="+session_data)
      setMessage("successfully logged in!")
    }
    else if(login_request=="200-register"){
       setMessage("successfully created a account!")
    }
    else{ 
      setMessage(login_request!.toString())
    }
    setIsLoading(false)
  }
  //enable all functions 


  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 bg-gradient-to-br from-slate-900 to-slate-800">
      <Card className="w-[350px] bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-100">Cloud App Auth</CardTitle>
          <CardDescription className="text-slate-400">
            Enter your credentials to access your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-200">Email</Label>
              <Input 
                id="email" 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-700 border-slate-600 text-slate-100 focus:ring-slate-400"
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-200">Password</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-700 border-slate-600 text-slate-100 focus:ring-slate-400"
                placeholder="••••••••"
              />
            </div>
            <div className='flex items-center space-x-2'>
               <Switch id="register"  onCheckedChange={() => {setRegister(!register)}}   className='data-[state=checked]:bg-slate-600 data-[state=unchecked]:bg-slate-700'/>
               <Label htmlFor="register"  className='text-white font-medium'>Register</Label>
           </div>
            <Button type="submit" className="w-full bg-slate-600 hover:bg-slate-500" disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          {message && (
            <p className={`text-sm ${message.includes('successfully') ? 'text-green-400' : 'text-red-400'}`} role="status">
              {message}
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

