import rough from 'roughjs/bin/rough';
import { RoughSVG } from 'roughjs/bin/svg';
import Shape from './Shapes';

class Circle implements Shape{
    rc: RoughSVG;
    svgE: SVGSVGElement;

    constructor(svgElement: SVGSVGElement) {
        this.rc = rough.svg(svgElement);
        this.svgE = svgElement;
    }

    makeShape = (x: number, y: number, h: number, w: number):void => {
        let roughNode = this.rc.circle(x, y, h); // x, y, width, height (changed order)
        console.log(roughNode);
        roughNode.onclick = () => {
            alert("hello");
        }
        this.svgE.appendChild(roughNode);
    };

    showShape = (x: number, y: number, h: number, w: number):void => {
        let roughNode = this.rc.circle(x, y, h); // x, y, width, height (changed order)
        console.log(roughNode);
        this.svgE.appendChild(roughNode);
        setTimeout(() => {
            console.log('in timeout')
            this.svgE.removeChild(roughNode);
        }, 1);
    };
}

export default Circle;