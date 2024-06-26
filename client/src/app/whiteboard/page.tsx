'use client'
import React, { useEffect } from 'react';
import People from '../_components/People';
import NavBox from '../_components/NavBox/NavBox';
import '../global.css';
import WhiteBoard from '../_components/WhiteBoard';
import ToolBar from '../_components/ToolBar';
import App from './app';

export default function Page() {
  useEffect(()=>{
    document.body.classList.add('bg-green-200');
  })
  return (
    <App />
  );
}