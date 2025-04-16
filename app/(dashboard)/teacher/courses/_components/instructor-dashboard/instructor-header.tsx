import { Bell, MessageSquare, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function InstructorHeader() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-primary mr-8">E-Learning</h1>
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="text-primary font-medium">
              Dashboard
            </a>
            <a href="#" className="text-gray-600 hover:text-primary">
              My Courses
            </a>
            <a href="#" className="text-gray-600 hover:text-primary">
              Calendar
            </a>
            <a href="#" className="text-gray-600 hover:text-primary">
              Messages
            </a>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-8 bg-gray-50 border-gray-200"
            />
          </div>

          <Button variant="ghost" size="icon" className="text-gray-600">
            <Bell className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" className="text-gray-600">
            <MessageSquare className="h-5 w-5" />
          </Button>

          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage
                src="/placeholder.svg?height=32&width=32"
                alt="Instructor"
              />
              <AvatarFallback className="bg-primary/20 text-primary">
                JD
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium hidden md:inline">
              John Doe
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
