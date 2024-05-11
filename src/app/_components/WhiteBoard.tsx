'use client'
import React from 'react';
import rough from 'roughjs';

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
    
        let moused :number|Timeout= -1;
        let mousem = -1;
        let interval;
    
        // Use an arrow function to ensure 'this' refers to the component instance
        const mousedown = (event:MouseEvent) => {
            if (moused === -1) {
                this.setState({
                    x1: event.clientX,
                    y1: event.clientY,
                })
                svgElement?.addEventListener('mousemove', mousemove);
                moused = setInterval(whilemousedown(event), 1);
            }
        };

        const mouseup=(event: MouseEvent) =>{
            if (moused != -1) {
                //svgElement?.addEventListener('mousemove', mousemove);
                clearInterval(moused);
                this.makeRectangle(this.state.x1,this.state.y1,(event.clientX-this.state.x1),(event.clientY-this.state.y1));
                console.log(event.clientX);
                moused = -1;
            }
        }

        const mousemove=(e:MouseEvent)=>{
            if(moused!=-1){
                //console.log(e.clientX);
                this.showRectangle(this.state.x1,this.state.y1,(e.clientX-this.state.x1),(e.clientY-this.state.y1));
            }
        }

        const whilemousedown=(event: MouseEvent)=> {

            console.log(this.state);
        }


        svgElement?.addEventListener('mousedown', mousedown);
        svgElement?.addEventListener('mouseup', mouseup);
        svgElement?.addEventListener('mouseout', mouseup);
        // svgElement?.addEventListener('mouseup',()=>{
        //     moused--;
        //     this.mouseEvents(moused);
        // });
    }



    makeRectangle = (x, y, h, w) => {
        console.log("making rectangle");
        const svgElement = document.getElementById('svg');
        if (svgElement instanceof SVGSVGElement) {
            const rc = rough.svg(svgElement);
            let roughNode = rc.rectangle(x, y, h, w); // x, y, width, height
            console.log(roughNode);
            roughNode.onclick = ()=>{
                alert("hello");
            }
            svgElement.appendChild(roughNode); // Append the SVG node to the SVG element
        } else {
            console.error('The element is not an SVG element.');
        }
    };

     showRectangle =async (x, y, h, w) => {
        console.log("showing rectangle");
        const svgElement = document.getElementById('svg');
        if (svgElement instanceof SVGSVGElement) {
            const rc = rough.svg(svgElement);
            let roughNode = rc.rectangle(x, y, h, w); // x, y, width, height
            console.log(roughNode);
            svgElement.appendChild(roughNode);
            setTimeout(()=>{
                console.log('in timeout')
                svgElement.removeChild(svgElement.lastChild)
            },1);
             // Append the SVG node to the SVG element
        } else {
            console.error('The element is not an SVG element.');
        }
    };

    // hello = (event) => {
    //     console.log(event.clientX, " ", event.clientY);
    //     this.makeRectangle(event.clientX, event.clientY);
    // };

    render() {
        return (
            <svg id="svg" className="border border-grey">
                {/* SVG content goes here */}
            </svg>
        );
    }
}

export default WhiteBoard;