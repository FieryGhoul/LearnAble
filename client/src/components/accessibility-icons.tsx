import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Captions, FileText, Type, LayoutGrid, TrendingUp, Gamepad2, Clock } from "lucide-react";
import type { Course } from "@shared/schema";

interface AccessibilityIconsProps {
  course: Course;
}

export function AccessibilityIcons({ course }: AccessibilityIconsProps) {
  const features = [
    { icon: Captions, label: "Captions available", enabled: course.hasCaption },
    { icon: FileText, label: "Transcripts provided", enabled: course.hasTranscript },
    { icon: Type, label: "Dyslexia-friendly fonts", enabled: course.hasDyslexiaFont },
    { icon: LayoutGrid, label: "Structured layout", enabled: course.hasStructuredLayout },
    { icon: TrendingUp, label: "Progress tracking", enabled: course.hasProgressTracking },
    { icon: Gamepad2, label: "Gamified learning", enabled: course.isGamified },
    { icon: Clock, label: "Self-paced", enabled: course.isSelfPaced },
  ];

  const enabledFeatures = features.filter(f => f.enabled);

  if (enabledFeatures.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        No special accessibility features reported
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      {enabledFeatures.map(({ icon: Icon, label }) => (
        <Tooltip key={label}>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-md text-sm">
              <Icon className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">{label}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{label}</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
