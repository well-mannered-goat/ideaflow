'use client'
import React, { useEffect } from 'react';
import People from './_components/People';
import NavBox from './_components/NavBox/NavBox';
import './global.css'
import WhiteBoard from './_components/WhiteBoard';
import ToolBar from './_components/ToolBar';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  let path:string='';
  useEffect(() => {
    //router=useRouter();

    document.body.classList.add('bg-green-400');

    path=window.location.pathname;

    const startBtn=document.getElementById('start');
    startBtn?.addEventListener('click',()=>{
      //alert('he;;p');
      const name:string=document.getElementById('name').value;
      window.location.href=`whiteboard?name=${name}`
    })
  })
  return (
    <div>
      <div className='flex flex-col justify-center items-center h-screen'>
        <div className='font-amatic text-9xl'>
          IDEAFLOW
        </div>
        <div className='w-72 h-24 py-6 text-black font-amatic text-3xl  '>
          <input id='name' placeholder='Your name' type='text' className='bg-green-500 w-full h-full border-none text-center rounded-md placeholder:text-slate-900 placeholder:text-center focus:ring-0 focus:border-none'></input>
        </div>
        <div>
          <Link  className='font-amatic text-3xl bg-green-500 w-full h-full rounded-lg' href={path + 'whiteboard'} id='start'>Start</Link>
        </div>
      </div>

    </div>

  )
}