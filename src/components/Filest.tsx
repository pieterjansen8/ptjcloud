import { Get_user_files } from "@/server/DbActions"
import { FileIcon } from "lucide-react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { stackServerApp } from "@/stack"


export default async function Comp() {
  const user = await stackServerApp.getUser({ or: 'redirect' });
  const all_files = await Get_user_files(user)
  if (!all_files) {
    return (
      <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Your Files</h1>
      </div>
    )
  }

  if (all_files[0] == "error") {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>There was a problem loading your files. Please try again later.</AlertDescription>
        </Alert>
      </div>
    )
  }
  if(!stackServerApp.getUser()){
    window.location.replace("/handler/signin")
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.isArray(all_files[1]) && all_files[1].map((file: { key: string | null; url: string | null; name: string | null; user_id: string | null }) => (
          file.key && file.url && file.name && file.user_id ? (
            <Card key={file.key} className="group relative overflow-hidden transition-colors hover:bg-accent">
              <Link href={file.url} className="flex items-center gap-3 p-4">
                <div className="rounded-lg bg-primary/10 p-2">
                  <FileIcon className="h-6 w-6 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium leading-6">{file.name}</p>
                  <p className="truncate text-sm text-muted-foreground">User ID: {file.user_id}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">View</span>
                </div>
              </Link>
            </Card>
          ) : null
        ))}
      </div>
      {all_files[1].length === 0 && (
        <div className="flex h-[200px] items-center justify-center rounded-lg border border-dashed">
          <p className="text-sm text-muted-foreground">No files found</p>
        </div>
      )}
    </div>
  )
}
