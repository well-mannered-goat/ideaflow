import rough from 'roughjs/bin/rough';
import { RoughSVG } from 'roughjs/bin/svg';
import Shape from './Shapes';

class Circle implements Shape {
    rc: RoughSVG;
    svgE: SVGSVGElement;

    constructor(svgElement: SVGSVGElement) {
        this.rc = rough.svg(svgElement);
        this.svgE = svgElement;
    }

    makeShape = (x: number, y: number, h: number, w: number): void => {
        let roughNode = this.rc.circle(x, y, h);
        roughNode.onclick = () => {
            alert("hello");
        }
        this.svgE.appendChild(roughNode);
    };

    showShape = (x: number, y: number, h: number, w: number): void => {
        let roughNode = this.rc.circle(x, y, h);
        this.svgE.appendChild(roughNode);
        setTimeout(() => {
            this.svgE.removeChild(roughNode);
        }, 1);
    };
}

export default Circle;