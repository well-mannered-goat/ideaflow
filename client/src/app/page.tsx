'use client'
import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import rough from 'roughjs';
import './global.css'

export default function Home() {
  const shapesContainerRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (shapesContainerRef.current) {
      const rc = rough.svg(shapesContainerRef.current);
      shapesContainerRef.current.appendChild(rc.line(862, 576, 862, 0));
      shapesContainerRef.current.appendChild(rc.line(862, 576, 0, 576));
      shapesContainerRef.current.appendChild(rc.line(529, 731, 529, 1000));
      shapesContainerRef.current.appendChild(rc.line(529, 731, 2000, 731));
      shapesContainerRef.current.appendChild(rc.circle(1529, 156, 1200));
      shapesContainerRef.current.appendChild(rc.circle(548, 819, 1000));
    }

    const help = document.getElementById('help');
    help?.addEventListener('click', (e) => {
      console.log(e.clientX, ' ', e.clientY);
    })

    const startBtn = document.getElementById('start');
    startBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      const Name = document.getElementById('name') as HTMLInputElement;
      const name = Name.value;
      window.location.href = `whiteboard?name=${name}`;
    });
  }, []);

  return (
    <div className="relative w-full h-screen bg-green-400 overflow-hidden" id='help'>
      <svg
        ref={shapesContainerRef}
        className="absolute inset-0 w-full h-full opacity-30"
      />
      <div className='flex flex-col justify-center items-center h-full relative z-10'>
        <div className='font-amatic text-9xl text-black mb-8'>
          IDEAFLOW
        </div>
        <div className='w-72 h-24 py-6 text-black font-amatic text-3xl mb-4'>
          <input
            id='name'
            placeholder='Your name'
            type='text'
            className='bg-green-500 w-full h-full border-none text-center rounded-md placeholder:text-slate-900 placeholder:text-center focus:ring-0 focus:border-none'
          />
        </div>
        <div>
          <Link
            className='font-amatic text-3xl bg-green-500 px-8 py-3 rounded-lg hover:bg-green-600 transition-colors'
            href='/whiteboard'
            id='start'
          >
            Start
          </Link>
        </div>
      </div>
    </div>
  )
}