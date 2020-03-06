import React, {useState} from 'react';

const Breadcrumbs = ({props, returnLink}) => {
    const paddingTop = { padding: (window.containerFullMode === false) ? '0px' : '60px 0 0 0' }
    return (
        <div style={paddingTop} className="breadcrumbs">
            <a className="o-icon-left" href={returnLink}>Back to exhibit browse</a>
        </div>
    )
}

export default Breadcrumbs;