"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface TruncatedTextProps {
  text: string;
  maxWords?: number;
  className?: string;
  showButton?: boolean;
  buttonText?: {
    show: string;
    hide: string;
  };
  as?: "span" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";
}

export function TruncatedText({
  text,
  maxWords = 50,
  className,
  showButton = true,
  buttonText = {
    show: "Xem thêm",
    hide: "Thu gọn",
  },
  as = "span",
}: TruncatedTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  // Split text into words
  const words = text.trim().split(/\s+/);
  const shouldTruncate = words.length > maxWords;
  const displayWords = isExpanded ? words : words.slice(0, maxWords);
  const displayText = displayWords.join(" ");
  const isTruncated = shouldTruncate;

  const Element = as;

  if (!shouldTruncate) {
    return <Element className={className}>{text}</Element>;
  }

  return (
    <Element ref={textRef} className={cn("transition-all duration-300", className)}>
      <div className="flex items-start gap-1">
        <span className={cn("inline-block flex-1", !isExpanded && "line-clamp-3")}>
          {displayText}
          {!isExpanded && shouldTruncate && "..."}
        </span>
        {showButton && isTruncated && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-auto p-0 text-primary hover:text-primary/80 hover:bg-transparent inline-flex items-center gap-1 ml-1 flex-shrink-0"
          >
            {isExpanded ? (
              <>
                {buttonText.hide}
                <ChevronUp className="h-3 w-3" />
              </>
            ) : (
              <>
                {buttonText.show}
                <ChevronDown className="h-3 w-3" />
              </>
            )}
          </Button>
        )}
      </div>
    </Element>
  );
}
