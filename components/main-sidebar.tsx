"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, User } from "lucide-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

// --- Main Tracker Component ---
export function MainSidebar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <Sidebar>
      <SidebarHeader>
        <h1 className="text-lg font-semibold">Main Tracker</h1>
      </SidebarHeader>

      <SidebarContent>
        {/* your sidebar content here */}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            {!mounted ? (
              // SSR placeholder → no mismatch
              <SidebarMenuButton tooltip="Toggle Theme" disabled>
                <span className="h-4 w-4" />
                <span className="ml-2">Theme</span>
              </SidebarMenuButton>
            ) : (
              <SidebarMenuButton
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                tooltip="Toggle Theme"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
                <span className="ml-2">Theme</span>
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Profile">
              <div className="flex items-center justify-center p-1 bg-primary/10 rounded w-6 h-6">
                <User className="h-4 w-4" />
              </div>
              <span className="ml-2">Profile</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}