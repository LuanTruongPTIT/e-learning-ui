/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  PlusCircle,
  FileText,
  MoreVertical,
  Pencil,
  Trash2,
  Search,
  ArrowUpDown,
  Loader2,
  Calendar,
  Clock,
  BookOpen,
  Eye,
} from "lucide-react";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { TeachingPlan } from "@/types/course";

// Mock data for teaching plans if none provided
const mockTeachingPlans: TeachingPlan[] = [
  {
    id: "plan-1",
    title: "Introduction to Programming Concepts",
    description: "Overview of programming fundamentals and basic syntax",
    type: "Lecture",
    scheduledDate: new Date("2025-05-05"),
    duration: 90,
    status: "planned",
    materials: ["material-1", "material-2"],
    createdAt: new Date("2025-04-20"),
  },
  {
    id: "plan-2",
    title: "Variables and Data Types Workshop",
    description:
      "Hands-on practice with variables, data types, and basic operations",
    type: "Workshop",
    scheduledDate: new Date("2025-05-12"),
    duration: 120,
    status: "planned",
    materials: ["material-3"],
    createdAt: new Date("2025-04-22"),
  },
  {
    id: "plan-3",
    title: "Control Flow and Conditionals",
    description:
      "Understanding if/else statements, loops, and control structures",
    type: "Lecture",
    scheduledDate: new Date("2025-05-19"),
    duration: 90,
    status: "draft",
    materials: [],
    createdAt: new Date("2025-04-25"),
  },
];

interface TeachingPlansProps {
  courseId: string;
  teachingPlans?: TeachingPlan[];
  onTeachingPlansChange: (teachingPlans: TeachingPlan[]) => void;
}

