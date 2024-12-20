'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast"
import { Navbar } from '@/components/ui/navbar';
import { Download, Link, Trash, FileIcon, MoreVertical, Search, Upload } from 'lucide-react';
import { getdata } from '@/api/get_session';
import { upload_file } from "@/api/upload_file";
import { get_files } from "@/api/get_all_files";
import { download, remove, copy_link } from "@/api/download"
import { Progress } from '@/components/ui/progress';
interface Session {
  user?: {
    email?: string;
  };
}

interface FileData {
  id: string;
  name: string;
  size: string;
  lastModified: string;
  metadata: {
    size: string;
    lastModified: string;
  }
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const refresh_token = searchParams.get("token");
  const router = useRouter();
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('');
  const [session, setSession] = useState<Session>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<FileData[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    async function fetchData() {
      if (!refresh_token && !localStorage.getItem("refresh_token")) {
        router.push("/");
        return;
      }

      const token = refresh_token || localStorage.getItem("refresh_token")!;
      if (refresh_token) localStorage.setItem("refresh_token", refresh_token);

      const [error, sessionData] = await getdata(token);
      if (error) {
        if (error.toString() === "Error: Invalid Refresh Token: Already Used") {
          localStorage.removeItem("refresh_token");
        }
        toast({
          title: "Error",
          description: error.toString(),
          variant: "destructive"
        });
        router.push("/");
        return;
      }
      if (sessionData && 'user' in sessionData) {
        setSession({
          user: sessionData.user ? { email: sessionData.user.email } : undefined
        });
      } else {
        setSession({ user: { email: "IMPOSTER" } });
      }
      const fileData = await get_files((sessionData as Session)?.user?.email!);
      const mappedFiles = fileData!.map((file: any) => ({
        id: file.id,
        name: file.name,
        size: file.metadata.size,
        lastModified: file.metadata.lastModified,
        metadata: {
          size: file.metadata.size,
          lastModified: file.metadata.lastModified,
        }
      }));
      setFiles(mappedFiles || []);
    }

    fetchData();

    window.history.replaceState(null, '', "/dash");
  }, [refresh_token, router, toast]);

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const btn = document.getElementById('upload_btn');
    btn!.style.cursor = 'not-allowed';
    const FILE = event.target.files?.[0];
    if (!FILE || !session?.user?.email) return;

    setUploadProgress(10)

    const [upload, mess] = await upload_file(FILE, session.user.email);
    setUploadProgress(100)
    if (upload == true) {
      toast({
        title: "Success!",
        description: "The file is uploaded to the cloud."
      });
      const fileData = await get_files(session.user?.email ?? '');
      const mappedFiles = fileData!.map((file: any) => ({
        id: file.id,
        name: file.name,
        size: file.metadata.size,
        lastModified: file.metadata.lastModified,
        metadata: {
          size: file.metadata.size,
          lastModified: file.metadata.lastModified,
        }
      }));
      setFiles(mappedFiles || []);
    } else if (upload == false) {
      toast({
        title: "Error",
        description: mess.toString(),
        variant: "destructive"
      });
    }
    btn!.style.cursor = 'pointer';
    setUploadProgress(0);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const downloadHandler = async (filename: string, email: string) => { 
    const [download_request, mess] = await download(filename, email);
    if (download_request === false) {
      toast({
        title: "Error",
        description: mess.toString(),
        variant: "destructive"
      });
      return;
    } else {
      if (mess instanceof Blob) {
        const url = URL.createObjectURL(mess);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        link.click(); 
        link.remove();
      } else {
        toast({
          title: "Error",
          description: "Failed to download the file.",
          variant: "destructive"
        });
      }
    }
  } 

  const removeHandler = async (filename: string, email: string) => { 
    const [remove_request, mess] = await remove(filename, email);
    if (remove_request === false) {
      toast({
        title: "Error",
        description: mess.toString(),
        variant: "destructive"
      });
      return;
    } else {
      const fileData = await get_files(session.user?.email ?? '');
      const mappedFiles = fileData!.map((file: any) => ({
        id: file.id,
        name: file.name,
        size: file.metadata.size,
        lastModified: file.metadata.lastModified,
        metadata: {
          size: file.metadata.size,
          lastModified: file.metadata.lastModified,
        }
      }));
      setFiles(mappedFiles || []);
      toast({
        title: "Success!",
        description: "The file is removed from the cloud.",
      });
    }
  }

  const copyHandler = async (filename: string, email: string) => { 
    if (navigator.clipboard && navigator.clipboard.writeText) {
        const [copyRequest, mess] = await copy_link(filename, email);
    if (copyRequest === false) {
      toast({
        title: "Error",
        description: mess.toString(),
        variant: "destructive"
      });
      return;
    } else {
      if (typeof mess === 'string') {
        navigator.permissions.query({ name: "clipboard-write" as PermissionName }).then( async (result) => {
          if (result.state === "granted" || result.state === "prompt") {
            navigator.clipboard.writeText(mess);
            const last_writed = await navigator.clipboard.readText();
            console.log(last_writed)
            if(last_writed === mess){
              toast({
                title: "Success!",
                description: "The URL is copied to the clipboard. (The link stays valid for 24 hours)"
              });
            }
            else{
              toast({
                title: "Error",
                description: "Failed to copy the link to the clipboard.",
                variant: "destructive"
              });
            }
          }
          
          else{
            toast({
              title: "Error",
              description: "Failed to copy the link to the clipboard. (Permission to clipboard denied.)",
              variant: "destructive"
            });
          }
        });
        
      }
    }

   }
   else{
    toast({
      title: "Error",
      description: "Failed to copy the link to the clipboard. (Clipboard API not supported on this browser, consider using chrome.)",
      variant: "destructive"
    });
   }
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Navbar userEmail={session?.user?.email} />
      <Card className="mt-5 bg-white border-gray-200 shadow-md">
        <CardHeader>
          <CardTitle className="text-gray-800">
            {session?.user?.email ?? 'Loading page...'} Files
          </CardTitle>
          <CardDescription className="text-gray-600">
            Manage and view your cloud files
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
            <div className="relative w-full sm:w-64">
              <Input
                type="text"
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button id='upload_btn'
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={triggerFileInput}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload File
              </Button>
            </div>
          </div>
          {uploadProgress > 0 && (
            <Progress value={uploadProgress} className="mb-4" />
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-700">Name</TableHead>
                <TableHead className="hidden sm:table-cell text-gray-700">Size (in bytes)</TableHead>
                <TableHead className="hidden sm:table-cell text-gray-700">Last Modified</TableHead>
                <TableHead className="text-gray-700 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFiles.map((file) => (
                <TableRow key={file.id}>
                  <TableCell className="font-medium text-gray-900">
                    <div className="flex items-center">
                      <FileIcon className="h-5 w-5 text-gray-400 mr-2" />
                      {file.name}
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-gray-700">{file.metadata.size}</TableCell>
                  <TableCell className="hidden sm:table-cell text-gray-700">{file.metadata.lastModified}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4 text-gray-600" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white text-gray-900 border-gray-200">
                        <DropdownMenuItem onClick={() => downloadHandler(file.name, session?.user?.email!)} className="hover:bg-gray-100 focus:bg-gray-100 cursor-pointer">
                          <Download className="mr-2 h-4 w-4" />
                          <span>Download</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => removeHandler(file.name, session?.user?.email!)} className="hover:bg-gray-100 focus:bg-gray-100 cursor-pointer">
                          <Trash className="mr-2 h-4 w-4" />
                          <span>Remove</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => copyHandler(file.name, session?.user?.email!)} className="hover:bg-gray-100 focus:bg-gray-100 cursor-pointer">
                          <Link className="mr-2 h-4 w-4" />
                          <span>Copy link</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}