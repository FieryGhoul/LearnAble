import { useEffect, useState } from "react";
import { useLocation, useSearch } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Filter, X, SlidersHorizontal } from "lucide-react";
import { CourseCard } from "@/components/course-card";
import { FilterSidebar } from "@/components/filter-sidebar";
import type { MatchResult, UserPreference } from "@shared/schema";

export default function Results() {
  const [, setLocation] = useLocation();
  const searchParams = useSearch();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    priceTypes: [] as string[],
    skillLevels: [] as string[],
    platforms: [] as string[],
    minMatch: 0
  });

  // Parse user preferences from URL
  const userPreference: UserPreference | null = (() => {
    try {
      const params = new URLSearchParams(searchParams);
      const neurotype = params.get("neurotype");
      const preferences = params.get("preferences");
      const topics = params.get("topics");
      const accessibility = params.get("accessibility");

      if (!neurotype || !preferences || !topics) return null;

      return {
        neurotype: neurotype as any,
        learningPreferences: JSON.parse(preferences),
        topics: JSON.parse(topics),
        accessibilityNeeds: accessibility ? JSON.parse(accessibility) : []
      };
    } catch {
      return null;
    }
  })();

  const { data: matches, isLoading, error } = useQuery<MatchResult[]>({
    queryKey: ["/api/matches", userPreference],
    enabled: !!userPreference,
    queryFn: async () => {
      if (!userPreference) throw new Error("No user preference");
      
      const params = new URLSearchParams({
        neurotype: userPreference.neurotype,
        preferences: JSON.stringify(userPreference.learningPreferences),
        topics: JSON.stringify(userPreference.topics),
        accessibility: JSON.stringify(userPreference.accessibilityNeeds || [])
      });
      
      const response = await fetch(`/api/matches?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch course matches");
      }
      return response.json();
    }
  });

  const filteredMatches = matches?.filter((match) => {
    if (filters.minMatch > 0 && match.matchScore < filters.minMatch) return false;
    if (filters.priceTypes.length > 0) {
      const isFree = match.course.price.toLowerCase().includes("free");
      const hasFreeFilter = filters.priceTypes.includes("free");
      const hasPaidFilter = filters.priceTypes.includes("paid");
      
      if (hasFreeFilter && !isFree) return false;
      if (hasPaidFilter && isFree) return false;
    }
    if (filters.skillLevels.length > 0 && !filters.skillLevels.includes(match.course.skillLevel)) return false;
    if (filters.platforms.length > 0 && !filters.platforms.includes(match.course.platform)) return false;
    return true;
  });

  if (!userPreference) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            No preferences found
          </h2>
          <p className="text-muted-foreground mb-6">
            Please complete the questionnaire to get personalized course recommendations.
          </p>
          <Button onClick={() => setLocation("/questionnaire")} data-testid="button-go-to-questionnaire">
            Start questionnaire
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="mb-4"
            data-testid="button-back-home"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Start over
          </Button>

          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <h1 className="text-4xl font-bold text-foreground mb-3">
                Your personalized matches
              </h1>
              <p className="text-lg text-muted-foreground">
                Courses matched to <span className="font-medium text-foreground">{userPreference.neurotype}</span> learning profile
              </p>
            </div>

            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden h-12 px-6"
              data-testid="button-toggle-filters-mobile"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Applied Filters Summary */}
          {(filters.priceTypes.length > 0 || filters.skillLevels.length > 0 || filters.platforms.length > 0 || filters.minMatch > 0) && (
            <div className="mt-6 flex flex-wrap gap-2 items-center">
              <span className="text-sm text-muted-foreground">Filters:</span>
              {filters.priceTypes.map((type) => (
                <Button
                  key={type}
                  variant="secondary"
                  size="sm"
                  onClick={() => setFilters({ ...filters, priceTypes: filters.priceTypes.filter(t => t !== type) })}
                  className="h-8"
                  data-testid={`button-remove-filter-${type}`}
                >
                  {type}
                  <X className="w-3 h-3 ml-2" />
                </Button>
              ))}
              {filters.skillLevels.map((level) => (
                <Button
                  key={level}
                  variant="secondary"
                  size="sm"
                  onClick={() => setFilters({ ...filters, skillLevels: filters.skillLevels.filter(l => l !== level) })}
                  className="h-8"
                  data-testid={`button-remove-filter-${level}`}
                >
                  {level}
                  <X className="w-3 h-3 ml-2" />
                </Button>
              ))}
              {filters.platforms.map((platform) => (
                <Button
                  key={platform}
                  variant="secondary"
                  size="sm"
                  onClick={() => setFilters({ ...filters, platforms: filters.platforms.filter(p => p !== platform) })}
                  className="h-8"
                  data-testid={`button-remove-filter-${platform.toLowerCase()}`}
                >
                  {platform}
                  <X className="w-3 h-3 ml-2" />
                </Button>
              ))}
              {filters.minMatch > 0 && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setFilters({ ...filters, minMatch: 0 })}
                  className="h-8"
                  data-testid="button-remove-filter-match"
                >
                  {filters.minMatch}%+ match
                  <X className="w-3 h-3 ml-2" />
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden md:block w-80 flex-shrink-0">
            <div className="sticky top-8">
              <FilterSidebar
                filters={filters}
                onFiltersChange={setFilters}
                matches={matches || []}
              />
            </div>
          </div>

          {/* Mobile Filter Sidebar (Sheet) */}
          {showFilters && (
            <div className="fixed inset-0 z-50 md:hidden">
              <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowFilters(false)} />
              <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-background border-l border-border shadow-xl overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Filters</h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowFilters(false)}
                      data-testid="button-close-filters"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                  <FilterSidebar
                    filters={filters}
                    onFiltersChange={setFilters}
                    matches={matches || []}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className="space-y-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="border border-card-border rounded-lg p-6">
                    <Skeleton className="h-6 w-3/4 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-destructive/10 text-destructive rounded-full mb-4">
                  <X className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Failed to load courses
                </h3>
                <p className="text-muted-foreground mb-6">
                  We couldn't find course matches. Please try again or adjust your preferences.
                </p>
                <Button
                  onClick={() => setLocation("/questionnaire")}
                  data-testid="button-retry-questionnaire"
                >
                  Try again
                </Button>
              </div>
            ) : filteredMatches && filteredMatches.length > 0 ? (
              <div className="space-y-6">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredMatches.length} of {matches?.length || 0} courses
                </p>
                {filteredMatches.map((match) => (
                  <CourseCard key={match.course.id} match={match} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <SlidersHorizontal className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No courses found
                </h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters to see more results
                </p>
                <Button
                  variant="outline"
                  onClick={() => setFilters({ priceTypes: [], skillLevels: [], platforms: [], minMatch: 0 })}
                  data-testid="button-clear-filters"
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
