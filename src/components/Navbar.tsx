import React from 'react';
import { appleImg, searchImg, bagImg } from '../utils';
import { navLists } from '../constants';

const Navbar = () => {
  return (
    <header className='w-full p-5 flex justify-between items-center sm:px-10'>
      <nav className='flex w-full screen-max-width'>
        <img src={appleImg} alt='Apple Logo' width={14} height={18} />

        <div className='flex flex-1 justify-center max-sm:hidden'>
          {navLists.map((nav) => (
            <div
              className='px-5 cursor-pointer text-sm text-gray hover:text-white transition-all'
              key={nav}
            >
              {nav}
            </div>
          ))}
        </div>

        <div className='flex items-baseline gap-7 max-sm:justify-end max-sm:flex-1'>
          <img
            src={searchImg}
            alt='search'
            width={18}
            height={18}
            className='cursor-pointer'
          />
          <img
            src={bagImg}
            alt='bag'
            width={18}
            height={18}
            className='cursor-pointer'
          />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
