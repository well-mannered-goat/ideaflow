import React from "react";

function People({ index }: { index: string }) {

  return (
    <div className="p-2 z-40">
      <div className={`flex items-center justify-center h-12 w-12 rounded-full bg-emerald-400 opacity-50 shadow hover:opacity-70`} title={index}>
        <h1 className="text-black font-bold text-l opacity-100">{index.charAt(0).toUpperCase()}</h1>
      </div>
    </div>
  );
}

export default People;
