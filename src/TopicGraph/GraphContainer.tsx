import React, { forwardRef, Ref } from 'react';

const GraphContainer = forwardRef<HTMLDivElement>((props, ref) => {
    return <div ref={ref} style={{ width: '100%', height: '600px' }} {...props} />;
});


export default GraphContainer;