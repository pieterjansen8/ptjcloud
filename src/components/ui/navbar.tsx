'use client';

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MenuIcon, MountainIcon, LogOut, Github } from 'lucide-react';
import { signOut } from '@/api/singout'; // Assuming you have a signOut function in your auth file
import {useRouter} from 'next/navigation';
import { useEffect } from 'react';
interface NavbarProps {
  userEmail?: string;
}

export function Navbar({ userEmail }: NavbarProps) {
  const router = useRouter()
  async function handleLogout() {
    try {
      const req_out = await signOut(); 
      localStorage.clear();
      router.push('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  return (
    <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6 bg-slate-800 text-slate-100 rounded-b-lg">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden">
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="bg-slate-800 text-slate-100">
          <Link href="#" className="mr-6 flex items-center" prefetch={false}>
            <MountainIcon className="h-6 w-6" />
            <span className="ml-2 text-lg font-semibold">Ptj Inc</span>
          </Link>
          <nav className="grid gap-2 py-6">
            <Button
              className="flex items-center justify-start py-2 text-lg font-semibold"
              variant="ghost"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </Button>
            <Button
              className="flex items-center justify-start py-2 text-lg font-semibold"
              variant="ghost"
              asChild
            >
              <Link href="https://github.com/yourusername/yourrepo" target="_blank" rel="noopener noreferrer">
                <Github className="h-5 w-5 mr-2" />
                GitHub
              </Link>
            </Button>
          </nav>
        </SheetContent>
      </Sheet>
      <Link href="#" className="mr-6 hidden lg:flex items-center" prefetch={false}>
        <MountainIcon className="h-6 w-6" />
        <span className="ml-2 text-lg font-semibold">Ptj Inc</span>
      </Link>
      <nav className="ml-auto hidden lg:flex items-center gap-6">
        <Button
          className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-slate-700 px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-600 hover:text-slate-100 focus:bg-slate-600 focus:text-slate-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-slate-600/50 data-[state=open]:bg-slate-600/50"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-2" />
          Logout
        </Button>
        <Button
          className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-slate-700 px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-600 hover:text-slate-100 focus:bg-slate-600 focus:text-slate-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-slate-600/50 data-[state=open]:bg-slate-600/50"
          asChild
        >
          <Link href="https://github.com/yourusername/yourrepo" target="_blank" rel="noopener noreferrer">
            <Github className="h-5 w-5 mr-2" />
            GitHub
          </Link>
        </Button>
      </nav>
      {userEmail && (
        <div className="ml-4 text-sm text-slate-300 hidden lg:block">
          Logged in as: {userEmail}
        </div>
      )}
    </header>
  );
}

