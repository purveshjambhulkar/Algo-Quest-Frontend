
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserStats } from "@/types";
import { CircleDashed, CircleCheck, Trophy, Flame } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useProblems } from "@/context/ProblemContext";

interface StatsCardProps {
  stats: UserStats;
}

const StatsCard = ({ stats }: StatsCardProps) => {
  const { problems } = useProblems();
  
  // Get total number of problems dynamically
  const totalProblems = problems.length;
  const progressPercentage = totalProblems > 0 ? (stats.totalSolved / totalProblems) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Your Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <CircleCheck className="mr-2 h-5 w-5 text-dsa-easy" />
            <span>Problems Solved</span>
          </div>
          <span className="font-semibold">{stats.totalSolved}/{totalProblems}</span>
        </div>
        
        <Progress value={progressPercentage} className="h-2" />
        
        <div className="grid grid-cols-3 gap-4 pt-2">
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Easy</div>
            <div className="text-xl font-semibold text-dsa-easy">{stats.easy}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Medium</div>
            <div className="text-xl font-semibold text-dsa-medium">{stats.medium}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Hard</div>
            <div className="text-xl font-semibold text-dsa-hard">{stats.hard}</div>
          </div>
        </div>
        
        <div className="pt-2 flex justify-between items-center">
          <div className="flex items-center">
            <Flame className="mr-2 h-5 w-5 text-dsa-medium" />
            <span>Current Streak</span>
          </div>
          <span className="font-semibold">{stats.streak} days</span>
        </div>
        
        {stats.lastPracticed && (
          <div className="pt-1 text-xs text-muted-foreground text-right">
            Last practiced: {new Date(stats.lastPracticed).toLocaleDateString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
