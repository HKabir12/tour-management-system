"use client";
import React from "react";
import { SidebarTrigger } from "../ui/sidebar";

import { ModeToggle } from "../theme/theme-btn";
import { DropdownMenu } from "../ui/dropdown-menu";

const SidebarIcon = () => {
  return (
    <div className="p-2 flex items-center justify-between sticky top-0 bg-background z-10">
      <SidebarTrigger></SidebarTrigger>

      <div>
        <DropdownMenu>
          <ModeToggle />
        </DropdownMenu>
      </div>
    </div>
  );
};

export default SidebarIcon;
