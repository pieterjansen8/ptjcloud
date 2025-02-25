import Comp from "@/components/Filest"
import { Suspense } from "react"
import { FileListSkeleton } from "@/components/FileListSkeleton"

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

