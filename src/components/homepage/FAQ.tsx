"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChevronDown, ChevronUp, HelpCircle, MessageSquare } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface IFAQ {
  _id: string;
  question: string;
  answer: string;
}

export default function FAQ() {
  const [faqs, setFaqs] = useState<IFAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) =>
    setOpenIndex(openIndex === index ? null : index);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const res = await fetch("/api/faqs");
        if (!res.ok) throw new Error("Failed to fetch FAQs");
        const data = await res.json();
        setFaqs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  return (
    <section className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900 py-20 px-6 sm:px-10 lg:px-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white">
          Frequently Asked Questions
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mt-4">
          Find quick answers to the most common questions about our tours and services.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {loading ? (
          <>
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-2xl" />
            ))}
          </>
        ) : faqs.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No FAQs found.
          </p>
        ) : (
          faqs.map((faq, i) => (
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
          ))
        )}
      </div>
    </section>
  );
}
