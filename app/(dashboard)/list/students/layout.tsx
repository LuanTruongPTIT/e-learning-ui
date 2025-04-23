import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Students Management",
  description: "Manage students in the e-learning system",
};

export default function StudentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
