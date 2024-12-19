"use client"
import { Button } from "@/components/ui/button"
import { ArrowRight, Cloud, Lock, Zap } from 'lucide-react'
import {useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { validate_refresh_key } from '@/api/refresh_key_validator'
export default function LandingPage() {
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
  return (
    <div className="flex  flex-col min-h-screen">
      <center>
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <a className="flex items-center justify-center" href="#">
          <CloudIcon className="h-6 w-6 text-blue-600" />
          <span className="sr-only">Acme Inc</span>
        </a>

      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Welcome to Your Cloud Storage Solution
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Securely store, manage, and share your files from anywhere. Fast, reliable, and built for the modern web.
                </p>
              </div>
              <div className="space-x-4">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => { router.push("/signin")} }>
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" onClick={() => {window.open("https://github.com/pieterjansen8/ptjcloud")}}>Learn More</Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className=" bg-blue-600 hover:bg-blue-700 hover:p-5 cursor-pointer transition-all duration-500 bg-primary  rounded-full p-3 ">
                  <Cloud className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-xl font-bold">Cloud Storage</h2>
                <p className="text-gray-500 dark:text-gray-400">Store your files securely in the cloud and access them from anywhere.</p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className=" bg-blue-600 hover:bg-blue-700 hover:p-5 cursor-pointer transition-all duration-500 bg-primary rounded-full p-3">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-xl font-bold">Fast Uploads</h2>
                <p className="text-gray-500 dark:text-gray-400">Experience lightning-fast file uploads with our optimized infrastructure.</p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="bg-primary  bg-blue-600 hover:bg-blue-700 cursor-pointer hover:p-5 transition-all duration-500 rounded-full p-3">
                  <Lock className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-xl font-bold">Secure Sharing</h2>
                <p className="text-gray-500 dark:text-gray-400">Share your files securely with customizable access controls.</p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Ready to get started?
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Join thousands of satisfied users and start managing your files with ease today.
                </p>
              </div>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => { router.push("/signin")} }>
                Sign Up Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 Acme Inc. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <a className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </a>
          <a className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </a>
        </nav>
      </footer>
      </center>
    </div>
  )
}

function CloudIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
    </svg>
  )
}
