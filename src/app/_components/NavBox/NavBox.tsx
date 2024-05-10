import React from "react";
import Research from "./Research";
import Timeline from "./Timeline";
import Workspaces from "./Workspaces";
function NavBox(){
    return(
        <div className="flex flex-col items-start p-6">
            <div className="border border-4 border-solid border-black rounded-2xl p-3 w-32 space-y-5">
                <Research />
                <Timeline />
                <Workspaces />
            </div>
        </div>
    )
}

export default NavBox;