
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProblems } from "@/context/ProblemContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import DifficultyBadge from "@/components/DifficultyBadge";
import { Problem } from "@/types";
import { ChevronLeft, ChevronRight, CheckCircle, XCircle, Clock } from "lucide-react";
import { toast } from "sonner";

const PracticeSession = () => {
  const navigate = useNavigate();
  const { problems, markProblemAsCompleted, markProblemAsAttempted } = useProblems();
  
  const [practiceProblems, setPracticeProblems] = useState<Problem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadPracticeSession = () => {
      const storedIds = sessionStorage.getItem('practiceProblems');
      if (!storedIds) {
        toast.error("No practice session found");
        navigate('/problems');
        return;
      }
      
      try {
        const ids = JSON.parse(storedIds) as string[];
        const selectedProblems = ids
          .map(id => problems.find(p => p.id === id))
          .filter((p): p is Problem => p !== undefined);
        
        if (selectedProblems.length === 0) {
          toast.error("No problems found for practice");
          navigate('/problems');
          return;
        }
        
        setPracticeProblems(selectedProblems);
      } catch (error) {
        console.error("Error loading practice session:", error);
        toast.error("Error loading practice session");
        navigate('/problems');
      } finally {
        setLoading(false);
      }
    };
    
    loadPracticeSession();
  }, [problems, navigate]);
  
  const currentProblem = practiceProblems[currentIndex];
  
  const handleNext = () => {
    if (currentIndex < practiceProblems.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // End of practice session
      toast.success("Practice session completed!");
      sessionStorage.removeItem('practiceProblems');
      navigate('/problems');
    }
  };
  
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };
  
  const handleMarkCompleted = async () => {
    if (currentProblem) {
      await markProblemAsCompleted(currentProblem.id);
      toast.success("Problem marked as completed!");
      handleNext();
    }
  };
  
  const handleMarkAttempted = async () => {
    if (currentProblem) {
      await markProblemAsAttempted(currentProblem.id);
      toast.info("Problem marked as attempted!");
      handleNext();
    }
  };

  const handleOpenProblemLink = () => {
    if (currentProblem.link) {
      window.open(currentProblem.link, '_blank', 'noopener,noreferrer');
    }
  };
  
  if (loading) {
    return (
      <div className="container py-8 flex flex-col items-center justify-center min-h-[60vh]">
        <Clock className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading practice session...</p>
      </div>
    );
  }
  
  if (!currentProblem) {
    return (
      <div className="container py-8 flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">No problems available for practice.</p>
        <Button onClick={() => navigate('/problems')} className="mt-4">Back to Problems</Button>
      </div>
    );
  }
  
  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/problems')}>
            <ChevronLeft className="mr-1 h-4 w-4" />
            Exit Practice
          </Button>
          <p className="text-muted-foreground">
            Problem {currentIndex + 1} of {practiceProblems.length}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleNext}
            disabled={currentIndex === practiceProblems.length - 1}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle>{currentProblem.title}</CardTitle>
            <DifficultyBadge difficulty={currentProblem.difficulty} />
          </div>
          <div className="text-sm text-muted-foreground">
            Category: {currentProblem.category}
          </div>
          {currentProblem.link && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenProblemLink}
              className="ml-2"
            >
              <ExternalLink className="h-4 w-4 mr-2" /> Open Problem
            </Button>
          )}
        </CardHeader>
        
        <CardContent className="prose prose-sm dark:prose-invert max-w-none">
          <MarkdownRenderer content={currentProblem.description} />
          
          {currentProblem.timeComplexity && (
            <div className="text-sm pt-4">
              <strong>Expected Time Complexity:</strong> {currentProblem.timeComplexity}
            </div>
          )}
          
          {currentProblem.spaceComplexity && (
            <div className="text-sm">
              <strong>Expected Space Complexity:</strong> {currentProblem.spaceComplexity}
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between pt-4 border-t">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleMarkAttempted}
              disabled={currentProblem.attempted || currentProblem.completed}
            >
              <Clock className="mr-1 h-4 w-4" />
              Mark as Attempted
            </Button>
            
            <Button 
              variant="default" 
              size="sm"
              onClick={handleMarkCompleted}
              disabled={currentProblem.completed}
            >
              <CheckCircle className="mr-1 h-4 w-4" />
              Mark as Completed
            </Button>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleNext}
          >
            {currentIndex === practiceProblems.length - 1 ? 'Finish Practice' : 'Skip'}
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PracticeSession;
