"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CancelProps {
  bookingId: string;
  onConfirm: (id: string) => void;
  disabled?: boolean;
}

export const CancelBookingButton: React.FC<CancelProps> = ({
  bookingId,
  onConfirm,
  disabled,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild disabled={disabled}>
        <button
          className={`px-4 py-2 text-white rounded-lg text-sm transition-colors ${
            disabled ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
          }`}
        >
          Cancel
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
        </DialogHeader>
        <p>Do you really want to cancel this booking? This action cannot be undone.</p>
        <DialogFooter>
          <Button
            variant="outline"
            className="mr-2"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => onConfirm(bookingId)}
          >
            Yes, Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
