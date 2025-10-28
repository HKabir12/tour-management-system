"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchParams, useRouter } from "next/navigation";

interface Division {
  _id: string;
  name: string;
}

interface TourType {
  _id: string;
  name: string;
}

export default function TourFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const selectedDivision = searchParams.get("division") || "";
  const selectedTourType = searchParams.get("tourType") || "";

  const [divisions, setDivisions] = useState<Division[]>([]);
  const [tourTypes, setTourTypes] = useState<TourType[]>([]);
  const [loading, setLoading] = useState({ divisions: true, tourTypes: true });

  // ✅ Fetch divisions
  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        const res = await fetch("/api/divisions");
        const data = await res.json();
        setDivisions(data);
      } catch (err) {
        console.error("Error fetching divisions:", err);
      } finally {
        setLoading((prev) => ({ ...prev, divisions: false }));
      }
    };
    fetchDivisions();
  }, []);

  // ✅ Fetch tour types
  useEffect(() => {
    const fetchTourTypes = async () => {
      try {
        const res = await fetch("/api/tourTypes");
        const data = await res.json();
        setTourTypes(data);
      } catch (err) {
        console.error("Error fetching tour types:", err);
      } finally {
        setLoading((prev) => ({ ...prev, tourTypes: false }));
      }
    };
    fetchTourTypes();
  }, []);

  // ✅ Update search params dynamically
  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/tours?${params.toString()}`);
  };

  // ✅ Clear all filters
  const handleClearFilter = () => {
    router.push("/tours");
  };

  return (
    <div className="col-span-3 w-full border border-muted rounded-md p-5 space-y-5 h-fit">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="font-semibold text-lg">Filters</h1>
        <Button size="sm" variant="outline" onClick={handleClearFilter}>
          Clear Filter
        </Button>
      </div>

      {/* Division Filter */}
      <div>
        <Label className="mb-2 block">Division to visit</Label>
        <Select
          onValueChange={(value) => updateParams("division", value)}
          value={selectedDivision}
          disabled={loading.divisions}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={loading.divisions ? "Loading..." : "Select division"} />
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
      </div>

      {/* Tour Type Filter */}
      <div>
        <Label className="mb-2 block">Tour Type</Label>
        <Select
          onValueChange={(value) => updateParams("tourType", value)}
          value={selectedTourType}
          disabled={loading.tourTypes}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={loading.tourTypes ? "Loading..." : "Select tour type"} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Tour Types</SelectLabel>
              {tourTypes.map((type) => (
                <SelectItem key={type._id} value={type.name}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
