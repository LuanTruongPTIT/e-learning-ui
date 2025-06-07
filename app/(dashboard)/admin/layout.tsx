"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  UserCheck,
  BookOpen,
  BarChart3,
  Menu,
  X,
  School,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: BarChart3 },
  { name: "Quản lý Sinh viên", href: "/admin/students", icon: Users },
  { name: "Quản lý Giáo viên", href: "/admin/teachers", icon: UserCheck },
  { name: "Quản lý Lớp học", href: "/admin/courses", icon: BookOpen },
  { name: "Thống kê", href: "/admin/statistics", icon: BarChart3 },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    // <div className="h-screen bg-gray-50">
    //   {/* Mobile sidebar */}
    //   <div
    //     className={`fixed inset-0 z-40 lg:hidden ${
    //       sidebarOpen ? "" : "hidden"
    //     }`}
    //   >
    //     <div
    //       className="fixed inset-0 bg-gray-600 bg-opacity-75"
    //       onClick={() => setSidebarOpen(false)}
    //     />
    //     <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white">
    //       <div className="absolute top-0 right-0 -mr-12 pt-2">
    //         <button
    //           type="button"
    //           className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
    //           onClick={() => setSidebarOpen(false)}
    //         >
    //           <X className="h-6 w-6 text-white" />
    //         </button>
    //       </div>
    //       <div className="flex-shrink-0 flex items-center px-4">
    //         <School className="h-8 w-8 text-blue-600" />
    //         <span className="ml-2 text-xl font-bold text-gray-900">
    //           E-Learning Admin
    //         </span>
    //       </div>
    //       <div className="mt-5 flex-1 h-0 overflow-y-auto">
    //         <nav className="px-2 space-y-1">
    //           {navigation.map((item) => {
    //             const isActive = pathname === item.href;
    //             return (
    //               <Link
    //                 key={item.name}
    //                 href={item.href}
    //                 className={`${
    //                   isActive
    //                     ? "bg-blue-100 text-blue-900"
    //                     : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
    //                 } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
    //               >
    //                 <item.icon
    //                   className={`${
    //                     isActive ? "text-blue-500" : "text-gray-400"
    //                   } mr-4 h-6 w-6`}
    //                 />
    //                 {item.name}
    //               </Link>
    //             );
    //           })}
    //         </nav>
    //       </div>
    //     </div>
    //   </div>

    //   {/* Desktop sidebar */}
    //   <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
    //     <div className="flex flex-col flex-grow bg-white pt-5 pb-4 overflow-y-auto border-r border-gray-200">
    //       <div className="flex items-center flex-shrink-0 px-4">
    //         <School className="h-8 w-8 text-blue-600" />
    //         <span className="ml-2 text-xl font-bold text-gray-900">
    //           E-Learning Admin
    //         </span>
    //       </div>
    //       <div className="mt-5 flex-grow flex flex-col">
    //         <nav className="flex-1 px-2 space-y-1">
    //           {navigation.map((item) => {
    //             const isActive = pathname === item.href;
    //             return (
    //               <Link
    //                 key={item.name}
    //                 href={item.href}
    //                 className={`${
    //                   isActive
    //                     ? "bg-blue-100 text-blue-900"
    //                     : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
    //                 } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
    //               >
    //                 <item.icon
    //                   className={`${
    //                     isActive ? "text-blue-500" : "text-gray-400"
    //                   } mr-3 h-6 w-6`}
    //                 />
    //                 {item.name}
    //               </Link>
    //             );
    //           })}
    //         </nav>
    //       </div>
    //     </div>
    //   </div>

    //   {/* Main content */}
    //   <div className="lg:pl-64 flex flex-col flex-1">
    //     <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow lg:hidden">
    //       <button
    //         type="button"
    //         className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
    //         onClick={() => setSidebarOpen(true)}
    //       >
    //         <Menu className="h-6 w-6" />
    //       </button>
    //       <div className="flex-1 px-4 flex justify-between">
    //         <div className="flex-1 flex">
    //           <h1 className="ml-3 text-lg font-medium text-gray-900 self-center">
    //             Admin Dashboard
    //           </h1>
    //         </div>
    //       </div>
    //     </div>

    <main className="flex-1 overflow-y-auto">
      <div className="py-6">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
      </div>
    </main>
    //   </div>
    // </div>
  );
}
