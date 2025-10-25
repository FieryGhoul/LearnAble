import { type Course, type MatchResult, type UserPreference, type NeurotypProfile, type Neurotype } from "@shared/schema";
import { coursesData } from "./data/courses";

export interface IStorage {
  getAllCourses(): Promise<Course[]>;
  getCourseById(id: string): Promise<Course | undefined>;
  searchCourses(topics: string[]): Promise<Course[]>;
  getMatchedCourses(preferences: UserPreference): Promise<MatchResult[]>;
}

// Neurotype profiles for matching algorithm
const neurotypProfiles: Record<Neurotype, NeurotypProfile> = {
  "ADHD": {
    neurotype: "ADHD",
    preferredModuleLength: { min: 5, max: 20 },
    preferredContentTypes: ["video", "interactive", "mixed"],
    requiredFeatures: [],
    bonusFeatures: ["isGamified", "hasProgressTracking", "isSelfPaced"],
    description: "Shorter, engaging modules with gamification and progress tracking"
  },
  "Dyslexia": {
    neurotype: "Dyslexia",
    preferredModuleLength: { min: 10, max: 30 },
    preferredContentTypes: ["video", "interactive"],
    requiredFeatures: [],
    bonusFeatures: ["hasCaption", "hasTranscript", "hasDyslexiaFont", "hasStructuredLayout"],
    description: "Strong visual and audio support with readable fonts"
  },
  "Autism": {
    neurotype: "Autism",
    preferredModuleLength: { min: 15, max: 35 },
    preferredContentTypes: ["text", "video", "mixed"],
    requiredFeatures: [],
    bonusFeatures: ["hasStructuredLayout", "isSelfPaced"],
    description: "Predictable structure with clear objectives and minimal distractions"
  },
  "Auditory Processing Disorder": {
    neurotype: "Auditory Processing Disorder",
    preferredModuleLength: { min: 10, max: 25 },
    preferredContentTypes: ["text", "interactive"],
    requiredFeatures: [],
    bonusFeatures: ["hasCaption", "hasTranscript", "hasStructuredLayout"],
    description: "Text-first content with comprehensive written materials"
  },
  "Multiple": {
    neurotype: "Multiple",
    preferredModuleLength: { min: 10, max: 25 },
    preferredContentTypes: ["video", "text", "interactive", "mixed"],
    requiredFeatures: [],
    bonusFeatures: ["hasCaption", "hasTranscript", "hasDyslexiaFont", "hasStructuredLayout", "isGamified", "hasProgressTracking", "isSelfPaced"],
    description: "Comprehensive accessibility features across multiple needs"
  },
  "Other": {
    neurotype: "Other",
    preferredModuleLength: { min: 10, max: 30 },
    preferredContentTypes: ["video", "text", "interactive", "mixed"],
    requiredFeatures: [],
    bonusFeatures: ["isSelfPaced", "hasCaption", "hasTranscript"],
    description: "Flexible learning with strong accessibility foundation"
  }
};

export class MemStorage implements IStorage {
  private courses: Map<string, Course>;

  constructor() {
    this.courses = new Map();
    this.initializeCourses();
  }

  private initializeCourses() {
    coursesData.forEach(course => {
      this.courses.set(course.id, course);
    });
  }

  async getAllCourses(): Promise<Course[]> {
    return Array.from(this.courses.values());
  }

  async getCourseById(id: string): Promise<Course | undefined> {
    return this.courses.get(id);
  }

  async searchCourses(topics: string[]): Promise<Course[]> {
    if (topics.length === 0) {
      return this.getAllCourses();
    }

    const allCourses = Array.from(this.courses.values());
    const lowerTopics = topics.map(t => t.toLowerCase());

    return allCourses.filter(course => {
      const searchText = `${course.title} ${course.description} ${course.category} ${course.tags?.join(' ')}`.toLowerCase();
      return lowerTopics.some(topic => searchText.includes(topic));
    });
  }

  async getMatchedCourses(preferences: UserPreference): Promise<MatchResult[]> {
    const relevantCourses = await this.searchCourses(preferences.topics);
    const profile = neurotypProfiles[preferences.neurotype];

    const matches = relevantCourses.map(course => {
      const { score, reasons } = this.calculateMatchScore(course, preferences, profile);
      const accessibilityHighlights = this.getAccessibilityHighlights(course);

      return {
        course,
        matchScore: score,
        matchReasons: reasons,
        accessibilityHighlights
      };
    });

    // Sort by match score descending
    return matches.sort((a, b) => b.matchScore - a.matchScore);
  }

