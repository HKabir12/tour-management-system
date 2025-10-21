"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Mail, Phone, Send } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("✅ Thank you for reaching out! We’ll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const fadeIn = (delay: number = 0) => ({
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay },
  });

  return (
    <div className="min-h-screen bg-background text-foreground font-sans px-6 md:px-12 py-16">
      {/* Header Section */}
      <motion.div {...fadeIn(0.1)} className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          Contact <span className="text-primary">Us</span>
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl mt-4">
          Have questions or need help planning your next adventure?  
          Reach out — we’re here to make your journey seamless.
        </p>
      </motion.div>

      <Separator className="max-w-4xl mx-auto mb-12" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
        {/* Contact Form */}
        <motion.div {...fadeIn(0.2)}>
          <Card className="border border-muted-foreground/20 bg-card/80 backdrop-blur shadow-md hover:shadow-lg transition-shadow duration-300 rounded-3xl">
            <CardHeader>
              <CardTitle className="text-2xl">Send Us a Message</CardTitle>
              <CardDescription>
                We’d love to hear from you! Fill out the form below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="Enter a subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Write your message..."
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Info & Map */}
        <motion.div {...fadeIn(0.4)} className="space-y-8">
          <Card className="border border-muted-foreground/20 bg-card/80 backdrop-blur shadow-md rounded-3xl">
            <CardHeader>
              <CardTitle>Our Office</CardTitle>
              <CardDescription>
                Visit or reach us anytime — we’d love to meet you!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="text-primary w-5 h-5 mt-1 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  123 Tour Street, Traveler’s Square,  
                  City of Adventure, 54321
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="text-primary w-5 h-5 flex-shrink-0" />
                <a
                  href="mailto:info@tour-ms.com"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  info@tour-ms.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="text-primary w-5 h-5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
              </div>
            </CardContent>
          </Card>

          {/* Map Card */}
          <Card className="overflow-hidden border border-muted-foreground/20 rounded-3xl shadow-md">
            <div className="h-64 w-full">
              <iframe
                title="Cox's Bazar Sea Beach"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14613.12540706612!2d91.9742558!3d21.4272296!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30adc9df6b6e2d19%3A0x47e7c6a72ccb316!2sCox's%20Bazar%20Sea%20Beach!5e0!3m2!1sen!2sbd!4v1695654444444"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
