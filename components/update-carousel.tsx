"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface UpdateItem {
  id: string;
  title: string;
  date: string;
  description: string;
  version?: string;
  features?: string[];
}

interface UpdateCarouselProps {
  updates: UpdateItem[];
}

export function UpdateCarousel({ updates }: UpdateCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? updates.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === updates.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (updates.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-3xl mx-auto py-1">
      <div className="relative">
        {/* Navigation Arrows */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 rounded-full shadow-md"
          onClick={goToPrevious}
          aria-label="Previous update"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 rounded-full shadow-md"
          onClick={goToNext}
          aria-label="Next update"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        
        {/* Update Content */}
        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {updates.map((update) => (
              <div 
                key={update.id} 
                className="min-w-full flex-shrink-0 px-0"
              >
                <div className="">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary border border-primary/20">
                      {update.version && <span className="mr-1.5">v{update.version}</span>}
                      <span>{update.date}</span>
                    </div>
                    <h3 className="text-xl font-bold text-foreground text-center">{update.title}</h3>
                    
                    {/* Description */}
                    {update.description && (
                      <p className="text-muted-foreground text-sm text-center">
                        {update.description}
                      </p>
                    )}
                    
                    {/* Features List */}
                    {update.features && update.features.length > 0 && (
                      <div className="w-full max-w-md">
                        <ul className="space-y-2 text-left">
                          {update.features.map((feature, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-primary mr-2">•</span>
                              <span className="text-muted-foreground text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Dots Indicator */}
        <div className="flex justify-center mt-4 space-x-2">
          {updates.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 w-2 rounded-full transition-colors ${
                index === currentIndex 
                  ? "bg-primary" 
                  : "bg-muted"
              }`}
              aria-label={`Go to update ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}