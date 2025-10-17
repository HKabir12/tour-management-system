"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Send, User, Mail, MapPin, Calendar } from "lucide-react";

export default function TravellerForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    destination: "",
    date: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Traveller Info:", formData);
    // API call or form submission logic goes here
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-950 py-20 px-6 sm:px-10 lg:px-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100">
          Traveller Information
        </h2>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Fill out the form below to let us know about your travel plan.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <Card className="shadow-xl rounded-3xl dark:bg-gray-800">
          <CardHeader className="text-center p-6 sm:p-8">
            <h3 className="text-2xl font-semibold dark:text-gray-100">
              Book Your Tour
            </h3>
            <p className="mt-2 text-gray-500 dark:text-gray-300">
              Share your travel details and we will make your journey memorable.
            </p>
          </CardHeader>

          <CardContent className="p-6 sm:p-8">
            <form className="grid gap-6" onSubmit={handleSubmit}>
              {/* Name */}
              <div className="flex flex-col">
                <Label htmlFor="name">Full Name</Label>
                <div className="flex items-center gap-3">
                  <User className="text-gray-400 dark:text-gray-300" />
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col">
                <Label htmlFor="email">Email Address</Label>
                <div className="flex items-center gap-3">
                  <Mail className="text-gray-400 dark:text-gray-300" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Destination */}
              <div className="flex flex-col">
                <Label htmlFor="destination">Destination</Label>
                <div className="flex items-center gap-3">
                  <MapPin className="text-gray-400 dark:text-gray-300" />
                  <Input
                    id="destination"
                    name="destination"
                    placeholder="Where do you want to go?"
                    value={formData.destination}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Date */}
              <div className="flex flex-col">
                <Label htmlFor="date">Travel Date</Label>
                <div className="flex items-center gap-3">
                  <Calendar className="text-gray-400 dark:text-gray-300" />
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 transition"
              >
                <Send size={20} /> Submit
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    
    </section>
  );
}
