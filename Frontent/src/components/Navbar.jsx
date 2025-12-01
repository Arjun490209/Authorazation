import { BookA, BookOpen, LogOut, User } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import {getData} from '../context/userContext'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import axios from "axios";
import { toast } from "sonner";

const Navbar = () => {
  const {user, setUser} = getData()
  const accessToken = localStorage.getItem("accessToken");

  const logoutHandler = async() => {
    try {
      const response = await axios.post('http://localhost:5000/user/logout', {},{
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        withCredentials: true
      })
      if(response.data.success){
        setUser(null);
        localStorage.removeItem("accessToken");
        toast.success(response.data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <nav className="p-3 border-b border-gray-200 bg-white/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="flex gap-2 items-center">
          <BookOpen className="text-green-600 h-7 w-7" />
          <h1 className="text-xl font-bold tracking-tight">
            <span className="text-green-600">Notes</span> App
          </h1>
        </Link>

        {/* Menu */}
        <div className="flex gap-4 items-center">
          <ul className="hidden md:flex gap-8 items-center text-base font-semibold text-gray-700">
            {["Features", "Pricing", "About"].map((item, index) => (
              <li
                key={index}
                className="cursor-pointer hover:text-green-600 transition relative after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-green-600 after:left-0 after:-bottom-1 hover:after:w-full after:duration-200"
              >
                {item}
              </li>
            ))}
          </ul>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar className="cursor-pointer hover:opacity-90 rounded-full">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-40">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem><User/> Profile</DropdownMenuItem>
                <DropdownMenuItem><BookA/> Notes</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logoutHandler}><LogOut/> Log Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <li className="list-none">
              <Link
                to="/login"
                className="text-green-700 font-semibold hover:text-green-600 transition"
              >
                Login
              </Link>
            </li>
          )}

          {/* Mobile Menu Button (Optional Future Improvement) */}
          <button className="md:hidden text-xl font-bold text-gray-700">☰</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
