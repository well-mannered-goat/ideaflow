import React from 'react';
import People from './_components/People';
import NavBox from './_components/NavBox/NavBox';
import '../app/global.css';
import WhiteBoard from './_components/WhiteBoard';
import { N } from 'ethers';


export default function Home() {
  return (
    <div className='flex items-center justify-center border border-grey relative'>
      <div className='flex flex-col items-start border border-grey absolute top-0 left-0 bg-white'>
        <NavBox />
      </div>
      <div className=''>
        <WhiteBoard />
      </div>

      <div className='flex flex-col items-end p-2 cursor-default z-10 border border-grey absolute bottom-0 right-0'>
        <People index='4' />
        <People index='4' />
        <People index='4' />
        <People index='4' />
      </div>

    </div>


  );
}