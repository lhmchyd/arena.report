"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { Computer } from "lucide-react";

export function MobileRestriction({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
        <Computer className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold text-center text-foreground">Mobile not supported</h2>
        <p className="text-muted-foreground text-center mt-2">
          Please use a desktop computer
        </p>
      </div>
    );
  }

  return <>{children}</>;
}