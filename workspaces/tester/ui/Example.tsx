import React from 'react';

const Example = () => (
    <>
        <div className="top-0 left-0 w-full h-3 bg-black">
            <div className="w-3 h-3 text-white bg-gray-500 rounded-full z-5 top-12 left-12">
                low
            </div>
            <div className="w-3 h-3 text-white bg-green-500 rounded-full z-6 top-12 left-12">
                high
            </div>
        </div>  
        <div className="fixed top-0 left-0 w-full h-3 bg-black">
            <div className="w-3 h-3 text-white bg-gray-500 rounded-full z-5 top-12 left-12">
                low
            </div>
            <div className="w-3 h-3 text-white bg-green-500 rounded-full z-6 top-12 left-12">
                high
            </div>
        </div>
    </>
);

export default Example;
