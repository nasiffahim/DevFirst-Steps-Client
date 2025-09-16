"use client";

import { Moon } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    return (
        <div>
            <nav className='w-full bg-black'>
                <div className='max-w-7xl mx-auto px-4 py-3 flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                        <img src="" alt="" />
                        <span className='font-bold text-xl'>Dev First step</span>
                        </div>

        <div className="hidden md:flex gap-6">
          <a href="">Home</a>
          <a href="" >All Projects</a>
          <a href="" >Add Projects</a>
          <a href="" >About</a>
          <a href="">Contact</a>
        </div>

        <div>
            <button className="py-2 rounded-full"><Moon size={20} /></button>
            <button className="px-4 py-2 rounded-lg">Sign In</button>


             <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>
        </div>

           {menuOpen && (
        <div className="md:hidden flex flex-col gap-4 px-4 py-3">
          <a href="">Home</a>
          <a href="">About</a>
          <a href="">Services</a>
          <a href="">Contact</a>
        </div>
      )}

            </nav>
        </div>
    );
};

export default Navbar;