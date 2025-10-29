"use client";


import { motion } from "framer-motion";
import { MapPin, Mail, Phone } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";
import ContactForm from "./components/ContactForm";

export default function Contact() {
  const fadeIn = (delay: number = 0) => ({
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay },
  });

  return (
    <div className="min-h-screen bg-background text-foreground font-sans px-6 md:px-12 py-16">
      {/* Header Section */}
      <motion.div
        {...fadeIn(0.1)}
        className="text-center max-w-3xl mx-auto mb-12"
      >
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          Contact <span className="text-primary">Us</span>
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl mt-4">
          Have questions or need help planning your next adventure? Reach out —
          we’re here to make your journey seamless.
        </p>
      </motion.div>

      <Separator className="max-w-4xl mx-auto mb-12" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
        {/* Contact Form */}
        <ContactForm></ContactForm>

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
                  123 Tour Street, Traveler’s Square, City of Adventure, 54321
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
                <p className="text-sm text-muted-foreground">
                  +1 (555) 123-4567
                </p>
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
