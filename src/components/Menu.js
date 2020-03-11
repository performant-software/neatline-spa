import React from 'react'
import PropTypes from 'prop-types'

const Menu = (props) => {

  const widthAdmin = { width: (window.containerFullMode === false) ? '81.25%' : '100%' }
  const showFullViewLinks = window.containerFullMode === false && window.containerFullModeBaseRoute;
  const showReturnLink = !showFullViewLinks && window.containerFullMode === true && window.containerReturnBaseRoute;

  return (
    <div className="neatline-menu">
      <h1 style={widthAdmin}>
          <span className="subhead">Neatline</span>
          <span className="title">{props.pageTitle}</span>
          {showFullViewLinks &&
          <a className="o-icon-external public" title="Fullscreen Editor" href={props.linkRefFull} aria-label="Fullscreen Editor"></a>
          }
          {showReturnLink &&
          <a className="o-icon-compress public" title="Return to Omeka Admin" href={props.linkRefReturn} aria-label="Return to Omeka Admin"></a>
          }
      </h1>
      {props.children}

    </div>
  )
}

Menu.propTypes = {
  pageTitle: PropTypes.string.isRequired,
  linkRefFull: PropTypes.string.isRequired,
  linkRefReturn: PropTypes.string.isRequired
}

export default Menu

// import React, {useState} from 'react';

// const Menu = ({props, pageTitle, linkTitleFull, linkTitleReturn, linkRefFull, linkRefReturn, onClick, buttonText}) => {

//     const widthAdmin = { width: (window.containerFullMode === false) ? '81.25%' : '100%' }
//     const showFullViewLinks = window.containerFullMode === false && window.containerFullModeBaseRoute;
//     const showReturnLink = !showFullViewLinks && window.containerFullMode === true && window.containerReturnBaseRoute;

//     return (
//         <div className="neatline-menu">
//         <h1 style={widthAdmin}>
//             <span className="subhead">Neatline</span>
//             <span className="title">{pageTitle}</span>
//             {showFullViewLinks &&
//             <a className="o-icon-external public" title={linkTitleFull} href={linkRefFull} aria-label={linkTitleFull}></a>
//             }
//             {showReturnLink &&
//             <a className="o-icon-compress public" title={linkTitleReturn} href={linkRefReturn} aria-label={linkTitleReturn}></a>
//             }
//         </h1>
//         <div id="page-actions">
//           {props.userSignedIn &&
//             <a className="button" onClick={onClick}>
//               {buttonText}
//             </a>
//           }
//         </div>

//         </div>
//     )
// }

// export default Menu;