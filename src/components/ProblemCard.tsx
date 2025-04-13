
import { Problem } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import DifficultyBadge from "./DifficultyBadge";
import { Check, Clock, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProblemCardProps {
  problem: Problem;
}

const ProblemCard = ({ problem }: ProblemCardProps) => {
  const navigate = useNavigate();
  
  return (
    <Card 
      onClick={() => navigate(`/problem/${problem.id}`)}
      className="cursor-pointer transform transition-transform hover:scale-[1.02] hover:shadow-md"
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">
            {problem.title}
            {problem.link && (
              <ExternalLink size={14} className="inline-flex ml-1 text-muted-foreground" />
            )}
          </CardTitle>
          <DifficultyBadge difficulty={problem.difficulty} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
          Category: {problem.category}
        </div>
      </CardContent>
      <CardFooter className="pt-1 flex justify-between items-center">
        <div className="flex items-center space-x-2 text-sm">
          {problem.completed ? (
            <span className="flex items-center text-dsa-easy">
              <Check size={14} className="mr-1" />
              Solved
            </span>
          ) : problem.attempted ? (
            <span className="flex items-center text-dsa-medium">
              <Clock size={14} className="mr-1" />
              Attempted
            </span>
          ) : (
            <span className="text-muted-foreground">Not attempted</span>
          )}
        </div>
        {problem.timeComplexity && (
          <div className="text-xs text-muted-foreground">
            Time: {problem.timeComplexity}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProblemCard;