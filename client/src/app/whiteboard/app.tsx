'use client'
import React from 'react';
import '../global.css';
import WhiteBoard from '../_components/WhiteBoard';

export default function App() {
    return (
        <div className='flex items-center justify-center border border-grey relative z-50' id='root'>
            <div className=''>
                <WhiteBoard />
            </div>
        </div>
    );
}