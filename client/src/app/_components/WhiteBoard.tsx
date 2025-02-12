'use client'
import React, { useEffect, useState, useRef } from 'react';
import ToolBar from './ToolBar';
import People from './People';
import Shape from '@/Shapes/Shapes';
import Rectangle from '@/Shapes/Rectangle';
import Circle from '@/Shapes/Circle';
import { useRouter } from 'next/navigation';
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
    name: string
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
    const [showRoomId, setshowRoomId] = useState(false);
    const roomID = useRef<string | null>('0');

    const x1 = useRef<number>(0);
    const y1 = useRef<number>(0);

    const rectRef = useRef<Rectangle | null>(null);
    const circleRef = useRef<Circle | null>(null);
    const socketRef = useRef<WebSocket | null>(null);
    const name = useRef('');
    const [names, setNames] = useState(['']);
    const [roomNoInput,setroomNoInput]=useState('');



    useEffect(() => {
        const queryParams: URLSearchParams = new URLSearchParams(window.location.search);

        const btn = document.getElementById('open-modal');
        btn?.addEventListener('click', () => {
            setisOpen(true);
        })

        initWebSocket();
        const svgElement = document.getElementById('svg') as unknown as SVGSVGElement;
        if (svgElement instanceof SVGSVGElement) {
            const height = (window.screen.height).toString();
            const width = (window.screen.width).toString();
            svgElement.setAttribute('height', height);
            svgElement.setAttribute('width', width);
        } else {
            console.error('The element is not an SVG element.');
        }

        rectRef.current = new Rectangle(svgElement);
        circleRef.current = new Circle(svgElement);

        let moused: number | NodeJS.Timeout = -1;

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

                let data: DrawData;
                let mes: Message;
                if (svgElement) {
                    data = {
                        x1: x1.current,
                        x2: event.clientX,
                        y1: y1.current,
                        y2: event.clientY,
                        tool: state.tool instanceof Rectangle ? 'Rectangle' : 'Circle',
                    };
                }

                if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                    mes = {
                        data: JSON.stringify(data!),
                        type: 'request',
                        roomID: roomID.current,
                        command: 'SEND DATA',
                        name: queryParams.get('name')!,
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
        };

        svgElement?.addEventListener('mousedown', mousedown);
        svgElement?.addEventListener('mouseup', mouseup);
        svgElement?.addEventListener('mouseout', mouseup);

        if (queryParams.has('roomId')) {
            setshowRoomId(true);
        }

        return () => {
            svgElement?.removeEventListener('mousedown', mousedown);
            svgElement?.removeEventListener('mouseup', mouseup);
            svgElement?.removeEventListener('mouseout', mouseup);
        };
    },[state.tool]);



    useEffect(() => {
        const searchParams: URLSearchParams = new URLSearchParams(window.location.search);

        console.log(searchParams.get('roomId'));
        console.log(searchParams.get('name'));

        roomID.current = searchParams.get('roomId');
        name.current = searchParams.get('name')!;
        setNames([name.current]);
    }, [])




    const initWebSocket = () => {
        const socket = new WebSocket('wss://ideaflow-websocket-server.onrender.com');
        socketRef.current = socket;

        socket.onopen = () => {
            console.log('connected to websocket');
            console.log(socket.OPEN);
        };

        let mes: Message = {
            type: 'request',
            command: 'SEND NAMES',
            roomID: roomID.current,
            data: '',
            name: name.current
        }

        socket.addEventListener('open', () => {
            if (queryParams.has('roomId')) {
                socket.send(JSON.stringify(mes));
            }
        })

        const queryParams = new URLSearchParams(window.location.search);

        socket.onmessage = (ev: MessageEvent) => {
            const mes: Message = JSON.parse(ev.data);
            if (mes.type === 'response') {

                switch (mes.command) {
                    case 'ROOM CREATED':
                        roomID.current = mes.roomID;
                        queryParams.set('roomId', mes.roomID!);
                        setshowRoomId(true);
                        router.push(`/whiteboard?${queryParams}`)
                        break;

                    case 'FULL SERVER':
                        alert('Sorry Server is full');
                        break;

                    case 'JOINED ROOM':
                        if (queryParams.has('roomId')) {
                            queryParams.delete('roomId');
                        }
                        queryParams.append('roomId', `${mes.roomID}`);

                        router.push(`/whiteboard?${queryParams}`)
                        roomID.current = mes.roomID;
                        setshowRoomId(true);
                        break;

                    case 'LEFT ROOM':
                        if (mes.name) {
                            let n = mes.name.split(',');
                            if (n.includes(name.current)) {
                                setNames(n);
                            }
                            else {
                                setNames([name.current]);
                            }
                        }
                        else {
                            setNames([name.current]);
                        }
                        queryParams.delete('roomId');
                        setshowRoomId(false);
                        router.push(`/whiteboard?${queryParams}`);
                        break;

                    case 'DRAWING DATA':
                        const drawData = JSON.parse(mes.data);
                        executeMessage(drawData);
                        break;

                    case 'USERNAMES':
                        if (mes.name) {
                            const n = mes.name.split(',');
                            if (n.includes(name.current)) {
                                setNames(mes.name.split(','));
                            }
                            else {
                                setNames([name.current]);
                            }
                        }
                        break;
                }
            }
        };
    }

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
            name: name.current
        }

        socketRef.current?.send(JSON.stringify(mes));

        let mes1: Message = {
            type: 'request',
            command: 'SEND NAMES',
            roomID: roomID.current,
            data: '',
            name: name.current
        }
        socketRef.current?.send(JSON.stringify(mes1));

    };

    const leaveRoom = () => {
        let mes: Message = {
            type: 'request',
            command: 'LEAVE ROOM',
            roomID: roomID.current,
            data: '',
            name: name.current,
        }
        socketRef.current?.send(JSON.stringify(mes));

        let mes1: Message = {
            type: 'request',
            command: 'SEND NAMES',
            roomID: roomID.current,
            data: '',
            name: name.current
        }
        socketRef.current?.send(JSON.stringify(mes1));

    }


    const getRoomNo = () => {
        console.log(roomNoInput);
        if (roomNoInput !== undefined) {
            console.log(socketRef.current, '', roomNoInput);
            const message = {
                type: 'request',
                command: 'JOIN ROOM',
                roomID: roomNoInput,
                data: '',
                name: name.current,
            }
            socketRef.current!.send(JSON.stringify(message));

            let mes1 = {
                type: 'request',
                command: 'SEND NAMES',
                roomID: roomNoInput,
                data: '',
                name: name.current
            }
            socketRef.current!.send(JSON.stringify(mes1));
            handleClose();

        }
        else {
            alert('Enter Room No');
        }
    }

    const handleClose = () => {
        let dull = document.getElementById('dull');
        while (dull) {
            dull.parentNode?.removeChild(dull);
            dull = document.getElementById('dull');
        }
        setisOpen(false);
    }

    const getInput = ()=>{
        const roomINput=document.getElementById('room-number') as HTMLInputElement;
        setroomNoInput(roomINput.value);
    }


    return (
        <div className='relative'>
            <div>
                {showRoomId &&
                    (
                        <div className='absolute top-0 left-0 font-amatic text-3xl'>
                            Room Id:{roomID.current}
                        </div>
                    )
                }

            </div>
            <div className='absolute inset-x-0 top-0 flex items-center justify-center min-h-24'>
                <ToolBar selectTool={selecttheTool} websocket={socketRef.current} createRoom={createRoom} leaveRoom={leaveRoom} />
            </div>
            <svg id="svg" className="border border-grey bg-green-200">
                <rect width="100%" height="100%" fill="#bbf7d0"></rect>
            </svg>
            <div className='flex flex-col items-end p-2 cursor-default border border-grey absolute bottom-0 right-0'>
                {names.map((n) => (
                    <People key={n} index={n} />
                ))}
            </div>
            <Modal handleClose={handleClose}
             isOpen={isOpen}
             handleEnter={getRoomNo}
            >
                <JoinRoomModal socket={socketRef.current!} name={name.current} getRoomNo={getRoomNo} getInput={getInput}/>
            </Modal>
        </div>
    );
};

export default WhiteBoard;