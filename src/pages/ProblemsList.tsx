
import { useState } from 'react';
import { useProblems } from '@/context/ProblemContext';
import ProblemCard from '@/components/ProblemCard';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, SlidersHorizontal, Loader2 } from 'lucide-react';
import CategoryFilter from '@/components/CategoryFilter';
import PracticeCustomizer from '@/components/PracticeCustomizer';
import { Difficulty } from '@/types';
import AddProblemDialog from '@/components/AddProblemDialog';

const ProblemsList = () => {
  const { problems, loading } = useProblems();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'browse' | 'practice'>('browse');

  // Apply all filters
  const filteredProblems = problems.filter(problem => {
    // Search filter
    const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         problem.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status filter
    const matchesStatus = 
      statusFilter === 'all' ? true :
      statusFilter === 'completed' ? problem.completed :
      statusFilter === 'attempted' ? (problem.attempted && !problem.completed) :
      !problem.attempted;
    
    // Difficulty filter
    const matchesDifficulty = difficultyFilter === 'all' || problem.difficulty === difficultyFilter;
    
    // Category filter
    const matchesCategory = !selectedCategory || problem.category === selectedCategory;
    
    return matchesSearch && matchesStatus && matchesDifficulty && matchesCategory;
  });

  // Render loading state
  if (loading) {
    return (
      <div className="container py-8 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading problems...</p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Problems Library</h1>
        <AddProblemDialog />
      </div>
      
      <Tabs defaultValue="browse" className="w-full" onValueChange={(value) => setActiveTab(value as 'browse' | 'practice')}>
        <TabsList className="mb-4">
          <TabsTrigger value="browse">Browse Problems</TabsTrigger>
          <TabsTrigger value="practice">Practice Session</TabsTrigger>
        </TabsList>
        
        <TabsContent value="browse" className="space-y-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search problems by title or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
            <Tabs defaultValue="all" className="w-full sm:w-auto" onValueChange={setStatusFilter}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="completed">Solved</TabsTrigger>
                <TabsTrigger value="attempted">In Progress</TabsTrigger>
                <TabsTrigger value="unsolved">Unsolved</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              <Select defaultValue="all" onValueChange={(value) => setDifficultyFilter(value as Difficulty | 'all')}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <CategoryFilter 
            problems={problems} 
            selectedCategory={selectedCategory} 
            setSelectedCategory={setSelectedCategory} 
          />
          
          {filteredProblems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {filteredProblems.map(problem => (
                <ProblemCard key={problem.id} problem={problem} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No problems match your current filters.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="practice">
          <div className="flex justify-center">
            <div className="max-w-2xl w-full">
              <PracticeCustomizer />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProblemsList;