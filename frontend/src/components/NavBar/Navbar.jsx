import React from 'react'
import { 
  BellFilled,
  SearchOutlined

} from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaw } from '@fortawesome/free-solid-svg-icons'

import './Navbar.css'


const Navbar = ({ avatarImg, searchTerm, onSearchChange, placeholder, disabled }) => {
  return (
         <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-pink-100 h-20 rounded-b-xl bg-pink-200 flex justify-between items-center px-8 [mask-image:linear-gradient(to_bottom,black_80%,transparent_100%)]">
        <div className="flex items-center gap-6">
          <span className="text-xl font-black text-pink-700 tracking-tight relative"><FontAwesomeIcon icon={faPaw} className = "absolute scale-150 -left-1/4 -rotate-45 -top-1/4"/><span className = "text-2xl">Blossom</span> <br></br> <span className = "absolute top-1/2 box-content -right-1/2">& Paws</span></span>
          <div className="hidden md:flex items-center bg-pink-50/50 px-4 py-2 rounded-full gap-2 border border-purple-500 w-72 absolute left-1/2 -translate-x-1/2">
              <SearchOutlined className="text-gray-400 text-sm" />
              <input
                className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none placeholder-gray-400"
                placeholder={placeholder}
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange?.(e.target.value)}
                disabled={disabled}
              />
          </div>
        </div>

        <div className="flex items-center gap-5">
          <button className="text-pink-600 hover:scale-110 transition-transform flex items-center">
            <BellFilled className="text-xl" />
          </button>
          <img alt="User profile" className="w-9 h-9 rounded-full object-cover border-2 border-pink-200" src={avatarImg}/>
        </div>
      </header>
  )
}

export default Navbar
