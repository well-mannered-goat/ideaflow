'use client'
import React from 'react';
import ToolBar from './ToolBar';
import rough from 'roughjs/bin/rough';
import { RoughSVG } from 'roughjs/bin/svg';
import Rectangle from '@/Shapes/Rectangle';
import Circle from '@/Shapes/Circle';

class WhiteBoard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            x1: 0,
            x2: 0,
            y1: 0,
            y2: 0,
        };
    }

    componentDidMount() {
        const svgElement = document.getElementById('svg');
        if (svgElement instanceof SVGSVGElement) {
            const height = (window.screen.height - 110).toString();
            const width = (window.screen.width - 75).toString();
            svgElement.setAttribute('height', height);
            svgElement.setAttribute('width', width);
        } else {
            console.error('The element is not an SVG element.');
        }

        const rect = new Rectangle(svgElement);
        const circle=new Circle(svgElement);

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
                svgElement?.addEventListener('mousemove', mousemove);
                moused = setInterval(() => whilemousedown(event), 1); // Changed whilemousedown(event) to () => whilemousedown(event)
            }
        };

        const mouseup = (event: MouseEvent) => {
            if (moused !== -1) {
                clearInterval(moused);
                circle.makeCircle(this.state.x1, this.state.y1, (event.clientY - this.state.y1)); // Added svgElement as the last argument
                console.log(event.clientX);
                moused = -1;
            }
        };

        const mousemove = (e: MouseEvent) => {
            if (moused !== -1) {
                circle.showCircle(this.state.x1, this.state.y1, (e.clientY - this.state.y1)); // Added svgElement as the last argument
            }
        };

        const whilemousedown = (event: MouseEvent) => {
            console.log(this.state);
        };

        svgElement?.addEventListener('mousedown', mousedown);
        svgElement?.addEventListener('mouseup', mouseup);
        svgElement?.addEventListener('mouseout', mouseup);
    }

    render() {
        return (
            <div>
                <div className='flex items-center justify-start min-h-24'>
                    <ToolBar />
                </div>

                <svg id="svg" className="border border-grey">
                    {/* SVG content goes here */}
                </svg>
            </div>

        );
    }
}

export default WhiteBoard;