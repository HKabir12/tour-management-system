"use client";

import React from "react";
import { Rocket, Globe, Users, Mail, UserPlus } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import Image from "next/image";

const teamMembers = [
  {
    id: 1,
    name: "Rafiul Aktar",
    role: "Lead Tour Planner",
    image: "https://placehold.co/150x150/06B6D4/ffffff?text=RA",
  },
  {
    id: 2,
    name: "Abul Kalam",
    role: "Head of Operations",
    image: "https://placehold.co/150x150/F59E0B/ffffff?text=AK",
  },
  {
    id: 3,
    name: "Humaon Kabir",
    role: "Customer Relations Manager",
    image: "https://placehold.co/150x150/8B5CF6/ffffff?text=HK",
  },
  {
    id: 4,
    name: "Khairul Islam",
    role: "Customer Manager",
    image: "https://placehold.co/150x150/10B981/ffffff?text=KI",
  },
  {
    id: 5,
    name: "Habib Khan",
    role: "Customer Relations Manager",
    image: "https://placehold.co/150x150/F97316/ffffff?text=HK",
  },
  {
    id: 6,
    name: "Abul Galib",
    role: "Customer Manager",
    image: "https://placehold.co/150x150/EF4444/ffffff?text=AG",
  },
];

const fadeIn = (delay: number = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay },
});

export default function About() {
  return (
    <div className="min-h-screen bg-background text-foreground px-6 md:px-12 py-16 font-sans">
      {/* Hero Section */}
      <motion.div
        {...fadeIn(0.1)}
        className="text-center space-y-6 max-w-3xl mx-auto"
      >
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          About <span className="text-primary">Tour Management System</span>
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
          We’re a passionate team of travelers, planners, and innovators — on a
          mission to make your journey seamless, safe, and unforgettable.
        </p>
      </motion.div>

      <Separator className="my-12 max-w-4xl mx-auto" />

      {/* Mission / Vision / Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <motion.div {...fadeIn(0.2)}>
          <Card className="border border-muted-foreground/20 shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <Rocket className="text-primary w-10 h-10 mb-2" />
              <CardTitle>Our Mission</CardTitle>
              <CardDescription>
                To provide exceptional tour experiences that connect people to
                the world’s beauty and culture.
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>

        <motion.div {...fadeIn(0.3)}>
          <Card className="border border-muted-foreground/20 shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <Globe className="text-green-500 w-10 h-10 mb-2" />
              <CardTitle>Our Vision</CardTitle>
              <CardDescription>
                To become the most trusted and innovative travel management
                platform in the world.
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>

        <motion.div {...fadeIn(0.4)}>
          <Card className="border border-muted-foreground/20 shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <Users className="text-purple-500 w-10 h-10 mb-2" />
              <CardTitle>Our Values</CardTitle>
              <CardDescription>
                Integrity, excellence, and customer satisfaction guide everything
                we do.
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>
      </div>

      {/* Team Section */}
      <Separator className="my-16 max-w-4xl mx-auto" />

      <motion.div {...fadeIn(0.2)} className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          Meet the Team
        </h2>
        <p className="text-muted-foreground mt-3 text-lg">
          The passionate people behind your next great adventure.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {teamMembers.map((member, i) => (
          <motion.div key={member.id} {...fadeIn(0.1 * i)}>
            <Card className="text-center bg-card/80 backdrop-blur border border-muted-foreground/10 hover:scale-[1.03] transition-transform duration-300 rounded-2xl shadow-md">
              <CardContent className="pt-6 pb-8">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={24}
                  height={24}
                  className=" mx-auto rounded-full object-cover shadow-lg mb-4"
                />
                <h4 className="text-lg font-semibold">{member.name}</h4>
                <p className="text-sm text-muted-foreground font-medium">
                  {member.role}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Join Our Team Section */}
      <Separator className="my-16 max-w-4xl mx-auto" />

      <motion.div {...fadeIn(0.3)} className="text-center max-w-2xl mx-auto">
        <h3 className="text-3xl font-bold mb-4">Join Our Team</h3>
        <p className="text-muted-foreground mb-8">
          Are you passionate about travel and helping others explore the world?
          We’re always looking for talented, motivated individuals to join our
          growing family.
        </p>

        <Dialog>
          <DialogTrigger asChild>
            <Button size="lg" className="flex items-center justify-center  gap-2">
              <UserPlus className="w-5 h-5" /> Apply Now
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Join Our Team</DialogTitle>
            </DialogHeader>
            <form className="space-y-4 mt-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Enter your name" />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="your@email.com" />
              </div>
              <div>
                <Label htmlFor="position">Preferred Role</Label>
                <Input id="position" placeholder="e.g. Tour Guide, Manager" />
              </div>
              <Button type="submit" className="w-full">
                <Mail className="w-4 h-4 mr-2" /> Submit Application
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
}
