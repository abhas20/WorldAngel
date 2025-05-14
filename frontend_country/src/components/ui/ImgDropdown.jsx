import { useEffect, useState } from "react";
import { IoIosClose } from "react-icons/io";
import { NavLink } from "react-router-dom";
import useAuth from "../../auth/hooks/useAuth";


export default function ImgDropdown({logoutUser}) {

    const [open,setOpen]=useState(false);

    const {auth}=useAuth();
    const user=auth?.user

    const handleAvatarClick=()=>{
        // if(!open) setOpen(!open);
        setOpen(prev=>!prev)
    }
    const handleLogout=()=>{
        logoutUser();
        setOpen(false);
    }


  return (
    <div className="relative">
      {user &&(
      <div>
        <img
            src={user.avatar}
            alt="Profile"
            onClick={handleAvatarClick}
            className="w-10 h-10 rounded-full cursor-pointer border-2 border-amber-300"
          />
          {open && (
            <ul className="absolute right-0 mt-2 w-40 bg-black  rounded shadow-md z-50">
              <li className="flex justify-end cursor-pointer" onClick={handleAvatarClick}><IoIosClose/></li>
              <NavLink to="/profile"><li className="px-4 py-2 hover:underline underline-offset-2 hover:text-amber-500 cursor-pointer">
                Profile
              </li>
              </NavLink>
              <li onClick={handleLogout} className="px-4 py-2 hover:underline underline-offset-2 hover:text-amber-500 cursor-pointer">
                Logout
              </li>
            </ul>
          )}
      </div>
      )}
      
    </div>
  )
}
