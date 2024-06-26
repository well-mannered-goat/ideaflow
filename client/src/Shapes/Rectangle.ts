import rough from 'roughjs/bin/rough';
import { RoughSVG } from 'roughjs/bin/svg';
import Shape from './Shapes';

class Rectangle implements Shape {
    rc: RoughSVG;
    svgE: SVGSVGElement;

    constructor(svgElement: SVGSVGElement) {
        this.rc = rough.svg(svgElement);
        this.svgE = svgElement;
    }

    makeShape = (x: number, y: number, h: number, w: number): void => {
        const roughNode = this.rc.rectangle(x, y, h, w); // x, y, width, height (changed order)
        console.log(roughNode);

        roughNode.firstChild?.addEventListener('mousedown',(event)=>{
            event.stopPropagation();
        })
    
        roughNode.addEventListener('mousedown', (event) => {
            // Stop event propagation to prevent the event from reaching the SVG element
            event.stopPropagation();
    
            alert("hello");
        });
        this.svgE.appendChild(roughNode);
    };
    

    showShape = (x: number, y: number, h: number, w: number): void => {
        const roughNode = this.rc.rectangle(x, y, h, w); // x, y, width, height (changed order)
        console.log(roughNode);
        this.svgE.appendChild(roughNode);
        setTimeout(() => {
            console.log('in timeout');
            this.svgE.removeChild(roughNode);
        }, 1); // Increased timeout to 1000ms for better visibility
    };
}

export default Rectangle;