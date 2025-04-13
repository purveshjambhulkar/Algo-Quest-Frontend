
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle, KeyRound } from "lucide-react";
import AddProblemForm from "@/components/AddProblemForm";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const AddProblemDialog = () => {
  const [open, setOpen] = useState(false);
  const [showAdminAuth, setShowAdminAuth] = useState(true);
  const [adminPassword, setAdminPassword] = useState("");
  
  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "admin123";

  const handleAdminAuth = () => {
    if (adminPassword === ADMIN_PASSWORD) {
      setShowAdminAuth(false);
      toast.success("Admin access granted!");
    } else {
      toast.error("Incorrect admin password!");
    }
  };

  const handleClose = () => {
    setOpen(false);
    setShowAdminAuth(true);
    setAdminPassword("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Problem
        </Button>
      </DialogTrigger>
      
      {showAdminAuth ? (
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Admin Authentication</DialogTitle>
            <DialogDescription>
              Enter the admin password to add a new problem.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-password">Admin Password</Label>
              <div className="flex items-center space-x-2">
                <KeyRound className="h-4 w-4 text-muted-foreground" />
                <Input 
                  id="admin-password" 
                  type="password" 
                  placeholder="Enter admin password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAdminAuth()}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>Cancel</Button>
            <Button onClick={handleAdminAuth}>Continue</Button>
          </DialogFooter>
        </DialogContent>
      ) : (
        <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Problem</DialogTitle>
            <DialogDescription>
              Create a new DSA problem for practice. Fill out the form below with the problem details.
            </DialogDescription>
          </DialogHeader>
          <AddProblemForm onClose={handleClose} />
        </DialogContent>
      )}
    </Dialog>
  );
};

export default AddProblemDialog;