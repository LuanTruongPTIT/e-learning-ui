"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Filter, X } from "lucide-react";

interface ClassTableFiltersProps {
  filters: {
    department_id: string;
    program_id: string;
    academic_period: string;
  };
  onFilterChange: (filters: {
    department_id: string;
    program_id: string;
    academic_period: string;
  }) => void;
  departments: Array<{
    id: string;
    name: string;
  }>;
  programs: Array<{
    id: string;
    name: string;
    department_id: string;
  }>;
  academicPeriods: string[];
}

export function ClassTableFilters({
  filters,
  onFilterChange,
  departments,
  programs,
  academicPeriods,
}: ClassTableFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Get filtered programs based on selected department
  const filteredPrograms = filters.department_id
    ? programs.filter(
        (program) => program.department_id === filters.department_id
      )
    : programs;

  // Count active filters
  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  // Reset all filters
  const resetFilters = () => {
    onFilterChange({
      department_id: "",
      program_id: "",
      academic_period: "",
    });
  };

  // Handle department change
  const handleDepartmentChange = (value: string) => {
    onFilterChange({
      ...filters,
      department_id: value,
      program_id: "", // Reset program when department changes
    });
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="relative">
          <Filter className="mr-2 h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-2 rounded-full bg-primary text-primary-foreground text-xs px-2 py-0.5">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-4" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Filters</h4>
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs"
                onClick={resetFilters}
              >
                <X className="mr-1 h-3 w-3" />
                Reset
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Department</label>
            <Select
              value={filters.department_id}
              onValueChange={handleDepartmentChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Departments</SelectItem>
                {departments.map((department) => (
                  <SelectItem key={department.id} value={department.id}>
                    {department.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Program</label>
            <Select
              value={filters.program_id}
              onValueChange={(value) =>
                onFilterChange({ ...filters, program_id: value })
              }
              disabled={!filters.department_id || filteredPrograms.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Programs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Programs</SelectItem>
                {filteredPrograms.map((program) => (
                  <SelectItem key={program.id} value={program.id}>
                    {program.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Academic Period</label>
            <Select
              value={filters.academic_period}
              onValueChange={(value) =>
                onFilterChange({ ...filters, academic_period: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Academic Periods" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Academic Periods</SelectItem>
                {academicPeriods.map((period) => (
                  <SelectItem key={period} value={period}>
                    {period}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={() => setIsOpen(false)}>
              Apply Filters
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
