'use client'
import React from 'react';
import ToolBar from './ToolBar';
import rough from 'roughjs/bin/rough';
import { RoughSVG } from 'roughjs/bin/svg';
import Shape from '@/Shapes/Shapes';
import Rectangle from '@/Shapes/Rectangle';
import Circle from '@/Shapes/Circle';
import stringify from 'json-stringify-safe';

interface State {
    x1: number,
    y1: number,
    tool: Shape | null,
    x2: number,
    y2: number,
    message:Object,
}

class WhiteBoard extends React.Component<{}, State> {
    rect: Rectangle;
    circle: Circle;
    socket: WebSocket;
    constructor(props) {
        super(props);
        this.state = {
            x1: 0,
            y1: 0,
            tool: null,
            x2: 0,
            y2: 0,
            message:'',
        };
    }

    componentDidMount() {

        this.initWebSocket();
        const svgElement = document.getElementById('svg');
        if (svgElement instanceof SVGSVGElement) {
            const height = (window.screen.height - 110).toString();
            const width = (window.screen.width - 75).toString();
            svgElement.setAttribute('height', height);
            svgElement.setAttribute('width', width);
        } else {
            console.error('The element is not an SVG element.');
        }

        this.rect = new Rectangle(svgElement);
        this.circle = new Circle(svgElement);

        let moused: number | NodeJS.Timeout = -1;
        let mousem = -1;
        let interval;

        // Use an arrow function to ensure 'this' refers to the component instance
        const mousedown = (event: MouseEvent) => {
            if (moused === -1) {
                this.setState({
                    x1: event.clientX,
                    y1: event.clientY,
                });
                if (this.state.tool) {
                    svgElement?.addEventListener('mousemove', mousemove);
                    moused = setInterval(() => whilemousedown(event), 1);
                }
                else {
                    alert('Select tool');
                }
                // Changed whilemousedown(event) to () => whilemousedown(event)
            }
        };

        const mouseup = (event: MouseEvent) => {
            if (moused !== -1) {
                clearInterval(moused);
                //this.circle.makeCircle(this.state.x1, this.state.y1, (event.clientX - this.state.x1));
                this.state.tool?.makeShape(this.state.x1, this.state.y1, (event.clientX - this.state.x1), (event.clientY - this.state.y1));
                this.setState({
                    x2: event.clientX,
                    y2: event.clientY,
                });
                console.log(event.clientX);

                // const data={
                //     x1:this.state.x1,
                //     x2:this.state.x2,
                //     y1:this.state.y1,
                //     y2:this.state.y2,
                //     tool:'',
                // }

                let data:Object;
                const saveButton = document.getElementById('save');
                //saveButton?.addEventListener('click', () => {
                    if (svgElement) {
                        data={
                            x1:this.state.x1,
                            x2:event.clientX,
                            y1:this.state.y1,
                            y2:event.clientY,
                            tool:this.state.tool instanceof Rectangle?'Rectangle':'Circle',
                        }

                        console.log(data, "data sending");
                    }
                    if (this.socket?.OPEN) {
                        this.socket.send(JSON.stringify(data));
                    }
                //})

                moused = -1;
            }
        };

        const mousemove = (e: MouseEvent) => {
            if (moused !== -1) {
                //this.circle.showCircle(this.state.x1, this.state.y1, (e.clientX - this.state.x1));
                this.state.tool?.showShape(this.state.x1, this.state.y1, (e.clientX - this.state.x1), (e.clientY - this.state.y1)) // Added svgElement as the last argument
            }
        };

        const whilemousedown = (event: MouseEvent) => {
            console.log(this.state);
        };

        svgElement?.addEventListener('mousedown', mousedown);
        svgElement?.addEventListener('mouseup', mouseup);
        svgElement?.addEventListener('mouseout', mouseup);


    }

    initWebSocket() {
        this.socket = new WebSocket('ws://localhost:8080');
        this.socket.onopen = () => {
            console.log('connected to websocket');
            //this.socket.send('hello');
        };
        this.socket.onmessage = (ev: MessageEvent) => {
            console.log("message aaya hai");
            console.log(JSON.parse(ev.data));
            this.setState({ message: JSON.parse(ev.data) });
            console.log(this.state.message);
            if(JSON.parse(ev.data).tool){
                this.executeMessage(JSON.parse(ev.data));
            }
        };
    }

    executeMessage = (data:Object) =>{
        console.log('making shapes',this.state.message);
        switch(data.tool){
            case 'Rectangle':
                this.rect.makeShape(data.x1,data.y1,data.x2-data.x1,data.y2-data.y1);
                break;
            case 'Circle':
                this.circle.makeShape(data.x1,data.y1,data.x2-data.x1,data.y2-data.y1);
                break;
        }
    }

    selecttheTool = (tool: string) => {
        console.log('the selected tool is ', tool)
        if (tool === 'rectangle') {
            
            this.setState({
                tool: this.rect,
            })
        }
        else if (tool === 'circle') {
            this.setState({
                tool: this.circle,
            })
        }
    }


    render() {
        return (
            <div>
                <div className='absolute inset-x-0 top-0 flex items-center justify-center min-h-24'>
                    <ToolBar selectTool={this.selecttheTool} />
                </div>

                <svg id="svg" className="border border-grey">
                    {/* SVG content goes here */}
                </svg>
            </div>

        );
    }
}

export default WhiteBoard;