export default function TeachingPlans({
  courseId,
  teachingPlans = mockTeachingPlans,
  onTeachingPlansChange,
}: TeachingPlansProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("scheduledDate");
  const [sortOrder, setSortOrder] = useState("asc");
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<TeachingPlan | null>(null);
  const [planForm, setPlanForm] = useState({
    title: "",
    description: "",
    type: "Lecture",
    scheduledDate: new Date(),
    duration: 90,
    status: "draft",
    materials: [] as string[],
  });

  // Filter and sort teaching plans
  const filteredPlans = teachingPlans
    .filter(
      (plan) =>
        plan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plan.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plan.type.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "scheduledDate") {
        return sortOrder === "asc"
          ? a.scheduledDate.getTime() - b.scheduledDate.getTime()
          : b.scheduledDate.getTime() - a.scheduledDate.getTime();
      } else if (sortBy === "title") {
        return sortOrder === "asc"
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else if (sortBy === "type") {
        return sortOrder === "asc"
          ? a.type.localeCompare(b.type)
          : b.type.localeCompare(a.type);
      }
      return 0;
    });

  const handleCreatePlan = async () => {
    if (!planForm.title) return;

    setIsCreating(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Add new teaching plan to the list
      const newPlan: TeachingPlan = {
        id: `plan-${Date.now()}`,
        title: planForm.title,
        description: planForm.description,
        type: planForm.type,
        scheduledDate: planForm.scheduledDate,
        duration: planForm.duration,
        status: planForm.status,
        materials: planForm.materials,
        createdAt: new Date(),
      };

      const updatedPlans = [...teachingPlans, newPlan];
      onTeachingPlansChange(updatedPlans);

      setShowCreateDialog(false);
      setPlanForm({
        title: "",
        description: "",
        type: "Lecture",
        scheduledDate: new Date(),
        duration: 90,
        status: "draft",
        materials: [],
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = (id: string) => {
    const updatedPlans = teachingPlans.filter((plan) => plan.id !== id);
    onTeachingPlansChange(updatedPlans);
  };

  const handleViewPlan = (plan: TeachingPlan) => {
    setSelectedPlan(plan);
    setShowViewDialog(true);
  };

  const handleEditPlan = (plan: TeachingPlan) => {
    setPlanForm({
      title: plan.title,
      description: plan.description,
      type: plan.type,
      scheduledDate: plan.scheduledDate,
      duration: plan.duration,
      status: plan.status,
      materials: plan.materials,
    });
    setSelectedPlan(plan);
    setShowCreateDialog(true);
  };

  const toggleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "planned":
        return "bg-blue-50 text-blue-700 hover:bg-blue-50";
      case "draft":
        return "bg-gray-50 text-gray-700 hover:bg-gray-50";
      case "completed":
        return "bg-green-50 text-green-700 hover:bg-green-50";
      default:
        return "bg-gray-50 text-gray-700 hover:bg-gray-50";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search teaching plans..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="scheduledDate">Scheduled Date</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="type">Type</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>

          <Button onClick={() => setShowCreateDialog(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Plan
          </Button>
        </div>
      </div>

      {filteredPlans.length > 0 ? (
        <div className="border rounded-md">
          <Table>
            <TableHeader className="bg-secondary/50">
              <TableRow className="hover:bg-secondary/50 border-none">
                <TableHead className="w-[35%]">
                  <Button
                    variant="ghost"
                    className="p-0 font-medium"
                    onClick={() => toggleSort("title")}
                  >
                    Title
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    className="p-0 font-medium"
                    onClick={() => toggleSort("type")}
                  >
                    Type
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    className="p-0 font-medium"
                    onClick={() => toggleSort("scheduledDate")}
                  >
                    Scheduled Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPlans.map((plan, index) => (
                <TableRow
                  key={plan.id}
                  className={
                    index % 2 === 0
                      ? "bg-white hover:bg-gray-50"
                      : "bg-secondary/30 hover:bg-secondary/50"
                  }
                >
                  <TableCell className="font-medium flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    {plan.title}
                  </TableCell>
                  <TableCell>{plan.type}</TableCell>
                  <TableCell>
                    {format(plan.scheduledDate, "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>{plan.duration} min</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${getStatusBadge(
                        plan.status
                      )}`}
                    >
                      {plan.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => handleViewPlan(plan)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => handleEditPlan(plan)}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer text-destructive focus:text-destructive"
                          onClick={() => handleDelete(plan.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center border rounded-md bg-muted/20">
          <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No teaching plans found</h3>
          <p className="text-muted-foreground mt-1 mb-4">
            {searchQuery
              ? "Try a different search term"
              : "Create your first teaching plan"}
          </p>
          {!searchQuery && (
            <Button onClick={() => setShowCreateDialog(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Teaching Plan
            </Button>
          )}
        </div>
      )}

      {/* Create/Edit Teaching Plan Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedPlan ? "Edit Teaching Plan" : "Create Teaching Plan"}
            </DialogTitle>
            <DialogDescription>
              {selectedPlan
                ? "Update the details of your teaching plan"
                : "Plan your lecture or workshop for this course"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter plan title"
                value={planForm.title}
                onChange={(e) =>
                  setPlanForm({ ...planForm, title: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter plan description"
                className="min-h-[100px]"
                value={planForm.description}
                onChange={(e) =>
                  setPlanForm({ ...planForm, description: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={planForm.type}
                  onValueChange={(value) =>
                    setPlanForm({ ...planForm, type: value })
                  }
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Lecture">Lecture</SelectItem>
                    <SelectItem value="Workshop">Workshop</SelectItem>
                    <SelectItem value="Lab">Lab</SelectItem>
                    <SelectItem value="Assessment">Assessment</SelectItem>
                    <SelectItem value="Discussion">Discussion</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={planForm.status}
                  onValueChange={(value) =>
                    setPlanForm({ ...planForm, status: value })
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="planned">Planned</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Scheduled Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !planForm.scheduledDate && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {planForm.scheduledDate ? (
                        format(planForm.scheduledDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={planForm.scheduledDate}
                      onSelect={(date) =>
                        date &&
                        setPlanForm({ ...planForm, scheduledDate: date })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="15"
                  step="15"
                  value={planForm.duration}
                  onChange={(e) =>
                    setPlanForm({
                      ...planForm,
                      duration: Number.parseInt(e.target.value) || 90,
                    })
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreatePlan}
              disabled={!planForm.title || isCreating}
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {selectedPlan ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>{selectedPlan ? "Update Plan" : "Create Plan"}</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Teaching Plan Dialog */}
      {selectedPlan && (
        <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{selectedPlan.title}</DialogTitle>
              <DialogDescription>Teaching plan details</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">
                  Description
                </h4>
                <p className="text-sm">{selectedPlan.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">
                    Type
                  </h4>
                  <p className="text-sm">{selectedPlan.type}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">
                    Status
                  </h4>
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${getStatusBadge(
                      selectedPlan.status
                    )}`}
                  >
                    {selectedPlan.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">
                    Scheduled Date
                  </h4>
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-1 text-primary" />
                    <span>{format(selectedPlan.scheduledDate, "PPP")}</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">
                    Duration
                  </h4>
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-1 text-primary" />
                    <span>{selectedPlan.duration} minutes</span>
                  </div>
                </div>
              </div>

              {selectedPlan.materials.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">
                    Linked Materials
                  </h4>
                  <ul className="text-sm space-y-1">
                    {selectedPlan.materials.map((materialId) => (
                      <li key={materialId} className="flex items-center">
                        <FileText className="h-4 w-4 mr-1 text-primary" />
                        <span>Material ID: {materialId}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">
                  Created
                </h4>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{format(selectedPlan.createdAt, "PPP")}</span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowViewDialog(false)}
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  setShowViewDialog(false);
                  handleEditPlan(selectedPlan);
                }}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit Plan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
