
import { Link } from 'react-router-dom';
import { useProblems } from '@/context/ProblemContext';
import { cn } from '@/lib/utils';
import { Code2, ListChecks } from 'lucide-react';
import { Button } from './ui/button';

const Navbar = () => {
  const { userStats } = useProblems();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex items-center gap-2 mr-4">
          <Code2 className="h-6 w-6 text-dsa-default" />
          <Link to="/" className="font-bold text-xl">AlgoQuest</Link>
        </div>
        
        <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
          <Link 
            to="/" 
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              window.location.pathname === "/" ? "text-primary" : "text-muted-foreground"
            )}
          >
            Dashboard
          </Link>
          <Link 
            to="/problems" 
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              window.location.pathname.includes("/problem") ? "text-primary" : "text-muted-foreground"
            )}
          >
            Problems
          </Link>
        </nav>
        
        <div className="flex-1" />
        
        <div className="flex items-center gap-2">
          <div className="hidden md:flex text-sm">
            <p className="font-medium">Streak: <span className="text-dsa-default">{userStats.streak}</span> days</p>
            <span className="mx-2 text-muted-foreground">|</span>
            <p className="font-medium">Solved: <span className="text-dsa-default">{userStats.totalSolved}</span> problems</p>
          </div>
          
          <Button variant="outline" size="sm" className="ml-4" asChild>
            <Link to="/problems">
              <ListChecks className="h-4 w-4 mr-2" />
              Practice Now
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
