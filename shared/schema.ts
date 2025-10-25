import { pgTable, text, varchar, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Course schema with comprehensive accessibility metadata
export const courses = pgTable("courses", {
  id: varchar("id").primaryKey(),
  title: text("title").notNull(),
  platform: text("platform").notNull(),
  url: text("url").notNull(),
  description: text("description").notNull(),
  instructor: text("instructor"),
  duration: integer("duration").notNull(), // total duration in minutes
  moduleLength: integer("module_length").notNull(), // average module length in minutes
  contentType: text("content_type").notNull(), // video, text, interactive, mixed
  skillLevel: text("skill_level").notNull(), // beginner, intermediate, advanced
  hasCaption: boolean("has_caption").notNull().default(false),
  hasTranscript: boolean("has_transcript").notNull().default(false),
  hasDyslexiaFont: boolean("has_dyslexia_font").notNull().default(false),
  hasStructuredLayout: boolean("has_structured_layout").notNull().default(false),
  hasProgressTracking: boolean("has_progress_tracking").notNull().default(false),
  isGamified: boolean("is_gamified").notNull().default(false),
  isSelfPaced: boolean("is_self_paced").notNull().default(false),
  price: text("price").notNull(), // "Free", "$49", "Free with certification fee", etc.
  category: text("category").notNull(),
  tags: text("tags").array(),
  rating: integer("rating"), // 1-5 scale
  enrollmentCount: integer("enrollment_count"),
});

export const insertCourseSchema = createInsertSchema(courses);
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Course = typeof courses.$inferSelect;

// Neurotype options
export const neurotypes = [
  "ADHD",
  "Dyslexia", 
  "Autism",
  "Auditory Processing Disorder",
  "Multiple",
  "Other"
] as const;

export const neurotypesSchema = z.enum(neurotypes);
export type Neurotype = z.infer<typeof neurotypesSchema>;

// Learning preferences
export const learningPreferences = [
  "Short lessons (under 15 min)",
  "Medium lessons (15-30 min)",
  "Long lessons (30+ min)",
  "Visual focus (diagrams, videos)",
  "Text-based content",
  "Interactive exercises",
  "Predictable structure",
  "Self-paced learning",
  "Gamified experience",
  "Clear objectives",
  "Minimal distractions",
  "Community support",
  "Downloadable materials",
  "Mobile-friendly"
] as const;

export const learningPreferencesSchema = z.enum(learningPreferences);
export type LearningPreference = z.infer<typeof learningPreferencesSchema>;

// User preference schema (stored in memory)
export const userPreferenceSchema = z.object({
  neurotype: neurotypesSchema,
  learningPreferences: z.array(learningPreferencesSchema).min(1, "Select at least one learning preference"),
  topics: z.array(z.string()).min(1, "Enter at least one topic of interest"),
  accessibilityNeeds: z.array(z.enum([
    "Captions required",
    "Transcripts required", 
    "Dyslexia-friendly fonts",
    "High contrast visuals",
    "Screen reader compatible",
    "Keyboard navigation"
  ])).optional(),
});

export type UserPreference = z.infer<typeof userPreferenceSchema>;

// Match result with explanation
export interface MatchResult {
  course: Course;
  matchScore: number; // 0-100
  matchReasons: string[];
  accessibilityHighlights: string[];
}

// Neurotype profile definitions for matching algorithm
export interface NeurotypProfile {
  neurotype: Neurotype;
  preferredModuleLength: { min: number; max: number }; // in minutes
  preferredContentTypes: string[];
  requiredFeatures: (keyof Course)[];
  bonusFeatures: (keyof Course)[];
  description: string;
}
