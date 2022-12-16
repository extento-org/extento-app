import React from 'react';
import states from '@extento.react/states';

const Example = () => {
    const context = states.candidate.use();
    return(
        <div className="fixed top-0 left-0 z-50 w-2 h-2 bg-red-500 rounded-full text-cyan-200">
            EXAMPLE COMPONENT
        </div>
    );
};

export default Example;
