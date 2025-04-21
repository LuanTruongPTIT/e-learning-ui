"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

// import type { ClassData } from "@/lib/mock-data";
import CreateClassModal from "./create-class-modal";
import { ClassResponse } from "@/types/class";

interface CreateClassButtonProps {
  onClassCreated?: (newClass: ClassResponse) => void;
}

export default function CreateClassButton({
  onClassCreated,
}: CreateClassButtonProps) {
  const [open, setOpen] = useState(false);

  const handleClassCreated = (newClass: ClassResponse) => {
    if (onClassCreated) {
      onClassCreated(newClass);
    }
    setOpen(false);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} className="flex items-center gap-2">
        <PlusCircle className="h-4 w-4" />
        Create Class
      </Button>
      <CreateClassModal
        open={open}
        onOpenChange={setOpen}
        onClassCreated={handleClassCreated}
      />
    </>
  );
}
