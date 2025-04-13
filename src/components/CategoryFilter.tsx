
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Problem } from "@/types";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface CategoryFilterProps {
  problems: Problem[];
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
}

const CategoryFilter = ({ 
  problems, 
  selectedCategory, 
  setSelectedCategory 
}: CategoryFilterProps) => {
  // Extract unique categories
  const categories = Array.from(new Set(problems.map(p => p.category)));

  return (
    <div className="flex flex-wrap gap-2 my-4">
      {categories.map(category => (
        <Badge
          key={category}
          variant="outline"
          className={cn(
            "cursor-pointer px-3 py-1 hover:bg-secondary transition-colors",
            selectedCategory === category && "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
          onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
        >
          {category}
        </Badge>
      ))}
      
      {selectedCategory && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setSelectedCategory(null)}
          className="h-8 px-2 text-xs"
        >
          Clear filter <X className="ml-1 h-3 w-3" />
        </Button>
      )}
    </div>
  );
};

export default CategoryFilter;
