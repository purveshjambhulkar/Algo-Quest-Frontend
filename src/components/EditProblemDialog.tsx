
import React, { useState } from "react";
import { Problem } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PencilIcon } from "lucide-react";
import EditProblemForm from "./EditProblemForm";

interface EditProblemDialogProps {
  problem: Problem;
}

const EditProblemDialog = ({ problem }: EditProblemDialogProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <PencilIcon className="h-4 w-4" /> Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Problem</DialogTitle>
          <DialogDescription>
            Make changes to the problem details. Click update when you're done.
          </DialogDescription>
        </DialogHeader>
        <EditProblemForm problem={problem} onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default EditProblemDialog;