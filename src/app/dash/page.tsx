'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileIcon, Files, MoreVertical, Search, Upload } from 'lucide-react';
import { getdata } from '@/api/get_session';
import { useSearchParams, useRouter } from 'next/navigation';
import { upload_file } from "@/api/upload_file";
import { get_files } from "@/api/get_all_files";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import { Navbar } from '@/components/ui/navbar';

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
  const searchParams = useSearchParams();
  const refresh_token = searchParams.get("token");
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [session, setSession] = useState<Session>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<FileData[]>([]);

  useEffect(() => {
    async function fetchData() {
      if (!refresh_token && !localStorage.getItem("refresh_token")) {
        router.push("/");
        return;
      }

      const token = refresh_token || localStorage.getItem("refresh_token")!;
      if (refresh_token) localStorage.setItem("refresh_token", refresh_token);

      const [error, , sessionData] = await getdata(token);
      if (error) {
        if (error.toString() === "Error: Invalid Refresh Token: Already Used") {
          localStorage.removeItem("refresh_token");
        }
        alert(error);
        router.push("/");
        return;
      }
      setSession(sessionData);
      const fileData = await get_files(sessionData?.user?.email!);
      setFiles(fileData || []);
    }

    fetchData();

    window.history.replaceState(null, '', "/dash");
  }, [refresh_token, router]);

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const FILE = event.target.files?.[0];
    if (!FILE || !session?.user?.email) return;

    try {
      await upload_file(FILE, session.user.email);

      const fileData = await get_files(session.user.email);
      setFiles(fileData || []);
    } catch (error) {
      console.error("File upload failed:", error);
      alert('Failed to upload the file.');
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <Navbar userEmail={session?.user?.email} />
      <Card className=" mt-5 bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle  className="text-white">
            {session?.user?.email ?? 'IMPOSTER'} Files
          </CardTitle>
          <CardDescription className="text-slate-400">
            Manage and view your cloud files
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-64">
              <Input
                type="text"
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-slate-100 focus:ring-slate-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            </div>
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                className="bg-slate-700 hover:bg-slate-600 text-slate-100"
                onClick={triggerFileInput}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload File
              </Button>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-slate-300">Name</TableHead>
                <TableHead className="text-slate-300">Size (in bytes)</TableHead>
                <TableHead className="text-slate-300">Last Modified</TableHead>
                <TableHead className="text-slate-300 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFiles.map((file) => (
                <TableRow key={file.id}>
                  <TableCell className="font-medium text-slate-200">
                    <div className="flex items-center">
                      <FileIcon className="h-5 w-5 text-slate-400 mr-2" />
                      {file.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-300" onClick={() => {console.log(file)}}>{file.metadata.size}</TableCell>
                  <TableCell className="text-slate-300">{file.metadata.lastModified}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4 text-slate-400" />
                    </Button>
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

