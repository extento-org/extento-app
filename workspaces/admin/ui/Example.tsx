import React from 'react';

const Example = () => (
    <div style={{
        width: 200,
        height: 200,
        position: 'fixed',
        left: 0, top: 0
    }} className="fixed top-0 left-0 w-20 h-20 bg-red-800 rounded-full text-cyan-200">
        <div className="w-3 h-3 mt-10 ml-10 bg-gray-500 rounded-full top-12 left-12 text-cyan-200">
            low
        </div>
        <div className="w-3 h-3 mt-10 ml-10 bg-green-500 rounded-full top-12 left-12 text-cyan-200">
            high
        </div>
    </div>
);

export default Example;
