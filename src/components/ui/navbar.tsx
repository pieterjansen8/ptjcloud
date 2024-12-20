'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MenuIcon,  LogOut, Github } from 'lucide-react';
import { signOut } from '@/api/singout'; // Assuming you have a signOut function in your auth file

interface NavbarProps {
  userEmail?: string;
}

export function Navbar({ userEmail }: NavbarProps) {
  const router = useRouter()

  async function handleLogout() {
    try {
      await signOut(); 
      localStorage.clear();
      router.push('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  return (
    <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6 bg-white text-gray-800 shadow-md">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden">
            <MenuIcon className="h-6 w-6 text-gray-800" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="bg-white text-gray-800">
          <Link href="#" className="mr-6 flex items-center" prefetch={false}>
            <CloudIcon className="h-6 w-6 text-blue-600" />
            <span className="ml-2 text-lg font-semibold">Ptj Inc</span>
          </Link>
          <nav className="grid gap-2 py-6">
            <Button
              className="flex items-center justify-start py-2 text-lg font-semibold text-gray-800 hover:bg-gray-100"
              variant="ghost"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </Button>
            <Button
              className="flex items-center justify-start py-2 text-lg font-semibold text-gray-800 hover:bg-gray-100"
              variant="ghost"
              asChild
            >
              <Link href="https://github.com/pieterjansen8/ptjcloud" target="_blank" rel="noopener noreferrer">
                <Github className="h-5 w-5 mr-2" />
                GitHub
              </Link>
            </Button>
          </nav>
        </SheetContent>
      </Sheet>
      <Link href="#" className="mr-6 hidden lg:flex items-center" prefetch={false}>
        <CloudIcon className="h-6 w-6 text-blue-600" />
        <span className="ml-2 text-lg font-semibold text-gray-800">Ptj Inc</span>
      </Link>
      <nav className="ml-auto hidden lg:flex items-center gap-6">
        <Button
          className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:bg-blue-700 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-2" />
          Logout
        </Button>
        <Button
          className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:bg-blue-700 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
          asChild
        >
          <Link href="https://github.com/pieterjansen8/ptjcloud" target="_blank" rel="noopener noreferrer">
            <Github className="h-5 w-5 mr-2" />
            GitHub
          </Link>
        </Button>
      </nav>
      {userEmail && (
        <div className="ml-4 text-sm text-gray-600 hidden lg:block">
          Logged in as: {userEmail}
        </div>
      )}
    </header>
  );
}

function CloudIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
    </svg>
  )
}
