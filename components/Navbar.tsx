"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getCurrentUser, UserProfile } from "@/apis/profile";
import Cookies from "js-cookie";
import { Skeleton } from "@/components/ui/skeleton";

const Navbar = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getCurrentUser();
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if we have a token
    if (Cookies.get("token")) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <div className="flex items-center justify-between p-4">
      <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
        <Image src="/search.png" alt="" width={14} height={14} />
        <input
          type="text"
          placeholder="Search..."
          className="w-[200px] p-2 bg-transparent outline-none"
        />
      </div>
      <div className="flex items-center gap-6 justify-end w-full">
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
          <Image src="/message.png" alt="" width={20} height={20} />
        </div>
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative">
          <Image src="/announcement.png" alt="" width={20} height={20} />
          <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs">
            1
          </div>
        </div>
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="flex items-center gap-3">
              <div className="flex flex-col text-right gap-1">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-2 w-12" />
              </div>
              <Skeleton className="h-9 w-9 rounded-full" />
            </div>
          ) : user ? (
            <>
              <div className="flex flex-col text-right">
                <span className="text-xs font-medium">{user.full_name}</span>
                <span className="text-[10px] text-gray-500">{user.role}</span>
              </div>
              <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-gray-300 cursor-pointer hover:border-purple-500">
                <Image
                  src={user.avatar_url || "/avatar.png"}
                  alt="User Avatar"
                  width={36}
                  height={36}
                  className="object-cover"
                />
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col text-right">
                <span className="text-xs font-medium">Guest</span>
                <span className="text-[10px] text-gray-500">Not logged in</span>
              </div>
              <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-gray-300 cursor-pointer hover:border-purple-500">
                <Image
                  src="/avatar.png"
                  alt="User Avatar"
                  width={36}
                  height={36}
                  className="object-cover"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default Navbar;
