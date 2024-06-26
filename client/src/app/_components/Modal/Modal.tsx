import { ReactNode, useEffect } from "react";
import ReactPortal from "./ReactPortal";

function Modal({ children, isOpen, handleClose }: { children: ReactNode, isOpen: boolean, handleClose: () => void}) {
    useEffect(() => {

        const modal = document.getElementById('react-portal-modal-container')!;
        modal?.classList.add('z-50');
        modal?.classList.add('absolute');
        modal?.classList.add('inset-0');
        modal?.classList.add('my-auto');
        modal?.classList.add('mx-auto');
        modal?.classList.add('h-32');
        modal?.classList.add('w-64');
        modal?.classList.add('border');
        // modal?.classList.add('border-grey');
        modal?.classList.add('rounded-lg')
        modal?.classList.add('z-40');
        modal?.classList.add('bg-green-300');



        if (isOpen) {
            const root = document.getElementById('root');
            const dull = document.createElement('div');
            dull.setAttribute('id', 'dull');
            dull.classList.add('absolute');
            dull.classList.add('inset-0');
            dull.classList.add('bg-black');
            dull.classList.add('opacity-50');
            root?.appendChild(dull);
        }

        const closeOnEscapeKey = (e: KeyboardEvent) => e.key === "Escape" ? handleClose() : null;
          
        document.body.addEventListener("keydown",closeOnEscapeKey);

        return () => {
            document.body.removeEventListener("keydown", closeOnEscapeKey);
        };

 
    },);

    if (!isOpen) return null;

    return (
        <ReactPortal wrapperId="react-portal-modal-container">
            <div id="modal" className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-green-400 rounded-lg shadow-lg p-6 w-64">
                    {children}
                </div>
            </div>
        </ReactPortal>

    )
}

export default Modal;