  private calculateMatchScore(
    course: Course,
    preferences: UserPreference,
    profile: NeurotypProfile
  ): { score: number; reasons: string[] } {
    let score = 50; // Base score
    const reasons: string[] = [];

    // Module length preference (0-20 points)
    if (course.moduleLength >= profile.preferredModuleLength.min &&
        course.moduleLength <= profile.preferredModuleLength.max) {
      score += 20;
      reasons.push(`${course.moduleLength}-minute modules match your preferred pace`);
    } else if (course.moduleLength < profile.preferredModuleLength.min) {
      score += 10;
      reasons.push(`Short ${course.moduleLength}-minute modules for quick learning`);
    }

    // Content type preference (0-15 points)
    if (profile.preferredContentTypes.includes(course.contentType)) {
      score += 15;
      if (course.contentType === "interactive") {
        reasons.push("Interactive content keeps you engaged");
      } else if (course.contentType === "video") {
        reasons.push("Visual learning through video content");
      } else if (course.contentType === "text") {
        reasons.push("Text-based for focused reading");
      } else {
        reasons.push("Mixed content types for variety");
      }
    }

    // Bonus features (0-25 points, 5 per feature)
    let bonusPoints = 0;
    profile.bonusFeatures.forEach(feature => {
      if (course[feature as keyof Course] === true) {
        bonusPoints += 5;
        
        if (feature === "isGamified") reasons.push("Gamified experience makes learning fun");
        if (feature === "hasProgressTracking") reasons.push("Track your progress clearly");
        if (feature === "isSelfPaced") reasons.push("Learn at your own pace");
        if (feature === "hasCaption") reasons.push("Full captions available");
        if (feature === "hasTranscript") reasons.push("Complete transcripts provided");
        if (feature === "hasDyslexiaFont") reasons.push("Dyslexia-friendly typography");
        if (feature === "hasStructuredLayout") reasons.push("Well-organized, predictable structure");
      }
    });
    score += Math.min(bonusPoints, 25);

    // Learning preferences match (0-20 points)
    preferences.learningPreferences.forEach(pref => {
      if (pref.includes("Short lessons") && course.moduleLength <= 15) {
        score += 5;
        if (!reasons.some(r => r.includes("modules"))) {
          reasons.push("Short lesson format reduces overwhelm");
        }
      }
      if (pref.includes("Medium lessons") && course.moduleLength > 15 && course.moduleLength <= 30) {
        score += 5;
      }
      if (pref.includes("Long lessons") && course.moduleLength > 30) {
        score += 5;
      }
      if (pref.includes("Visual focus") && (course.contentType === "video" || course.contentType === "interactive")) {
        score += 5;
      }
      if (pref.includes("Text-based") && course.contentType === "text") {
        score += 5;
      }
      if (pref.includes("Interactive") && course.contentType === "interactive") {
        score += 5;
      }
      if (pref.includes("Gamified") && course.isGamified) {
        score += 5;
      }
      if (pref.includes("Self-paced") && course.isSelfPaced) {
        score += 5;
      }
      if (pref.includes("Clear objectives") && course.hasStructuredLayout) {
        score += 5;
      }
      if (pref.includes("Predictable structure") && course.hasStructuredLayout) {
        score += 5;
      }
    });

    // Accessibility needs match (bonus points)
    if (preferences.accessibilityNeeds) {
      preferences.accessibilityNeeds.forEach(need => {
        if (need.includes("Captions") && course.hasCaption) score += 5;
        if (need.includes("Transcripts") && course.hasTranscript) score += 5;
        if (need.includes("Dyslexia") && course.hasDyslexiaFont) score += 5;
        if (need.includes("High contrast") && course.hasStructuredLayout) score += 3;
      });
    }

    // Quality indicators (0-10 points)
    if (course.rating && course.rating >= 4) {
      score += 5;
    }
    if (course.enrollmentCount && course.enrollmentCount > 10000) {
      score += 5;
      reasons.push("Popular course with strong community");
    }

    // Cap score at 100
    score = Math.min(Math.round(score), 100);

    // Keep only top 3 reasons
    const topReasons = reasons.slice(0, 3);

    return { score, reasons: topReasons };
  }

  private getAccessibilityHighlights(course: Course): string[] {
    const highlights: string[] = [];

    if (course.hasCaption) highlights.push("Captions");
    if (course.hasTranscript) highlights.push("Transcripts");
    if (course.hasDyslexiaFont) highlights.push("Dyslexia-friendly fonts");
    if (course.hasStructuredLayout) highlights.push("Structured layout");
    if (course.hasProgressTracking) highlights.push("Progress tracking");
    if (course.isGamified) highlights.push("Gamified");
    if (course.isSelfPaced) highlights.push("Self-paced");

    return highlights;
  }
}

export const storage = new MemStorage();
