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
        href: "/admin",
        visible: ["Administrator"],
      },
      {
        icon: "/home.png",
        label: "Home",
        href: "/",
        visible: ["Teacher", "student", "parent"],
      },
      {
        icon: "/teacher.png",
        label: "Teachers",
        href: "/admin/teachers",
        visible: ["Administrator"],
      },
      {
        icon: "/student.png",
        label: "Students",
        href: "/admin/students",
        visible: ["Administrator"],
      },
      // {
      //   icon: "/subject.png",
      //   label: "Subjects",
      //   href: "/list/subjects",
      //   visible: ["Administrator"],
      // },
      {
        icon: "/class.png",
        label: "Classes",
        href: "/admin/courses", // Default for Administrator
        teacherHref: "/teacher/classes", // Special href for Teacher
        visible: ["Administrator", "Teacher"],
      },
      {
        icon: "/lesson.png",
        label: "Courses",
        href: "/teacher/courses",
        visible: ["Teacher"],
      },
      {
        icon: "/lesson.png",
        label: "My Courses",
        href: "/student/courses",
        visible: ["student"],
      },
      {
        icon: "/sort.png",
        label: "Statistics",
        href: "/admin/statistics", // Default for Administrator
        visible: ["Administrator"],
      },
    ],
  },
  {
    title: "OTHER",
    items: [
      // {
      //   icon: "/profile.png",
      //   label: "Profile",
      //   href: "/profile",
      //   visible: ["Administrator", "Teacher", "Student", "parent"],
      // },
      // {
      //   icon: "/setting.png",
      //   label: "Settings",
      //   href: "/settings",
      //   visible: ["Administrator", "Teacher", "Student", "parent"],
      // },
      {
        icon: "/logout.png",
        label: "Logout",
        href: "/logout",
        visible: ["Administrator", "Teacher", "Student", "parent"],
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
      setLoading(true);

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

  // Function to get the correct href based on role
  const getHrefForRole = (item: any) => {
    // If item has teacherHref and current role is Teacher, use teacherHref
    if (item.teacherHref && role === "Teacher") {
      return item.teacherHref;
    }
    // Otherwise use default href
    return item.href;
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
              const itemHref = getHrefForRole(item);

              return (
                <Link href={itemHref} key={item.label}>
                  <div
                    onClick={
                      item.href === "/logout" ? () => signOut() : undefined
                    }
                    className="flex gap-4 items-center justify-center lg:justify-start text-gray-500 dark:text-gray-300 py-2 md:px-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
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
