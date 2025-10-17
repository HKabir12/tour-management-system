"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ChevronDown,
  ChevronUp,
  HelpCircle,
  MessageSquare,
} from "lucide-react";

const faqData = [
  {
    question: "How do I book a tour on your website?",
    answer:
      "Booking a tour is easy! Simply navigate to the 'Tours' section, select your desired tour, choose your dates and number of people, and proceed to checkout. You will receive a confirmation email once your booking is complete.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept a wide range of payment methods, including credit cards (Visa, Mastercard, Amex), debit cards, and popular mobile payment options. All transactions are securely processed.",
  },
  {
    question: "Can I cancel or change my booking?",
    answer:
      "Yes, you can. Cancellation and modification policies vary by tour. Please check the specific tour's details for more information. For changes, you can contact our customer support team for assistance.",
  },
  {
    question: "Are there any discounts for group bookings?",
    answer:
      "We offer special discounts for large groups. Please contact our sales team with your group size and tour of interest to get a customized quote.",
  },
  {
    question: "What is your refund policy?",
    answer:
      "Our refund policy depends on the tour's cancellation policy. If you cancel within the eligible period, a full refund will be processed to your original payment method within 7-10 business days.",
  },
  {
    question: "Is travel insurance included in the tour price?",
    answer:
      "Travel insurance is not included in the standard tour price. We highly recommend purchasing travel insurance to protect yourself against unforeseen events like cancellations, delays, or medical emergencies.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) =>
    setOpenIndex(openIndex === index ? null : index);

  return (
    <section className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900 py-20 px-6 sm:px-10 lg:px-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white">
          Frequently Asked Questions
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mt-4">
          Find quick answers to the most common questions about our services,
          bookings, and policies.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {faqData.map((faq, i) => (
          <Card
            key={i}
            className="overflow-hidden border border-gray-200 dark:border-gray-700 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            <CardHeader
              className="p-6 flex justify-between items-center cursor-pointer"
              onClick={() => toggle(i)}
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="h-6 w-6 text-blue-500" />
                <span className="font-semibold text-lg dark:text-gray-100">
                  {faq.question}
                </span>
              </div>
              {openIndex === i ? (
                <ChevronUp className="h-6 w-6 text-blue-500 transition-transform duration-300" />
              ) : (
                <ChevronDown className="h-6 w-6 text-gray-500 transition-transform duration-300" />
              )}
            </CardHeader>

            <AnimatePresence>
              {openIndex === i && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  <CardContent className="flex items-start gap-3 p-6 pt-0 text-gray-600 dark:text-gray-300">
                    <MessageSquare className="h-5 w-5 text-green-500 mt-1" />
                    <p>{faq.answer}</p>
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        ))}
      </div>
    </section>
  );
}
