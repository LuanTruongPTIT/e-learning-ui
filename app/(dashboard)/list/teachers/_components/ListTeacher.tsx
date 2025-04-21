"use client";

import { GetTeacherByAdmin } from "@/apis/teacher";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/table";
import { columns_teacher_page_admin, Teacher } from "@/types/teacher";
import Link from "next/link";
import React from "react";
import Image from "next/image";
interface ListTeacherProps {
  page: number;
  role: string | null;
}
const renderRow = (item: Teacher, role: string) => (
  <tr
    key={item.user_id}
    className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
  >
    <td className="flex items-center gap-4 p-4">
      <Image
        src={item.avatar_url}
        alt=""
        width={40}
        height={40}
        className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
      />
      <div className="flex flex-col">
        <h3 className="font-semibold">{item.full_name}</h3>
        <p className="text-xs text-gray-500">{item?.email}</p>
      </div>
    </td>
    {/* <td className="hidden md:table-cell">{item.teacherId}</td> */}
    <td className="hidden md:table-cell">
      {item.information_teaching.courses
        .map((course) => course.course_name)
        .join(", ")}
    </td>
    <td className="hidden md:table-cell">
      {item.information_teaching.department_name}
    </td>
    <td className="hidden md:table-cell">{item.phoneNumber}</td>
    <td className="hidden md:table-cell">{item.address}</td>
    <td>
      <div className="flex items-center gap-2">
        <Link href={`/list/teachers/${item.user_id}`}>
          <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
            <Image src="/view.png" alt="" width={16} height={16} />
          </button>
        </Link>
        {role === "Administrator" && (
          // <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaPurple">
          //   <Image src="/delete.png" alt="" width={16} height={16} />
          // </button>
          <FormModal table="teacher" type="delete" id={item.user_id} />
        )}
      </div>
    </td>
  </tr>
);

const ListTeacher = ({ page, role }: ListTeacherProps) => {
  const [data, setData] = React.useState<Teacher[]>([]);
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await GetTeacherByAdmin(page, 10);
        setData(result.data);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };
    fetchData();
  }, [page]);

  return (
    <>
      <Table
        columns={columns_teacher_page_admin}
        renderRow={(item) => renderRow(item, role || "")}
        data={data}
      />
      <Pagination page={page} count={data.length} />
    </>
  );
};

export default ListTeacher;
