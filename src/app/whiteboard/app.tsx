'use client'
import React, { useEffect, useState } from 'react';
import People from '../_components/People';
import NavBox from '../_components/NavBox/NavBox';
import '../global.css';
import WhiteBoard from '../_components/WhiteBoard';
import Modal from '../_components/Modal/Modal';
import JoinRoomModal from '../_components/Modal/JoinRoomModal';

export default function App() {
    return (
        <div className='flex items-center justify-center border border-grey relative z-50' id='root'>
            <div className=''>
                <WhiteBoard />
            </div>
                {/* <div className='flex flex-col items-start border border-grey absolute top-0 left-0 bg-white'>
                    <NavBox />
                </div> */}
            {/* <div className='flex flex-col items-end p-2 cursor-default border border-grey absolute bottom-0 right-0'>
                <People index='4' />
                <People index='4' />
                <People index='4' />
                <People index='4' />
            </div> */}
        </div>


    );
}