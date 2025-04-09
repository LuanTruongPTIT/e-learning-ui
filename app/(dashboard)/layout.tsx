import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] overflow-scroll p-4 m-4 rounded-3xl">
          {children}
        </main>
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="bg-white shadow-md p-3 flex items-center">
      <Link className="flex items-center gap-3" href="/">
        <Image
          src="/logo-ptit.png"
          alt="logo"
          width={50}
          height={50}
          className="rounded-full shadow-sm"
        />
        <span className="text-lg font-semibold hidden lg:block text-gray-700">
          Posts and Telecommunication Institute of Technology
        </span>
      </Link>
      <div className="flex justify-end flex-1">
        <Navbar />
      </div>
    </header>
  );
}

function Sidebar() {
  return (
    <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] px-4 pb-4 pt-1">
      <Menu />
    </div>
  );
}
