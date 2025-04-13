
import { Difficulty } from "@/types";
import { cn } from "@/lib/utils";

interface DifficultyBadgeProps {
  difficulty: Difficulty;
  className?: string;
}

const DifficultyBadge = ({ difficulty, className }: DifficultyBadgeProps) => {
  const colorMap = {
    easy: "bg-dsa-easy text-white",
    medium: "bg-dsa-medium text-white",
    hard: "bg-dsa-hard text-white"
  };

  return (
    <span 
      className={cn(
        "px-2 py-1 rounded-full text-xs font-medium capitalize", 
        colorMap[difficulty],
        className
      )}
    >
      {difficulty}
    </span>
  );
};

export default DifficultyBadge;
