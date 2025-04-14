"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import React from "react";
import CreateTeacherModal from "./CreateTeacherModal";

export default function CreateTeacherButton() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)} className="cursor-pointer">
        <PlusCircle className="mr-2 h-4 w-4" />
        Create Teacher
      </Button>
      <CreateTeacherModal open={open} onOpenChange={setOpen} />
    </>
  );
}
