"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import LoadingBar from "react-top-loading-bar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ModeToggle } from "@/components/theme/theme-btn";


// Replace with your logo
import Logo from "@/assets/images/icon.png";
import UserProfileDropdown from "../Auth/UserProfileDropdown";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/destinations", label: "Destinations" },
    { href: "/tours", label: "Tour Packages" },
    { href: "/contact", label: "Contct Us" },
    { href: "/about", label: "About" },
  ];

  const isActive = (path: string) => pathname === path;

  // Page loading animation
  useEffect(() => {
    setProgress(20);
    setTimeout(() => setProgress(40), 100);
    setTimeout(() => setProgress(100), 400);
  }, [pathname]);

  return (
    <nav className="bg-background/50 sticky top-0 backdrop-blur border-b z-10 sm:px-4 mx-auto">
      <LoadingBar color="#933ce6" progress={progress} onLoaderFinished={() => setProgress(0)} />

      <div className="container mx-auto flex justify-between items-center py-2">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer hover:bg-accent/20 p-2 rounded-full transition">
            <Image src={Logo} alt="Logo" width={40} height={40} className="rounded-full" />
            <span className="text-lg font-bold">Tour Management</span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-transform duration-200 ${
                isActive(link.href)
                  ? "font-semibold text-primary border-b-2 border-primary pb-1 scale-105"
                  : "hover:scale-105 hover:font-semibold text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {session?.user ? (
            <UserProfileDropdown session={session} />
          ) : (
            <div className="flex gap-2">
              <Button variant="outline">
                <Link href="/login">Login</Link>
              </Button>
              <Button variant="outline">
                <Link href="/register">Sign In</Link>
              </Button>
            </div>
          )}

          <ModeToggle />
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center gap-2">
          <ModeToggle />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger>
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </SheetTrigger>

            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle className="font-bold my-2">Tour Management</SheetTitle>
                <div className="flex flex-col gap-4 mt-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`${
                        isActive(link.href)
                          ? "text-primary font-semibold"
                          : "text-foreground hover:text-primary"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}

                  {session?.user ? (
                    <UserProfileDropdown session={session} />
                  ) : (
                    <div className="flex flex-col gap-2 mt-4">
                      <Button variant="outline" onClick={() => setIsOpen(false)}>
                        <Link href="/login">Login</Link>
                      </Button>
                      <Button variant="outline" onClick={() => setIsOpen(false)}>
                        <Link href="/register">Sign Up</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
