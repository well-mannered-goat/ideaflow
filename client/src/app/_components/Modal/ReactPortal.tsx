import { createPortal } from "react-dom";
import { ReactElement, ReactNode, useEffect, useState, useRef } from "react";

function ReactPortal({ children, wrapperId }: { children: ReactElement; wrapperId: string }) {
    const [isPortalReady, setIsPortalReady] = useState(false);
    const wrapperElement = useRef<Element | null>(null);
    let systemCreated: boolean;
    const createAndAppendElement = () => {
        const element = document.createElement('div');
        element.setAttribute('id', wrapperId);
        document.body.appendChild(element);
        return element;
    }

    useEffect(() => {
        let element = document.getElementById(wrapperId);
        systemCreated = false;

        if (!element) {
            element = createAndAppendElement();
            systemCreated = true;
        }
        wrapperElement.current = element;

        setIsPortalReady(true);

        return () => {
            if (systemCreated && element?.parentNode) {
                element.parentNode.removeChild(element);
            }
        };
    }, [wrapperId]);
    if (isPortalReady) {
        return createPortal(children, wrapperElement.current!);
    }
    return <div>Loading...</div>;
}

export default ReactPortal;
