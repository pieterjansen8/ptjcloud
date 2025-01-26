"use client"
import { Button } from "@/components/ui/button"
import { ArrowRight, Cloud, Lock, Zap } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { validate_refresh_key } from '@/api/refresh_key_validator'
import { motion } from "motion/react";
import { AuroraBackground } from "@/components/ui/aurora-background";
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
          <div className="text-3xl md:text-7xl font-bold dark:text-white text-center">
            Ptj cloud
          </div>
          <div className="font-extralight text-base md:text-4xl dark:text-neutral-200 py-4">
            A fast and secure cloud storage solution
          </div>
          <button className="bg-black dark:bg-white rounded-full w-fit text-white dark:text-black px-4 py-2" onClick={() => { router.push("/signin")}}>
            start uploading
          </button>
        </motion.div>
      </AuroraBackground>
    );
}
