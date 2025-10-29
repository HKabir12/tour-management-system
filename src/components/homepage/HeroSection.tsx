"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import Link from "next/link";
import ColourfulText from "../ui/colourful-text";

interface Division {
  _id: string;
  name: string;
}

export default function HeroSection() {
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [selectedDivision, setSelectedDivision] = useState<
    string | undefined
  >();
  const [loading, setLoading] = useState(true);

  // Fetch divisions from API (MongoDB)
  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        const res = await fetch("/api/divisions");
        if (!res.ok) throw new Error("Failed to fetch divisions");
        const data = await res.json();
        setDivisions(data);
      } catch (error) {
        console.error("Error loading divisions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDivisions();
  }, []);

  return (
    <section className="relative overflow-hidden py-4">
      {/* Background pattern */}
      {/* <div className="absolute inset-x-0 top-0 flex h-full w-full items-center justify-center">
        <Image
          alt="background"
          src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/patterns/square-alt-grid.svg"
          className="[mask-image:radial-gradient(75%_75%_at_center,white,transparent)] opacity-90"
          fill
        />
      </div> */}

      <div className="relative z-10 container mx-auto">
        <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
          {/* Logo */}
          {/* <div className="rounded-xl bg-background/30 p-4 shadow-sm backdrop-blur-sm">
            <Image src={Logo} alt="Logo" width={100} height={100} />
          </div> */}

          {/* Text */}
          <h1 className="text-2xl md:text-3xl lg:text-6xl font-bold text-center  relative z-2 font-sans mb-4">
            Explore the <ColourfulText text="beauty of Bangladesh" /> <br />
          </h1>
          <p className="max-w-3xl text-muted-foreground lg:text-lg">
            Discover breathtaking tours, destinations, and experiences — one
            click away.
          </p>

          {/* Select + Button */}
          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-3">
            <Select
              onValueChange={(value) => setSelectedDivision(value)}
              disabled={loading}
            >
              <SelectTrigger className="w-[280px]">
                <SelectValue
                  placeholder={
                    loading ? "Loading divisions..." : "Select a division"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Divisions</SelectLabel>
                  {divisions.map((division) => (
                    <SelectItem key={division._id} value={division.name}>
                      {division.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            {selectedDivision ? (
              <Button asChild>
                <Link href={`/tours?division=${selectedDivision}`}>Search</Link>
              </Button>
            ) : (
              <Button disabled>Search</Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
