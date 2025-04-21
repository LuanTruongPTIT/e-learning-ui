export interface ClassResponse {
  id: string; // Guid in C# maps to string in TypeScript
  class_name: string;
  department_id: string;
  department_name: string;
  program_id: string;
  program_name: string;
  academic_period: string;
  status: string;
  created_at: Date; // DateTime in C# maps to Date in TypeScript
}
