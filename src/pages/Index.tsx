
import { useProblems } from "@/context/ProblemContext";
import StatsCard from "@/components/StatsCard";
import ProblemCard from "@/components/ProblemCard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Brain, Lightbulb, Target, Trophy, Loader2 } from "lucide-react";

const Index = () => {
  const { problems, userStats, loading } = useProblems();
  const navigate = useNavigate();
  
  // Get recently attempted problems (limit to 4)
  const recentProblems = [...problems]
    .filter(p => p.attempted && !p.completed)
    .slice(0, 4);
  
  // Get a random unfinished problem
  const getRandomProblem = () => {
    const unfinishedProblems = problems.filter(p => !p.completed);
    if (unfinishedProblems.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * unfinishedProblems.length);
    return unfinishedProblems[randomIndex];
  };
  
  const randomProblem = getRandomProblem();

  // Render loading state
  if (loading) {
    return (
      <div className="container py-8 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading data...</p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col items-center text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-4">
          AlgoQuest: Your DSA Practice Tracker
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Track your progress, practice algorithms, and improve your problem-solving skills.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard stats={userStats} />
        
        <div className="md:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
            {randomProblem ? (
              <div className="bg-card rounded-lg border shadow-sm p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center mb-4">
                    <Target className="mr-2 h-5 w-5 text-dsa-default" />
                    <h3 className="font-semibold">Practice Challenge</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Ready for a random problem to solve?
                  </p>
                  <p className="font-medium">{randomProblem.title}</p>
                </div>
                <Button 
                  className="mt-4 bg-dsa-default hover:bg-dsa-hover"
                  onClick={() => navigate(`/problem/${randomProblem.id}`)}
                >
                  Start Problem <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="bg-card rounded-lg border shadow-sm p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center mb-4">
                    <Trophy className="mr-2 h-5 w-5 text-dsa-easy" />
                    <h3 className="font-semibold">All Completed!</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Congratulations! You've completed all available problems.
                  </p>
                </div>
                <Button 
                  className="mt-4" 
                  variant="outline"
                  onClick={() => navigate('/problems')}
                >
                  View All Problems
                </Button>
              </div>
            )}
            
            <div className="bg-card rounded-lg border shadow-sm p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center mb-4">
                  <Lightbulb className="mr-2 h-5 w-5 text-dsa-medium" />
                  <h3 className="font-semibold">DSA Tip</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Consistent practice is key for mastering algorithms. Try to solve at least one problem daily to build your skills.
                </p>
              </div>
              <div className="flex items-center text-sm mt-4 text-muted-foreground">
                <Brain className="mr-2 h-4 w-4" />
                <span>Remember to analyze time and space complexity</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {recentProblems.length > 0 && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">In Progress Problems</h2>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/problems')}
              className="text-sm"
            >
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentProblems.map(problem => (
              <ProblemCard key={problem.id} problem={problem} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
