import Link from "next/link"
import { Home, Upload } from "lucide-react"
import type React from "react" // Added import for React
import { UserButton } from "@stackframe/stack"

const BottomNavbar = () => {

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 dark:bg-black dark:border-gray-800">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex items-center justify-around h-16">
          <NavItem href="/" icon={<Home className="w-6 h-6" />} label="Home" />
          <NavItem href="/upload" icon={<Upload className="w-6 h-6" />} label="Upload" />
          <UserButton />
        </div>
      </div>
    </nav>
  )
}

const NavItem = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => {
  return (
    <Link
      href={href}
      className="flex flex-col items-center text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </Link>
  )
}

export default BottomNavbar
