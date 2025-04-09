import Image from "next/image";
const Navbar = async () => {
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
          <div className="flex flex-col text-right">
            <span className="text-xs font-medium">Luan Truong</span>
            <span className="text-[10px] text-gray-500">Admin</span>
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
        </div>
      </div>
    </div>
  );
};
export default Navbar;
