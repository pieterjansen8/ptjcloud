"use client"
import { UploadButton } from "@/utils/uploadthing"
import { useState } from "react"
import { Cloud, Loader2 } from "lucide-react"
import { toast } from "sonner"
export default function UploadBtn() {
    const [isUploading, setIsUploading] = useState(false)
    return (
        <div className="flex flex-col items-center justify-center space-y-6">
        <div className="flex h-[160px] w-full items-center justify-center rounded-lg border border-dashed border-primary/20">
          {isUploading ? (
            <div className="flex flex-col items-center justify-center space-y-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">Uploading...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2">
              <Cloud className="h-12 w-12 text-primary/80" />
              <span className="text-sm text-muted-foreground">Drag & drop or click to upload</span>
            </div>
          )}
        </div>

        <UploadButton 
          
          endpoint="imageUploader"
          onUploadBegin={() => {
            setIsUploading(true)
          }}
          onClientUploadComplete={() => {
            setIsUploading(false)
            toast.success("Upload Completed", {richColors:true})
          }}
          onUploadError={(error: Error) => {
            setIsUploading(false)
            toast.error("Upload Failed", {description: error.message, richColors:true})
          }}
        />
      </div>
    )
}