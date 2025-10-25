import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Clock, BarChart3, DollarSign } from "lucide-react";
import { AccessibilityIcons } from "@/components/accessibility-icons";
import { MatchBadge } from "@/components/match-badge";
import type { MatchResult } from "@shared/schema";

interface CourseCardProps {
  match: MatchResult;
}

export function CourseCard({ match }: CourseCardProps) {
  const { course, matchScore, matchReasons, accessibilityHighlights } = match;

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    if (hours === 0) return `${minutes}min`;
    if (minutes % 60 === 0) return `${hours}h`;
    return `${hours}h ${minutes % 60}min`;
  };

  return (
    <div className="bg-card border border-card-border rounded-lg p-6 hover-elevate transition-all" data-testid={`card-course-${course.id}`}>
      {/* Match Badge */}
      <div className="mb-4">
        <MatchBadge score={matchScore} reason={matchReasons[0]} />
      </div>

      {/* Course Info */}
      <div className="mb-4">
        <div className="flex items-start justify-between gap-4 mb-2">
          <h3 className="text-xl font-semibold text-card-foreground leading-tight flex-1">
            {course.title}
          </h3>
          <Badge variant="secondary" className="flex-shrink-0">
            {course.platform}
          </Badge>
        </div>

        {course.instructor && (
          <p className="text-sm text-muted-foreground mb-3">
            {course.instructor}
          </p>
        )}

        <p className="text-muted-foreground leading-relaxed line-clamp-2">
          {course.description}
        </p>
      </div>

      {/* Metadata */}
      <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>{formatDuration(course.duration)} total</span>
        </div>
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          <span className="capitalize">{course.skillLevel}</span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4" />
          <span>{course.price}</span>
        </div>
      </div>

      {/* Accessibility Icons */}
      <div className="mb-4">
        <AccessibilityIcons course={course} />
      </div>

      {/* Match Reasons */}
      {matchReasons.length > 0 && (
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4">
          <h4 className="text-sm font-semibold text-foreground mb-2">
            Why this course fits:
          </h4>
          <ul className="space-y-1">
            {matchReasons.slice(0, 3).map((reason, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Accessibility Highlights */}
      {accessibilityHighlights.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-foreground mb-2">
            Accessibility features:
          </h4>
          <div className="flex flex-wrap gap-2">
            {accessibilityHighlights.map((highlight, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {highlight}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <Button
        asChild
        className="w-full h-12"
        data-testid={`button-view-course-${course.id}`}
      >
        <a href={course.url} target="_blank" rel="noopener noreferrer">
          View course on {course.platform}
          <ExternalLink className="w-4 h-4 ml-2" />
        </a>
      </Button>
    </div>
  );
}
