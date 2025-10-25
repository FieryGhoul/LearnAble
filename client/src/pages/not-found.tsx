import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-destructive/10 text-destructive rounded-full mb-6">
          <AlertCircle className="w-8 h-8" />
        </div>
        
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Page not found
        </h1>
        
        <p className="text-lg text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <Button
          size="lg"
          onClick={() => setLocation("/")}
          className="h-12 px-8"
          data-testid="button-go-home"
        >
          Go to homepage
        </Button>
      </div>
    </div>
  );
}
