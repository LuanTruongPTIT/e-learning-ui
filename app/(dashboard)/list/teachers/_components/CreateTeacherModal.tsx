"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CreateTeacherForm from "./CreateTeacherForm";

interface CreateTeacherModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateTeacherModal({
  open,
  onOpenChange,
}: CreateTeacherModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Create New Teacher
          </DialogTitle>
        </DialogHeader>
        <CreateTeacherForm onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
