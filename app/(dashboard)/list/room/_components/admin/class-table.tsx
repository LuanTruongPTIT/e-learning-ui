"use client";

import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MoreHorizontal, Search, ChevronDown, ChevronUp } from "lucide-react";
import { ClassResponse } from "@/types/class";
import { ClassTableFilters } from "./class-table-filters";
import { ClassTablePagination } from "./class-table-pagination";

interface ClassTableProps {
  classes: ClassResponse[];
  onClassUpdate: (updatedClass: ClassResponse) => void;
}

const extractDepartments = (classes: ClassResponse[]) => {
  const uniqueDepartments = Array.from(
    new Set(classes.map((cls) => cls.department_id))
  ).map((id) => ({
    id: id,
    name:
      classes.find((cls) => cls.department_id === id)?.department_name || "",
  }));
  return uniqueDepartments;
};

const extractPrograms = (classes: ClassResponse[]) => {
  const uniquePrograms = Array.from(
    new Set(classes.map((cls) => cls.program_id))
  ).map((id) => ({
    id: id,
    name: classes.find((cls) => cls.program_id === id)?.program_name || "",
    department_id:
      classes.find((cls) => cls.program_id === id)?.department_id || "",
  }));
  return uniquePrograms;
};

const extractAcademicPeriods = (classes: ClassResponse[]) => {
  return Array.from(new Set(classes.map((cls) => cls.academic_period)));
};

export default function ClassTable({
  classes,
  onClassUpdate,
}: ClassTableProps) {
  const [filteredClasses, setFilteredClasses] =
    useState<ClassResponse[]>(classes);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    department_id: "",
    program_id: "",
    academic_period: "",
  });
  const [sortConfig, setSortConfig] = useState<{
    key: keyof ClassResponse | null;
    direction: "ascending" | "descending";
  }>({
    key: null,
    direction: "ascending",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Apply filters and search
  const applyFilters = () => {
    let result = [...classes];

    // Apply search
    if (searchQuery) {
      result = result.filter((cls) =>
        cls.class_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply filters
    if (filters.department_id) {
      result = result.filter(
        (cls) => cls.department_id === filters.department_id
      );
    }
    if (filters.program_id) {
      result = result.filter((cls) => cls.program_id === filters.program_id);
    }
    if (filters.academic_period) {
      result = result.filter(
        (cls) => cls.academic_period === filters.academic_period
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof ClassResponse];
        const bValue = b[sortConfig.key as keyof ClassResponse];

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredClasses(result);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setTimeout(applyFilters, 300);
  };

  // Handle filter change
  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setTimeout(applyFilters, 300);
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredClasses.length / pageSize);
  const paginatedClasses = filteredClasses.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Handle sorting
  const handleSort = (key: keyof ClassResponse) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "ascending"
          ? "descending"
          : "ascending",
    }));
    setTimeout(applyFilters, 300);
  };

  // Render sort indicator
  const renderSortIndicator = (key: keyof ClassResponse) => {
    if (sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === "ascending" ? (
      <ChevronUp className="ml-1 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-1 h-4 w-4" />
    );
  };

  // Toggle class status
  const toggleClassStatus = (classId: string) => {
    const classToUpdate = classes.find((cls) => cls.id === classId);
    if (classToUpdate) {
      const updatedClass = {
        ...classToUpdate,
        status: classToUpdate.status === "active" ? "inactive" : "active",
      };
      onClassUpdate(updatedClass);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by class name..."
            className="pl-8"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <ClassTableFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          departments={extractDepartments(classes)}
          programs={extractPrograms(classes)}
          academicPeriods={extractAcademicPeriods(classes)}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">
                <Button
                  variant="ghost"
                  className="p-0 font-medium flex items-center"
                  onClick={() => handleSort("class_name")}
                >
                  Class Name
                  {renderSortIndicator("class_name")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className="p-0 font-medium flex items-center"
                  onClick={() => handleSort("department_name")}
                >
                  Department
                  {renderSortIndicator("department_name")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className="p-0 font-medium flex items-center"
                  onClick={() => handleSort("program_name")}
                >
                  Program
                  {renderSortIndicator("program_name")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className="p-0 font-medium flex items-center"
                  onClick={() => handleSort("academic_period")}
                >
                  Academic Period
                  {renderSortIndicator("academic_period")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className="p-0 font-medium flex items-center"
                  onClick={() => handleSort("status")}
                >
                  Status
                  {renderSortIndicator("status")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className="p-0 font-medium flex items-center"
                  onClick={() => handleSort("created_at")}
                >
                  Created At
                  {renderSortIndicator("created_at")}
                </Button>
              </TableHead>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedClasses.map((classItem) => (
              <TableRow key={classItem.id}>
                <TableCell>{classItem.class_name}</TableCell>
                <TableCell>{classItem.department_name}</TableCell>
                <TableCell>{classItem.program_name}</TableCell>
                <TableCell>{classItem.academic_period}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      classItem.status === "active" ? "default" : "destructive"
                    }
                  >
                    {classItem.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(classItem.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => toggleClassStatus(classItem.id)}
                      >
                        Toggle Status
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ClassTablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        totalItems={filteredClasses.length}
      />
    </div>
  );
}
