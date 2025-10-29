"use client";

import React, { useEffect, useState } from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,

  Bus,
  CreditCard,
  Globe,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import BackToTopButton from "../utilities/BackToTopButton";
import Icon from "@/assets/images/icon.png"
const Footer = () => {
  const [year, setYear] = useState<number | null>(null);

  // ✅ Fix hydration mismatch by setting year client-side
  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Destinations", path: "/destinations" },
    { name: "Packages", path: "/packages" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const socialLinks = [
    { name: "Facebook", icon: <Facebook size={20} /> },
    { name: "Twitter", icon: <Twitter size={20} /> },
    { name: "Instagram", icon: <Instagram size={20} /> },
    { name: "LinkedIn", icon: <Linkedin size={20} /> },
  ];

  const benefits = [
    { icon: <Bus size={32} />, text: "Comfortable Travel" },
    { icon: <CreditCard size={32} />, text: "Secure Payments" },
    { icon: <Globe size={32} />, text: "Global Network" },
    { icon: <Star size={32} />, text: "5-Star Reviews" },
  ];

  return (
    <>
    <footer className="bg-gray-900 text-gray-300 py-12 font-sans">
      <div className="container mx-auto px-4">
        {/* Logo Section */}
        <Link
          href="/"
          className="flex flex-col sm:flex-row items-center justify-center sm:justify-start space-x-0 sm:space-x-2 mb-8 text-center"
        >
          <Image
            src={Icon}
            alt="SixTour Logo"
            width={40}
            height={40}
            className="rounded-full mb-2 sm:mb-0"
          />
          <span className="text-lg font-bold text-white">SixTour</span>
        </Link>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-center md:text-left">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">About Us</h3>
            <p className="text-sm leading-relaxed">
              Tour Management System is your premier partner in exploring the
              world. We offer personalized travel solutions, thrilling
              adventures, and seamless experiences to create memories that last
              a lifetime.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.path}
                    className="text-sm hover:text-blue-500 transition-colors duration-300"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Follow Us</h3>
            <div className="flex justify-center md:justify-start space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href="#"
                  aria-label={`Visit our ${social.name} page`}
                  className="text-gray-400 hover:text-blue-500 transition-colors duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>

            <div className="mt-6">
              <h3 className="text-xl font-bold text-white mb-2">Contact</h3>
              <p className="text-sm">Email: contact@tourmate.com</p>
              <p className="text-sm">Phone: +8801743637814</p>
            </div>
          </div>

          {/* Benefits */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Why Choose Us</h3>
            <ul className="space-y-3">
              {benefits.map((b, idx) => (
                <li
                  key={idx}
                  className="flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-start space-x-0 sm:space-x-3"
                >
                  <span className="text-blue-400">{b.icon}</span>
                  <span className="text-sm">{b.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-sm text-gray-500">
          <p>
            &copy; {year ? year : "Loading..."} Tour Management System. All
            Rights Reserved.
          </p>
        </div>
      </div>
    </footer>

    <BackToTopButton />
    </>
  );  
};

export default Footer;
