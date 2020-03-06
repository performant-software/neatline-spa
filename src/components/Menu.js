import React, {useState} from 'react';


const Menu = ({props, pageTitle, linkTitleFull, linkTitleReturn, linkRefFull, linkRefReturn, onClick, strings}) => {

    const widthAdmin = { width: (window.containerFullMode === false) ? '81.25%' : '100%' }
    const showFullViewLinks = window.containerFullMode === false && window.containerFullModeBaseRoute;
    const showReturnLink = !showFullViewLinks && window.containerFullMode === true && window.containerReturnBaseRoute;

    return (
        <div className="neatline-menu">
        <h1 style={widthAdmin}>
            <span className="subhead">Neatline</span>
            <span className="title">{pageTitle}</span>
            {showFullViewLinks &&
            <a className="o-icon-external public" title={linkTitleFull} href={linkRefFull} aria-label={linkTitleFull}></a>
            }
            {showReturnLink &&
            <a className="o-icon-compress public" title={linkTitleReturn} href={linkRefReturn} aria-label={linkTitleReturn}></a>
            }
        </h1>
        <div id="page-actions">
          {props.userSignedIn &&
            <a className="button" onClick={onClick}>
              {strings}
            </a>
          }
        </div>

        </div>
    )
}

export default Menu;