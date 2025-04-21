"use client";
import Image from "next/image";
import Link from "next/link";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useState } from "react";
const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/home.png",
        label: "Home",
        href: "/",
        visible: ["Administrator", "Teacher", "student", "parent"],
      },
      {
        icon: "/teacher.png",
        label: "Teachers",
        href: "/list/teachers",
        visible: ["Administrator"],
      },
      {
        icon: "/student.png",
        label: "Students",
        href: "/list/students",
        visible: ["Administrator", "Teacher"],
      },
      {
        icon: "/subject.png",
        label: "Subjects",
        href: "/list/subjects",
        visible: ["Administrator"],
      },
      {
        icon: "/class.png",
        label: "Classes",
        href: "/list/room",
        visible: ["Administrator", "Teacher"],
      },
      {
        icon: "/lesson.png",
        label: "Courses",
        href: "/teacher/courses",
        visible: ["Teacher"],
      },
      {
        icon: "/exam.png",
        label: "Exams",
        href: "/list/exams",
        visible: ["Administrator", "Teacher", "student", "parent"],
      },
      {
        icon: "/assignment.png",
        label: "Assignments",
        href: "/list/assignments",
        visible: ["Administrator", "Teacher", "student", "parent"],
      },
      {
        icon: "/result.png",
        label: "Results",
        href: "/list/results",
        visible: ["Administrator", "Teacher", "student", "parent"],
      },
      {
        icon: "/attendance.png",
        label: "Attendance",
        href: "/list/attendance",
        visible: ["Administrator", "Teacher", "student", "parent"],
      },
      {
        icon: "/calendar.png",
        label: "Events",
        href: "/list/events",
        visible: ["Administrator", "Teacher", "student", "parent"],
      },

      {
        icon: "/announcement.png",
        label: "Announcements",
        href: "/list/announcements",
        visible: ["Administrator", "Teacher", "student", "parent"],
      },
    ],
  },
  {
    title: "OTHER",
    items: [
      {
        icon: "/profile.png",
        label: "Profile",
        href: "/profile",
        visible: ["Administrator", "Teacher", "student", "parent"],
      },
      {
        icon: "/setting.png",
        label: "Settings",
        href: "/settings",
        visible: ["Administrator", "Teacher", "student", "parent"],
      },
      {
        icon: "/logout.png",
        label: "Logout",
        href: "/logout",
        visible: ["Administrator", "Teacher", "student", "parent"],
      },
    ],
  },
];
// eslint-disable-next-line @next/next/no-async-client-component
interface MenuProps {
  role: string;
}
const Menu = ({ role }: MenuProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const signOut = async () => {
    try {
      setLoading(true); // nếu có loading state

      // Gọi API logout nếu cần
      // await logoutAPI();

      // Xóa cookies
      Cookies.remove("token");
      Cookies.remove("role");

      // Cleanup các state khác nếu cần
      // dispatch(clearUserState());

      // Chuyển hướng
      router.replace("/sign-in");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 text-sm">
      {menuItems.map((i) => (
        <div className="flex flex-col gap-2" key={i.title}>
          <span className="lg:block hidden text-gray-400 font-light my-4">
            {i.title}
          </span>
          {i.items.map((item) => {
            if (item.visible.includes(role)) {
              return (
                <Link
                  href={item.href}
                  key={item.label}
                  // className=""
                >
                  <div
                    onClick={
                      item.href === "/logout" ? () => signOut() : undefined
                    }
                    className="flex gap-4 items-center justify-center lg:justify-start text-gray-500 py-2 md:px-2 rounded-md hover:bg-gray-100"
                  >
                    <Image src={item.icon} alt="" width={20} height={20} />
                    <span className="hidden lg:block">{item.label}</span>
                  </div>
                </Link>
              );
            }
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;
