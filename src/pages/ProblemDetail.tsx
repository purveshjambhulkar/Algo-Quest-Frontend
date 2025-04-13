
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProblems } from '@/context/ProblemContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import DifficultyBadge from '@/components/DifficultyBadge';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { ArrowLeft, CheckCircle, Clock, Trash2, Loader2, ExternalLink } from 'lucide-react';
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import EditProblemDialog from '@/components/EditProblemDialog';

const ProblemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProblemById, markProblemAsCompleted, markProblemAsAttempted, resetProblemStatus, deleteProblem, loading } = useProblems();
  const [solution, setSolution] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  
  const problem = getProblemById(id || '');
  
  if (loading) {
    return (
      <div className="container py-8 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading problem...</p>
      </div>
    );
  }
  
  if (!problem) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Problem not found</h1>
        <Button onClick={() => navigate('/problems')}>Back to Problems</Button>
      </div>
    );
  }

  const handleSubmitSolution = () => {
    if (solution.trim().length === 0) {
      toast.error("Please enter your solution before submitting");
      return;
    }
    
    markProblemAsCompleted(problem.id);
    toast.success("Solution submitted successfully!");
  };

  const handleMarkAsAttempted = () => {
    markProblemAsAttempted(problem.id);
  };

  const handleResetStatus = () => {
    resetProblemStatus(problem.id);
  };

  const handleOpenProblemLink = () => {
    if (problem.link) {
      window.open(problem.link, '_blank', 'noopener,noreferrer');
    }
  };

  const handleDeleteProblem = async () => {
    if (!adminPassword) {
      toast.error("Admin password is required");
      return;
    }

    const result = await deleteProblem(problem.id, adminPassword);
    if (result.success) {
      toast.success("Problem deleted successfully");
      navigate('/problems');
    } else {
      toast.error(result.message || "Failed to delete problem");
    }
    setDeleteDialogOpen(false);
    setAdminPassword('');
  };

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="mb-2"
            onClick={() => navigate('/problems')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to problems
          </Button>
          <h1 className="text-2xl font-bold">{problem.title}</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <DifficultyBadge difficulty={problem.difficulty} />
          <span className="text-sm text-muted-foreground ml-2">
            Category: {problem.category}
          </span>
          {problem.link && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenProblemLink}
              className="ml-2"
            >
              <ExternalLink className="h-4 w-4 mr-2" /> Open Problem
            </Button>
          )}
          <EditProblemDialog problem={problem} />
        </div>
      </div>
      
      <Tabs defaultValue="description" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="description">Problem Description</TabsTrigger>
          <TabsTrigger value="solution">Your Solution</TabsTrigger>
        </TabsList>
        
        <TabsContent value="description" className="mt-4">
          <div className="bg-card rounded-lg border p-4 md:p-6">
            <MarkdownRenderer content={problem.description} />
            
            <div className="mt-6">
              <Button onClick={() => setActiveTab('solution')} className="bg-dsa-default hover:bg-dsa-hover">
                Solve This Problem
              </Button>
              {problem.link && (
                <Button
                  variant="outline"
                  onClick={handleOpenProblemLink}
                  className="ml-4"
                >
                  <ExternalLink className="h-4 w-4 mr-2" /> Open Original Problem
                </Button>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="solution" className="mt-4">
          <div className="bg-card rounded-lg border p-4 md:p-6">
            <h3 className="text-lg font-semibold mb-4">Your Solution</h3>
            
            <Textarea
              placeholder="Write your solution here..."
              className="min-h-[300px] font-mono text-sm"
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
            />
            
            <div className="mt-6 flex flex-wrap gap-4">
              <Button 
                onClick={handleSubmitSolution} 
                className="bg-dsa-easy hover:bg-dsa-easy/90"
                disabled={problem.completed}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {problem.completed ? "Already Completed" : "Mark as Completed"}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleMarkAsAttempted}
                disabled={problem.attempted}
              >
                <Clock className="h-4 w-4 mr-2" />
                Mark as Attempted
              </Button>
              
              {(problem.completed || problem.attempted) && (
                <Button 
                  variant="ghost" 
                  onClick={handleResetStatus}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Reset Status
                </Button>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {problem.timeComplexity && problem.spaceComplexity && (
        <div className="mt-6 bg-muted p-4 rounded-lg">
          <h3 className="text-sm font-medium mb-2">Complexity Analysis</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-muted-foreground">Time Complexity:</span>
              <span className="text-sm font-mono ml-2">{problem.timeComplexity}</span>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Space Complexity:</span>
              <span className="text-sm font-mono ml-2">{problem.spaceComplexity}</span>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 flex justify-end">
        <Button 
          variant="destructive" 
          onClick={() => setDeleteDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <Trash2 className="h-4 w-4" /> Delete Problem
        </Button>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this problem?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the problem from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium mb-2 block">
              Enter admin password to confirm:
            </label>
            <Input
              type="password"
              placeholder="Admin password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="mt-1"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAdminPassword('')}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteProblem}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProblemDetail;