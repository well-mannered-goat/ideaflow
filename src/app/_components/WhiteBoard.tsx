'use client'
import React from "react";
import { useEffect } from "react";
import rough from 'roughjs';

function WhiteBoard() {
    useEffect(() => {
        const svgElement = document.getElementById('svg');
        if (svgElement instanceof SVGSVGElement) { // Check if the element is an instance of SVGSVGElement
            const height = (window.screen.height - 110).toString();
            const width = (window.screen.width - 75).toString();
            svgElement.setAttribute('height', height);
            svgElement.setAttribute('width', width);
        } else {
            console.error('The element is not an SVG element.');
        }
    }, []);

    function makeRectangle(x: number, y:number) {
        console.log("making rectangle")
        const svgElement = document.getElementById('svg');
        if (svgElement instanceof SVGSVGElement) { // Check if the element is an instance of SVGSVGElement
            // Your rough.js code here
            const rc = rough.svg(svgElement);
            let roughNode = rc.rectangle(x, y, 50, 50); // x, y, width, height
            console.log(roughNode)
            svgElement.appendChild(roughNode); // Append the SVG node to the SVG element
        } else {
            console.error('The element is not an SVG element.');
        }

    }

    function hello(event: HTMLEvent) {
        console.log(event.clientX," ",event.clientY);
        makeRectangle(event.clientX,event.clientY);
    }

    return (
        <svg id="svg" className="border border-grey" onMouseDown={hello}>

        </svg>
    )
}

export default WhiteBoard;