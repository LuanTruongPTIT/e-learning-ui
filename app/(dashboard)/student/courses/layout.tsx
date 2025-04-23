import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Courses",
  description: "View and manage your enrolled courses",
};

export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
