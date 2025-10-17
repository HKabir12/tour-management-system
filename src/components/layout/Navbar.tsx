"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ModeToggle } from "@/components/theme/theme-btn";
import LoadingBar from "react-top-loading-bar";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, X, Home, MapPin, Info, Phone, Package2Icon } from "lucide-react";
const Navbar = () => {
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    setProgress(20);
    setTimeout(() => setProgress(40), 100);
    setTimeout(() => setProgress(100), 400);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setProgress(0), 50);
  }, []);

  const navLinks = [
    { name: "Home", href: "/", icon: <Home size={18} /> },
    { name: "Destinations", href: "/destinations", icon: <MapPin size={18} /> },
    { name: "Tour Package", href: "/tours", icon: <Package2Icon size={18} /> },
    { name: "Contact", href: "/contact", icon: <Phone size={18} /> },
    { name: "About", href: "/about", icon: <Info size={18} /> },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-background/50 sticky top-0 backdrop-blur border-b z-10 sm:px-4 mx-auto">
      <LoadingBar
        color="#933ce6"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center space-x-2  p-2 hover:bg-accent/20 transition duration-200 ease-in-out cursor-pointer overflow-hidden">
            <Image
              src="https://i.ibb.co.com/TMrScv8t/Screenshot-2025-09-27-074922.png"
              alt="Logo"
              width={40}
              height={10}
              className="rounded-full"
            />
            <div className="text-lg font-bold">SixTour</div>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-4 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-transform duration-300 ${
                isActive(link.href)
                  ? "font-semibold text-primary border-b-2 border-primary pb-1 scale-105"
                  : "hover:scale-105 hover:font-semibold text-foreground"
              }`}
            >
              <div className="flex items-center gap-1 space-x-2">
                {link.icon} {link.name}
              </div>
            </Link>
          ))}

          <p className="flex items-center">
            <Button className="mx-1" variant="outline">
              <Link href="/login">Login</Link>
            </Button>
            <Button className="mx-1" variant="outline" asChild>
              <Link href="/signin">Sign Up</Link>
            </Button>
            <ModeToggle />
          </p>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden  flex items-center">
          <span className="mx-2">
            <ModeToggle />
          </span>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger>
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                ></path>
              </svg>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle className="font-bold my-4">SixTour</SheetTitle>
                <SheetDescription>
                  <div className="flex flex-col gap-6">
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
                        <div className="flex items-center">
                          {link.icon} {link.name}
                        </div>
                      </Link>
                    ))}
                    <p>
                      <Button className="mx-1 text-xs" variant="outline">
                        <Link href="/login" onClick={() => setIsOpen(false)}>
                          Login{" "}
                        </Link>
                      </Button>
                      <Button
                        className="mx-1 text-xs"
                        variant="outline"
                        asChild
                      >
                        <Link href="/signin" onClick={() => setIsOpen(false)}>
                          Sign Up
                        </Link>
                      </Button>
                    </p>
                  </div>
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
