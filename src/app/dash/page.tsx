'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast"
import { Navbar } from '@/components/ui/navbar';
import { Download, Link, Trash, FileIcon, MoreVertical, Search, Upload, Share, Sun, Moon } from 'lucide-react';
import { getdata, getOauthdata } from '@/api/get_session';
import { upload_file } from "@/api/upload_file";
import { get_files } from "@/api/get_all_files";
import { download, remove, copy_link } from "@/api/download"
import { Progress } from '@/components/ui/progress';
import { share_file } from '@/api/download';
import { Spinner } from "@/components/ui/spinner"; // Import Spinner component
import { AuroraBackground } from '@/components/ui/aurora-background';
import { motion } from "motion/react"
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
  const Oauth = searchParams.get("Oauth")
  const router = useRouter();
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('');
  const [session, setSession] = useState<Session>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<FileData[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [Shareemail, setSharefileemail] = useState('');
  const [loading, setLoading] = useState(true); // Add loading state
  const [theme, setThemelocal] =  useState("")
  const setTheme = (theme:string) => {
      localStorage.setItem("theme",theme)
      setThemelocal(theme)
  }
  useEffect(() => {
    const th = localStorage.getItem("theme")
    if(th!=null){ setThemelocal(th) }
    else{setThemelocal("dark")}
    async function fetchData() {
      if (!refresh_token && !localStorage.getItem("refresh_token")) {
        const [error, sessionData] = await getOauthdata()
        
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
        if (sessionData && 'session' in sessionData && sessionData.session) {
          localStorage.setItem("refresh_token", sessionData.session.refresh_token);
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
        setLoading(false); // Set loading to false after data is fetched
        return;
      }
      const token = refresh_token || localStorage.getItem("refresh_token")!;
      if (refresh_token) localStorage.setItem("refresh_token", refresh_token);
      console.log(refresh_token)
      const [error, sessionData] = await getdata(token)
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
      setLoading(false); // Set loading to false after data is fetched
    }

    fetchData();

    var is_safari = /^(?!.*chrome).*safari/i.test(navigator.userAgent);
    if (is_safari) {
      toast({
        title: "Warning",
        description: "The application is not fully supported on Safari. Consider using Chrome or Firefox.",
        variant: "destructive"
      });
    }
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
  const handleFileShare  =  async (fileid:string) => {
    const [ok, error] = await  share_file(session?.user?.email!, fileid, Shareemail);
    if(ok==false){
      toast({
        title: "Error",
        description: error.toString(),
        variant: "destructive"
      });
    }
    else{
      toast({
        title: "Success",
        description: "File shared with " + Shareemail,
      });
    }
  }
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
          className="relative flex flex-col gap-4 w-screen items-center justify-center px-4"
      >
    <div className={`min-h-screen w-screen ${theme === 'dark' ? 'bg-transparent text-gray-100' : 'bg-transparent text-gray-900'}`}>
      <Navbar userEmail={session?.user?.email} theme={theme} />
      <div className="flex justify-end p-4">
        <Button
          variant="ghost"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>
      <Card className={`mt-5 ${theme === 'dark' ? 'bg-black/20 border-black/40' : ' bg-white/10 border-gray-200'} shadow-md`}>
        <CardHeader>
          <CardTitle className={`${theme === 'dark' ? 'text-gray-100' : 'text-gray-100'}`}>
            {session?.user?.email ?? 'Loading page...'} Files
          </CardTitle>
          <CardDescription className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`}>
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
                className={`pl-10 ${theme === 'dark' ? 'bg-black/20 border-black/30 text-gray-100' : 'bg-white/20 border-gray-300/30 text-white'} focus:ring-black/30 focus:border-black/40`}
              />
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'} h-4 w-4`} />
            </div>
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button id='upload_btn'
                className="bg-black/40 hover:bg-black/70 text-white"
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
                <TableHead className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`}>Name</TableHead>
                <TableHead className={`hidden sm:table-cell ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`}>Size (in bytes)</TableHead>
                <TableHead className={`hidden sm:table-cell ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`}>Last Modified</TableHead>
                <TableHead className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'} text-right`}>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    <Spinner /> {/* Display spinner while loading */}
                  </TableCell>
                </TableRow>
              ) : (
                filteredFiles.map((file) => (
                <TableRow key={file.id}>
                  <TableCell className={`font-medium ${theme === 'dark' ? 'text-gray-100' : 'text-gray-100'}`}>
                    <div className="flex items-center">
                      <FileIcon className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'} mr-2`} />
                      {file.name}
                    </div>
                  </TableCell>
                  <TableCell className={`hidden sm:table-cell ${theme === 'dark' ? 'text-gray-400' : 'text-gray-100'}`}>{file.metadata.size}</TableCell>
                  <TableCell className={`hidden sm:table-cell ${theme === 'dark' ? 'text-gray-400' : 'text-gray-100'}`}>{file.metadata.lastModified}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className={`h-4 w-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className={`bg-white ${theme === 'dark' ? 'bg-black/30 text-gray-100 border-black/40' : 'bg-white/30 border-gray-200/40'}`}>
                        <DropdownMenuItem onClick={() => downloadHandler(file.name, session?.user?.email!)} className="hover:black/40 focus:bg-black/40cursor-pointer">
                          <Download className="mr-2 h-4 w-4" />
                          <span>Download</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => removeHandler(file.name, session?.user?.email!)} className="hover:black/40 focus:bg-black/40 cursor-pointer">
                          <Trash className="mr-2 h-4 w-4" />
                          <span>Remove</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => copyHandler(file.name, session?.user?.email!)} className="hover:black/40 focus:bg-black/40 cursor-pointer">
                          <Link className="mr-2 h-4 w-4" />
                          <span>Copy link</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Dialog>
                            <DialogTrigger asChild>
                              <div className="hover:black/40 focus:bg-black/40 cursor-pointer flex items-center px-2 py-1">
                                <Share className="mr-2 h-4 w-4" />
                                <span className="text-sm">Share file</span>
                              </div>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Share file</DialogTitle>
                                <DialogDescription>
                                  Share the file with another user.
                                </DialogDescription>
                              </DialogHeader>
                              <div>
                                <label>Email of user:</label>
                                <Input
                                  type="text"
                                  placeholder="Email"
                                  className="w-full"
                                  onChange={(e) => { setSharefileemail(e.target.value)} }
                                />
                              </div>
                              <DialogFooter>
                              <DialogClose asChild>
                                <Button type="button" variant="secondary">
                                  Close
                                </Button>
                              </DialogClose>
                                <Button className='bg-blue-600 hover:bg-blue-700' type="submit" onClick={ () => {handleFileShare(file.name)}}>share file</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
    </motion.div>
   </AuroraBackground>
  );
}