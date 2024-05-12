import rough from 'roughjs/bin/rough';
import { RoughSVG } from 'roughjs/bin/svg';

class Circle {
    rc: RoughSVG;
    svgE: SVGSVGElement;

    constructor(svgElement: SVGSVGElement) {
        this.rc = rough.svg(svgElement);
        this.svgE = svgElement;
    }

    makeCircle = (x: number, y: number, w: number) => {
        let roughNode = this.rc.circle(x,y,w); // x, y, width, height (changed order)
        console.log(roughNode);
        roughNode.onclick = () => {
            alert("hello");
        }
        this.svgE.appendChild(roughNode);
    };

    showCircle = async (x: number, y: number, w: number) => {
        let roughNode = this.rc.circle(x,y,w)// x, y, width, height (changed order)
        console.log(roughNode);
        this.svgE.appendChild(roughNode);
        setTimeout(() => {
            console.log('in timeout')
            this.svgE.removeChild(roughNode);
        }, 1);
    };
}

export default Circle;