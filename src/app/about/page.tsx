"use client";

import React from "react";
import { Rocket, Globe, Users,  } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Loader } from "@/components/utilities/Loader";
import ApplyForm from "./components/ApplyForm";

interface TeamMember {
  _id: string;
  name: string;
  role: string;
  image: string;
}

const fadeIn = (delay: number = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay },
});

export default function About() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/teamMembers")
      .then((res) => res.json())
      .then((data) => setTeam(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader></Loader>;

  return (
    <div className=" bg-background text-foreground px-6 md:px-12 py-6 font-sans">
      {/* Hero Section */}
      <motion.div
        {...fadeIn(0.1)}
        className="text-center space-y-6 max-w-3xl mx-auto"
      >
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
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
                Integrity, excellence, and customer satisfaction guide
                everything we do.
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
        {team.map((member, i) => (
          <motion.div key={member._id} {...fadeIn(0.1 * i)}>
            <Card className="text-center bg-card/80 backdrop-blur border border-muted-foreground/10 hover:scale-[1.03] transition-transform duration-300 rounded-2xl shadow-md">
              <CardContent className="pt-6 pb-8">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={100}
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

        <ApplyForm></ApplyForm>
      </motion.div>
    </div>
  );
}
