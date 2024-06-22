'use client'
import React, { useEffect, useState, useRef } from 'react';
import ToolBar from './ToolBar';
import People from './People';
import rough from 'roughjs/bin/rough';
import { RoughSVG } from 'roughjs/bin/svg';
import Shape from '@/Shapes/Shapes';
import Rectangle from '@/Shapes/Rectangle';
import Circle from '@/Shapes/Circle';
import { useRouter, useSearchParams } from 'next/navigation';
import Modal from './Modal/Modal';
import JoinRoomModal from './Modal/JoinRoomModal';

interface State {
    tool: Shape | null;
    x2: number;
    y2: number;

}

interface Message {
    type: string;
    roomID: string | null;
    data: string;
    command: string;
    name:string
}

interface DrawData {
    x1: number,
    x2: number,
    y1: number,
    y2: number,
    tool: string,
}

const WhiteBoard: React.FC = () => {

    const router = useRouter();
    const [state, setState] = useState<State>({
        tool: null,
        x2: 0,
        y2: 0,
    });
    const [isOpen, setisOpen] = useState(false);
    const roomID=useRef<string|null>('0');

    const x1 = useRef<number>(0);
    const y1 = useRef<number>(0);

    const rectRef = useRef<Rectangle | null>(null);
    const circleRef = useRef<Circle | null>(null);
    const socketRef = useRef<WebSocket | null>(null);
    const name=useRef('');
    const names=useRef(['']);

    

    useEffect(() => {
        const queryParams:URLSearchParams = new URLSearchParams(window.location.search);


        const btn = document.getElementById('open-modal');
        btn?.addEventListener('click', () => {

            setisOpen(true);
        })
         
        

        console.log(queryParams.entries());

        initWebSocket();
        const svgElement = document.getElementById('svg');
        if (svgElement instanceof SVGSVGElement) {
            const height = (window.screen.height - 110).toString();
            const width = (window.screen.width - 75).toString();
            svgElement.setAttribute('height', height);
            svgElement.setAttribute('width', width);
        } else {
            console.error('The element is not an SVG element.');
        }

        rectRef.current = new Rectangle(svgElement);
        circleRef.current = new Circle(svgElement);

        let moused: number | NodeJS.Timeout = -1;
        let mousem = -1;
        let interval;

        const mousedown = (event: MouseEvent) => {
            if (moused === -1) {
                x1.current = event.clientX;
                y1.current = event.clientY;
                if (state.tool) {
                    svgElement?.addEventListener('mousemove', mousemove);
                    moused = setInterval(() => whilemousedown(event), 1);
                } else {
                    alert('Select tool');
                }
            }
        };

        const mouseup = (event: MouseEvent) => {
            if (moused !== -1) {
                clearInterval(moused);
                state.tool?.makeShape(x1.current, y1.current, event.clientX - x1.current, event.clientY - y1.current);
                setState((prevState) => ({
                    ...prevState,
                    x2: event.clientX,
                    y2: event.clientY,
                }));
                console.log(event.clientX);

                let data: DrawData;
                const saveButton = document.getElementById('save');
                let mes: Message;
                if (svgElement) {
                    data = {
                        x1: x1.current,
                        x2: event.clientX,
                        y1: y1.current,
                        y2: event.clientY,
                        tool: state.tool instanceof Rectangle ? 'Rectangle' : 'Circle',
                    };

                    console.log(data, "data sending");
                }

                if (socketRef.current?.OPEN) {
                    mes = {
                        data: JSON.stringify(data),
                        type: 'request',
                        roomID: roomID.current,
                        command: 'SEND DATA',
                        name:queryParams.get('name')!,
                    }
                    socketRef.current.send(JSON.stringify(mes));
                }
                moused = -1;
            }
        };

        const mousemove = (e: MouseEvent) => {
            if (moused !== -1) {
                state.tool?.showShape(x1.current, y1.current, e.clientX - x1.current, e.clientY - y1.current);
            }
        };

        const whilemousedown = (event: MouseEvent) => {
            console.log(state);
        };

        svgElement?.addEventListener('mousedown', mousedown);
        svgElement?.addEventListener('mouseup', mouseup);
        svgElement?.addEventListener('mouseout', mouseup);

        return () => {
            svgElement?.removeEventListener('mousedown', mousedown);
            svgElement?.removeEventListener('mouseup', mouseup);
            svgElement?.removeEventListener('mouseout', mouseup);
        };
    }, [state.tool]);


    //const queryParams:URLSearchParams = new URLSearchParams(window.location.search);
        const searchParams=useSearchParams();

        console.log(searchParams.get('roomId'));
        console.log(searchParams.get('name'));
        
        roomID.current=searchParams.get('roomId');
        name.current=searchParams.get('name')!;
        names.current=[name.current];


    const initWebSocket = () => {
        const socket = new WebSocket('ws://localhost:8080');
        socketRef.current = socket;

        socket.onopen = () => {
            console.log('connected to websocket');
        };

        let mes: Message = {
            type: 'request',
            command: 'SEND NAMES',
            roomID: roomID.current,
            data: '',
            name:name.current
        }

        socket.addEventListener('open',()=>{
            console.log('chalu bc');

            if(queryParams.has('roomId')){
                socket.send(JSON.stringify(mes));

            }

            
        })

        //socket.send(JSON.stringify(mes));
        const queryParams=new URLSearchParams(window.location.search);
        
        socket.onmessage = (ev: MessageEvent) => {
            console.log("message aaya hai");
            console.log((ev.data).toString());
            const mes: Message = JSON.parse(ev.data);
            if (mes.type === 'response') {

                switch (mes.command) {
                    case 'ROOM CREATED':
                        roomID.current=mes.roomID;
                        queryParams.set('roomId',mes.roomID!);
                        router.push(`/whiteboard?${queryParams}`)
                        console.log(roomID);
                        break;

                    case 'FULL SERVER':
                        alert('Sorry Server is full');
                        break;

                    case 'JOINED ROOM':
                        setState((prevState) => ({
                            ...prevState,
                            roomID: mes.roomID,
                        }))
                        queryParams.append('roomId',`${mes.roomID}`);
                        router.push(`/whiteboard?${queryParams}`)
                        roomID.current=mes.roomID;
                        break;

                    case 'LEFT ROOM':
                        setState((prevState) => ({
                            ...prevState,
                            roomID: '0',
                        }))

                        if(mes.name){
                            let n=mes.name.split(',');
                            if(n.includes(name.current)){
                                names.current=n;
                            }
                            else{
                                names.current=[name.current];
                            }
                        }
                        else{
                            names.current=[name.current];
                        }
                        queryParams.delete('roomId');
                        router.push(`/whiteboard?${queryParams}`);
                        break;

                    case 'DRAWING DATA':
                        const drawData = JSON.parse(mes.data);
                        executeMessage(drawData);
                        break;
                    
                    case 'USERNAMES':
                        //let names:string[];
                        if(mes.name){
                            //names=mes.name.split(',')
                            names.current=mes.name.split(',');
                        }
                        console.log(names,' ');
                        break;
                }
            }
        };
    };

    const executeMessage = (data: DrawData) => {
        console.log('making shapes', data);
        switch (data.tool) {
            case 'Rectangle':
                rectRef.current?.makeShape(data.x1, data.y1, data.x2 - data.x1, data.y2 - data.y1);
                break;
            case 'Circle':
                circleRef.current?.makeShape(data.x1, data.y1, data.x2 - data.x1, data.y2 - data.y1);
                break;
        }
    };

    const selecttheTool = (tool: string) => {
        console.log('the selected tool is ', tool);
        if (tool === 'rectangle') {
            setState((prevState) => ({
                ...prevState,
                tool: rectRef.current,
            }));
        } else if (tool === 'circle') {
            setState((prevState) => ({
                ...prevState,
                tool: circleRef.current,
            }));
        }
    };

    const createRoom = () => {
        let mes: Message = {
            type: 'request',
            command: 'CREATE ROOM',
            roomID: '0',
            data: '',
            name:name.current
        }

        socketRef.current?.send(JSON.stringify(mes));

        let mes1: Message = {
            type: 'request',
            command: 'SEND NAMES',
            roomID: roomID.current,
            data: '',
            name:name.current
        }
        socketRef.current?.send(JSON.stringify(mes1));


    };

    const leaveRoom =()=>{
        let mes:Message ={
            type:'request',
            command:'LEAVE ROOM',
            roomID:roomID.current,
            data:'',
            name:name.current,
        }
        socketRef.current?.send(JSON.stringify(mes));

    }

    

    return (
        <div className='relative'>
            <div className='absolute inset-x-0 top-0 flex items-center justify-center min-h-24'>
                <ToolBar selectTool={selecttheTool} websocket={socketRef.current} createRoom={createRoom} leaveRoom={leaveRoom} />
            </div>
            <svg id="svg" className="border border-grey">
                {/* SVG content goes here */}
            </svg>
            <div className='flex flex-col items-end p-2 cursor-default border border-grey absolute bottom-0 right-0'>
                {names.current.map((n)=>(
                    <People key={n} index={n}/>
                ))}
            </div>
            <Modal handleClose={() => {
                let dull=document.getElementById('dull');
                while(dull){
                    dull.parentNode?.removeChild(dull);
                    dull=document.getElementById('dull');
                }
                setisOpen(false)}
             } isOpen={isOpen}>
                 <JoinRoomModal socket={socketRef.current!} name={name.current}/>
            </Modal>
        </div>
    );
};

export default WhiteBoard;