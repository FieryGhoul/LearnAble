import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Sparkles, Heart, Shield, Lightbulb } from "lucide-react";

export default function Home() {
  const [, setLocation] = useLocation();
  const [quickSearch, setQuickSearch] = useState("");

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      setLocation(`/questionnaire?topic=${encodeURIComponent(quickSearch.trim())}`);
    }
  };

  const handleStartQuestionnaire = () => {
    setLocation("/questionnaire");
  };

  const features = [
    {
      icon: Heart,
      title: "Neuro-affirming",
      description: "Supportive recommendations that celebrate how your brain works"
    },
    {
      icon: Shield,
      title: "Accessibility-first",
      description: "Every course is evaluated for captions, transcripts, and inclusive design"
    },
    {
      icon: Lightbulb,
      title: "Personalized matches",
      description: "Smart recommendations based on your unique learning profile"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        {/* Hero Section */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            Find courses that work with your brain
          </div>
          
          <h1 className="text-5xl font-bold text-foreground mb-6 leading-tight">
            Learning that fits <span className="text-primary">your needs</span>
          </h1>
          
          <p className="text-xl text-muted-foreground leading-relaxed mb-12">
            Discover online courses matched to your neurodiversity profile and learning preferences. 
            Reduce overwhelm, improve success.
          </p>

          {/* Quick Search */}
          {/* <form onSubmit={handleQuickSearch} className="mb-6">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              <Input
                type="text"
                placeholder="What do you want to learn? (e.g., Python, Graphic Design)"
                value={quickSearch}
                onChange={(e) => setQuickSearch(e.target.value)}
                className="h-16 pl-14 pr-6 text-base rounded-xl border-2 focus-visible:ring-2"
                data-testid="input-quick-search"
              />
            </div>
          </form> */}

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-4">
            <Button
              size="lg"
              onClick={handleStartQuestionnaire}
              className="h-12 px-8 rounded-lg text-base font-medium"
              data-testid="button-start-questionnaire"
            >
              Get personalized recommendations
            </Button>
            
            {quickSearch.trim() && (
              <Button
                size="lg"
                variant="outline"
                onClick={handleQuickSearch}
                className="h-12 px-8 rounded-lg text-base font-medium"
                data-testid="button-quick-search"
              >
                Quick search
              </Button>
            )}
          </div>

          <p className="text-sm text-muted-foreground">
            No account required • Free to use • Privacy-focused
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card border border-card-border rounded-lg p-6 text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 text-primary rounded-lg mb-4">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* How it Works */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-foreground mb-12">
            How it works
          </h2>
          
          <div className="space-y-8">
            {[
              {
                step: "1",
                title: "Share your learning profile",
                description: "Tell us about your neurodiversity type and learning preferences in a quick, supportive questionnaire."
              },
              {
                step: "2",
                title: "Get matched with courses",
                description: "Our algorithm finds courses from platforms like Coursera, edX, and Udemy that align with your needs."
              },
              {
                step: "3",
                title: "Learn with confidence",
                description: "See why each course is a good fit, with clear accessibility details and match explanations."
              }
            ].map((item) => (
              <div key={item.step} className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-lg flex items-center justify-center text-xl font-bold">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
