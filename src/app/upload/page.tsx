"use client"
import { useUser } from "@stackframe/stack"
import { UploadButton } from "@/utils/uploadthing"
import { Cloud, Loader2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
export default function Home() {
  const [isUploading, setIsUploading] = useState(false)
  useUser({ or: 'redirect' });
  return (
    <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Upload Files</CardTitle>
          <CardDescription>Upload your files using the button below or drag and drop them here</CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </main>
  )
}

