
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProblems } from "@/context/ProblemContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { BookOpen, Play, Check, X } from "lucide-react";

const PracticeCustomizer = () => {
  const { problems } = useProblems();
  const navigate = useNavigate();
  
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [numQuestions, setNumQuestions] = useState<number>(5);
  const [filteredProblemIds, setFilteredProblemIds] = useState<string[]>([]);

  useEffect(() => {
    // Extract unique categories
    const uniqueCategories = Array.from(new Set(problems.map(p => p.category)));
    setCategories(uniqueCategories);
  }, [problems]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  const startPractice = () => {
    if (selectedCategories.length === 0) {
      toast.error("Please select at least one topic to practice");
      return;
    }

    // Filter problems by selected categories
    const eligibleProblems = problems.filter(p => selectedCategories.includes(p.category));
    
    if (eligibleProblems.length === 0) {
      toast.error("No problems available for the selected topics");
      return;
    }

    // Randomly select problems up to numQuestions or max available
    const shuffled = [...eligibleProblems].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(numQuestions, shuffled.length));
    
    // Store the selected problem IDs
    const selectedIds = selected.map(p => p.id);
    setFilteredProblemIds(selectedIds);
    
    // Store in session storage for persistence during practice
    sessionStorage.setItem('practiceProblems', JSON.stringify(selectedIds));
    
    toast.success(`Starting practice with ${selectedIds.length} problems`);
    navigate('/practice-session');
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center">
          <BookOpen className="mr-2 h-5 w-5" />
          Customize Your Practice
        </CardTitle>
        <CardDescription>
          Select topics and number of questions to practice
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="topics">Topics</Label>
          <ScrollArea className="h-[200px] mt-2 border rounded-md p-4">
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <Badge
                  key={category}
                  variant={selectedCategories.includes(category) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleCategory(category)}
                >
                  {selectedCategories.includes(category) ? (
                    <Check className="mr-1 h-3 w-3" />
                  ) : null}
                  {category}
                </Badge>
              ))}
              {categories.length === 0 && (
                <p className="text-muted-foreground text-sm">No topics available yet</p>
              )}
            </div>
          </ScrollArea>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="num-questions">Number of Questions</Label>
            <Badge variant="outline">{numQuestions}</Badge>
          </div>
          <Input
            id="num-questions"
            type="range"
            min="1"
            max={Math.max(10, Math.min(20, problems.length))}
            value={numQuestions}
            onChange={(e) => setNumQuestions(parseInt(e.target.value))}
            className="cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1</span>
            <span>{Math.max(10, Math.min(20, problems.length))}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => {
          setSelectedCategories([]);
          setNumQuestions(5);
        }}>
          <X className="mr-2 h-4 w-4" />
          Reset
        </Button>
        <Button onClick={startPractice}>
          <Play className="mr-2 h-4 w-4" />
          Start Practice
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PracticeCustomizer;