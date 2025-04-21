import FormModal from "@/components/FormModal";
import Image from "next/image";
import CreateTeacherButton from "./_components/CreateTeacherButton";
import { cookies } from "next/headers";
import React from "react";
import ListTeacher from "./_components/ListTeacher";

const TeacherListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const asyncparam = await searchParams;
  const pageParam = asyncparam.page;
  const p = pageParam ? parseInt(pageParam) : 1;
  const cookieStore = await cookies();
  const role = cookieStore.get("role")?.value;

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Teachers</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          {/* <TableSearch /> */}
          {role === "Administrator" && <CreateTeacherButton />}
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "Administrator" && (
              // <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              //   <Image src="/plus.png" alt="" width={14} height={14} />
              // </button>
              <FormModal table="teacher" type="create" />
            )}
          </div>
        </div>
      </div>
      <ListTeacher page={p} role={role || ""} />
    </div>
  );
};

export default TeacherListPage;
