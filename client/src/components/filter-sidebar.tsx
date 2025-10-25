import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";
import type { MatchResult } from "@shared/schema";

interface FilterSidebarProps {
  filters: {
    priceTypes: string[];
    skillLevels: string[];
    platforms: string[];
    minMatch: number;
  };
  onFiltersChange: (filters: any) => void;
  matches: MatchResult[];
}

export function FilterSidebar({ filters, onFiltersChange, matches }: FilterSidebarProps) {
  const priceTypes = ["free", "paid"];
  const skillLevels = ["beginner", "intermediate", "advanced"];
  
  // Extract unique platforms from matches
  const platforms = Array.from(new Set(matches.map(m => m.course.platform))).sort();

  const handlePriceToggle = (price: string) => {
    const newPrices = filters.priceTypes.includes(price)
      ? filters.priceTypes.filter(p => p !== price)
      : [...filters.priceTypes, price];
    onFiltersChange({ ...filters, priceTypes: newPrices });
  };

  const handleSkillToggle = (skill: string) => {
    const newSkills = filters.skillLevels.includes(skill)
      ? filters.skillLevels.filter(s => s !== skill)
      : [...filters.skillLevels, skill];
    onFiltersChange({ ...filters, skillLevels: newSkills });
  };

  const handlePlatformToggle = (platform: string) => {
    const newPlatforms = filters.platforms.includes(platform)
      ? filters.platforms.filter(p => p !== platform)
      : [...filters.platforms, platform];
    onFiltersChange({ ...filters, platforms: newPlatforms });
  };

  const clearAll = () => {
    onFiltersChange({ priceTypes: [], skillLevels: [], platforms: [], minMatch: 0 });
  };

  const hasActiveFilters = filters.priceTypes.length > 0 || 
                           filters.skillLevels.length > 0 || 
                           filters.platforms.length > 0 || 
                           filters.minMatch > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Filters</h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="h-8 text-xs"
            data-testid="button-clear-all-filters"
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Match Score */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Minimum Match Score</Label>
        <div className="space-y-2">
          <Slider
            value={[filters.minMatch]}
            onValueChange={(value) => onFiltersChange({ ...filters, minMatch: value[0] })}
            min={0}
            max={100}
            step={5}
            className="w-full"
            data-testid="slider-min-match"
          />
          <div className="text-sm text-muted-foreground text-center">
            {filters.minMatch}%+
          </div>
        </div>
      </div>

      <Separator />

      {/* Price Type */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Price</Label>
        <div className="space-y-2">
          {priceTypes.map((price) => (
            <div key={price} className="flex items-center space-x-2">
              <Checkbox
                id={`price-${price}`}
                checked={filters.priceTypes.includes(price)}
                onCheckedChange={() => handlePriceToggle(price)}
                data-testid={`checkbox-filter-price-${price}`}
              />
              <label
                htmlFor={`price-${price}`}
                className="text-sm capitalize cursor-pointer flex-1"
              >
                {price}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Skill Level */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Skill Level</Label>
        <div className="space-y-2">
          {skillLevels.map((skill) => (
            <div key={skill} className="flex items-center space-x-2">
              <Checkbox
                id={`skill-${skill}`}
                checked={filters.skillLevels.includes(skill)}
                onCheckedChange={() => handleSkillToggle(skill)}
                data-testid={`checkbox-filter-skill-${skill}`}
              />
              <label
                htmlFor={`skill-${skill}`}
                className="text-sm capitalize cursor-pointer flex-1"
              >
                {skill}
              </label>
            </div>
          ))}
        </div>
      </div>

      {platforms.length > 0 && (
        <>
          <Separator />

          {/* Platform */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Platform</Label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {platforms.map((platform) => (
                <div key={platform} className="flex items-center space-x-2">
                  <Checkbox
                    id={`platform-${platform}`}
                    checked={filters.platforms.includes(platform)}
                    onCheckedChange={() => handlePlatformToggle(platform)}
                    data-testid={`checkbox-filter-platform-${platform.toLowerCase()}`}
                  />
                  <label
                    htmlFor={`platform-${platform}`}
                    className="text-sm cursor-pointer flex-1"
                  >
                    {platform}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
