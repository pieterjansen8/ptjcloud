import Comp from "@/components/Filest"
import { Suspense } from "react"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function FileListSkeleton() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <Skeleton className="h-9 w-[180px]" /> {/* Title skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-lg" /> {/* File icon skeleton */}
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" /> {/* Filename skeleton */}
                <Skeleton className="h-3 w-1/2" /> {/* User ID skeleton */}
              </div>
              <Skeleton className="h-4 w-12" /> {/* "View" text skeleton */}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}


export default async function Page() {
  return (
    <div className="container mx-auto p-4 space-y-6">
       <h1 className="text-3xl font-bold tracking-tight">Your Files</h1>
       <Suspense fallback={<FileListSkeleton/>}>
         <Comp></Comp>
       </Suspense>
    </div>
  )
}

