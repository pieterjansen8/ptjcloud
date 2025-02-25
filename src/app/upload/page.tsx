import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import UploadBtn from "@/components/uploadBtn"
import { Suspense } from "react"
import SecuryHandler from "@/components/SecurityHandler"
export default function Home() {
  return (
    <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Upload Files</CardTitle>
          <CardDescription>Upload your files using the button below or drag and drop them here</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense>
             <UploadBtn></UploadBtn>
          </Suspense>
        </CardContent>
      </Card>
      <Suspense>
        <SecuryHandler/>
      </Suspense>
    </main>
  )
}

