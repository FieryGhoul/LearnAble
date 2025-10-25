import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { userPreferenceSchema, type UserPreference, neurotypes, learningPreferences } from "@shared/schema";
import { Brain, Sparkles, CheckCircle2, X } from "lucide-react";
import { NeurotypCard } from "@/components/neurotype-card";

export default function Questionnaire() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [topicInput, setTopicInput] = useState("");

  const neurotypDescriptions: Record<string, string> = {
    "ADHD": "Recommendations prioritize engaging content, shorter modules, progress tracking, and gamified experiences",
    "Dyslexia": "Courses with excellent captions, transcripts, high-contrast visuals, and dyslexia-friendly fonts",
    "Autism": "Structured courses with clear objectives, predictable patterns, and minimal distractions",
    "Auditory Processing Disorder": "Text-first content with comprehensive captions and downloadable transcripts",
    "Multiple": "Combine support features from multiple neurotypes for comprehensive accessibility",
    "Other": "Customize your learning preferences to find courses that match your unique needs"
  };

  const form = useForm<UserPreference>({
    resolver: zodResolver(userPreferenceSchema),
    defaultValues: {
      neurotype: "ADHD",
      learningPreferences: [],
      topics: [],
      accessibilityNeeds: []
    }
  });

  const selectedTopics = form.watch("topics");

  const addTopic = () => {
    if (topicInput.trim()) {
      const current = form.getValues("topics");
      if (!current.includes(topicInput.trim())) {
        form.setValue("topics", [...current, topicInput.trim()]);
      }
      setTopicInput("");
    }
  };

  const removeTopic = (topic: string) => {
    const current = form.getValues("topics");
    form.setValue("topics", current.filter(t => t !== topic));
  };

  const onSubmit = (data: UserPreference) => {
    const queryParams = new URLSearchParams({
      neurotype: data.neurotype,
      preferences: JSON.stringify(data.learningPreferences),
      topics: JSON.stringify(data.topics),
      accessibility: JSON.stringify(data.accessibilityNeeds || [])
    });
    setLocation(`/results?${queryParams.toString()}`);
  };

  const totalSteps = 3;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-16">
        {/* Header */}
        <div className="mb-12">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="mb-6"
            data-testid="button-back-home"
          >
            <X className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">
              Build your learning profile
            </h1>
          </div>
          
          <p className="text-lg text-muted-foreground leading-relaxed">
            This helps us recommend courses that truly work for you
          </p>

          {/* Progress Indicator */}
          <div className="flex gap-2 mt-8">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  i + 1 <= currentStep ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
            {/* Step 1: Neurotype */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-foreground mb-2">
                    What describes your neurodiversity?
                  </h2>
                  <p className="text-muted-foreground">
                    Select the option that best fits your learning profile
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="neurotype"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {neurotypes.map((type) => (
                            <NeurotypCard
                              key={type}
                              neurotype={type}
                              description={neurotypDescriptions[type]}
                              selected={field.value === type}
                              onSelect={() => field.onChange(type)}
                            />
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="button"
                  size="lg"
                  onClick={() => setCurrentStep(2)}
                  className="w-full md:w-auto h-12 px-8"
                  data-testid="button-next-step-1"
                >
                  Continue
                </Button>
              </div>
            )}

            {/* Step 2: Learning Preferences */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-foreground mb-2">
                    What are your learning preferences?
                  </h2>
                  <p className="text-muted-foreground">
                    Select all that apply to help us find the best courses
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="learningPreferences"
                  render={() => (
                    <FormItem>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {learningPreferences.map((pref) => (
                          <FormField
                            key={pref}
                            control={form.control}
                            name="learningPreferences"
                            render={({ field }) => (
                              <FormItem
                                className="flex items-center space-x-3 space-y-0 bg-card border border-card-border rounded-lg p-4 hover-elevate"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(pref)}
                                    onCheckedChange={(checked) => {
                                      const current = field.value || [];
                                      field.onChange(
                                        checked
                                          ? [...current, pref]
                                          : current.filter((val) => val !== pref)
                                      );
                                    }}
                                    data-testid={`checkbox-preference-${pref.toLowerCase().replace(/\s+/g, "-")}`}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-medium leading-tight cursor-pointer flex-1">
                                  {pref}
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() => setCurrentStep(1)}
                    className="h-12 px-8"
                    data-testid="button-back-step-2"
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    size="lg"
                    onClick={() => {
                      if (form.getValues("learningPreferences").length > 0) {
                        setCurrentStep(3);
                      } else {
                        form.setError("learningPreferences", {
                          message: "Select at least one learning preference"
                        });
                      }
                    }}
                    className="h-12 px-8"
                    data-testid="button-next-step-2"
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Topics */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-foreground mb-2">
                    What do you want to learn?
                  </h2>
                  <p className="text-muted-foreground">
                    Add topics or skills you're interested in learning
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="topics"
                  render={() => (
                    <FormItem>
                      <FormControl>
                        <div className="space-y-4">
                          <div className="flex gap-3">
                            <Input
                              type="text"
                              placeholder="e.g., Python, Graphic Design, Photography"
                              value={topicInput}
                              onChange={(e) => setTopicInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  addTopic();
                                }
                              }}
                              className="h-12 flex-1"
                              data-testid="input-topic"
                            />
                            <Button
                              type="button"
                              onClick={addTopic}
                              size="lg"
                              className="h-12 px-6"
                              data-testid="button-add-topic"
                            >
                              Add
                            </Button>
                          </div>

                          {selectedTopics.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {selectedTopics.map((topic) => (
                                <Badge
                                  key={topic}
                                  variant="secondary"
                                  className="px-3 py-2 text-sm"
                                  data-testid={`badge-topic-${topic.toLowerCase().replace(/\s+/g, "-")}`}
                                >
                                  {topic}
                                  <button
                                    type="button"
                                    onClick={() => removeTopic(topic)}
                                    className="ml-2 hover:text-destructive"
                                    data-testid={`button-remove-topic-${topic.toLowerCase().replace(/\s+/g, "-")}`}
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() => setCurrentStep(2)}
                    className="h-12 px-8"
                    data-testid="button-back-step-3"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    size="lg"
                    className="h-12 px-8"
                    disabled={selectedTopics.length === 0}
                    data-testid="button-find-courses"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Find my courses
                  </Button>
                </div>
              </div>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}
