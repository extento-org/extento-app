import React from 'react';
import states from '@ex.react/states';

import '@app.layer/__template__/styles/index.css';

const Example = () => {
    const context = states.__template__.use();
    React.useEffect(() => {
        setTimeout(() => {
            context.set('other', (last) => ({ second: 'ok' }))
        }, 4000)
    }, [])
    console.log(context.state);
    return(
        <div className="fixed top-0 left-0 z-50 w-2 h-2 bg-red-500 rounded-full text-cyan-200">
            EXAMPLE COMPONENT
        </div>
    );
};

export default Example;
