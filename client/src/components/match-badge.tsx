import { Sparkles } from "lucide-react";

interface MatchBadgeProps {
  score: number;
  reason?: string;
}

export function MatchBadge({ score, reason }: MatchBadgeProps) {
  const getColor = () => {
    if (score >= 90) return "bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400";
    if (score >= 75) return "bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400";
    if (score >= 60) return "bg-yellow-500/10 text-yellow-700 border-yellow-500/20 dark:text-yellow-400";
    return "bg-gray-500/10 text-gray-700 border-gray-500/20 dark:text-gray-400";
  };

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium ${getColor()}`}>
      <Sparkles className="w-4 h-4" />
      <span className="font-semibold">{score}% Match</span>
      {reason && (
        <>
          <span className="opacity-50">•</span>
          <span className="hidden sm:inline">{reason}</span>
        </>
      )}
    </div>
  );
}
