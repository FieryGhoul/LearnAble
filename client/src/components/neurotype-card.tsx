import { CheckCircle2 } from "lucide-react";
import type { Neurotype } from "@shared/schema";

interface NeurotypCardProps {
  neurotype: Neurotype;
  description: string;
  selected: boolean;
  onSelect: () => void;
}

export function NeurotypCard({ neurotype, description, selected, onSelect }: NeurotypCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`
        relative text-left p-6 rounded-lg border-2 transition-all
        ${selected 
          ? "border-primary bg-primary/5" 
          : "border-card-border bg-card hover-elevate"
        }
      `}
      data-testid={`button-neurotype-${neurotype.toLowerCase().replace(/\s+/g, "-")}`}
    >
      {selected && (
        <div className="absolute top-4 right-4">
          <CheckCircle2 className="w-6 h-6 text-primary" />
        </div>
      )}
      
      <h3 className="text-lg font-semibold text-foreground mb-2 pr-8">
        {neurotype}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </button>
  );
}
