
import { useState } from "react";
import { useProblems } from "@/context/ProblemContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Difficulty, Problem } from "@/types";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogClose } from "@/components/ui/dialog";
import { LinkIcon, LockIcon } from "lucide-react";
import { toast } from "sonner";

const problemSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  difficulty: z.enum(["easy", "medium", "hard"], { 
    required_error: "Please select a difficulty level." 
  }),
  category: z.string().min(1, { message: "Category is required." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  timeComplexity: z.string().optional(),
  spaceComplexity: z.string().optional(),
  link: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal('')),
  adminPassword: z.string().min(1, { message: "Admin password is required." }),
});

type ProblemFormValues = z.infer<typeof problemSchema>;

interface EditProblemFormProps {
  problem: Problem;
  onClose: () => void;
}

const EditProblemForm = ({ problem, onClose }: EditProblemFormProps) => {
  const { updateProblemDetails } = useProblems();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProblemFormValues>({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      title: problem.title,
      difficulty: problem.difficulty,
      category: problem.category,
      description: problem.description,
      timeComplexity: problem.timeComplexity || "",
      spaceComplexity: problem.spaceComplexity || "",
      link: problem.link || "",
      adminPassword: "",
    },
  });

  const onSubmit = async (data: ProblemFormValues) => {
    setIsSubmitting(true);
    
    try {
      const result = await updateProblemDetails(problem.id, {
        title: data.title,
        difficulty: data.difficulty,
        category: data.category,
        description: data.description,
        timeComplexity: data.timeComplexity || undefined,
        spaceComplexity: data.spaceComplexity || undefined,
        link: data.link || undefined,
      }, data.adminPassword);
      
      if (result.success) {
        toast.success("Problem updated successfully!");
        onClose();
      } else {
        toast.error(result.message || "Failed to update problem");
      }
    } catch (error) {
      console.error("Error updating problem:", error);
      toast.error("Error updating problem");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Problem Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter problem title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="difficulty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Difficulty</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Arrays, Linked Lists, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Problem Link (Optional)</FormLabel>
              <FormControl>
                <div className="flex items-center space-x-2">
                  <LinkIcon className="h-4 w-4 text-muted-foreground" />
                  <Input placeholder="https://leetcode.com/problems/..." {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Problem Description (Markdown supported)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe the problem. You can use markdown formatting." 
                  className="min-h-[200px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="timeComplexity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time Complexity (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. O(n)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="spaceComplexity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Space Complexity (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. O(n)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="adminPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <div className="flex items-center gap-1">
                  <LockIcon className="h-4 w-4" />
                  Admin Password
                </div>
              </FormLabel>
              <FormControl>
                <Input type="password" placeholder="Enter admin password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-2">
          <DialogClose asChild>
            <Button type="button" variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Problem"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditProblemForm;