'use client';
import React from "react";

function People({index}:{index:string}){
    //console.log(index);
    let colors:string[];
    colors=['emerald-400','lime-600','amber-500','green-600','teal-500','indigo-600'];
    return(
        <div className="p-2">
            <div className={`flex items-center justify-center h-12 w-12 rounded-full bg-teal-500 opacity-50 shadow hover:opacity-70`} title="Taksh">
                <span className="text-black font-bold text-l opacity-100">{index.charAt(0).toUpperCase()}</span>
            </div>
        </div>
        
    )
}

export default People;