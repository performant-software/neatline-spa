import React, { Component } from 'react';
import './NeatlineText.css';


class NarrativePanel extends Component {


    render() {
        return (
            <div className="nl-narrative">
                <h2>Rendered content</h2>
                {/* <div dangerouslySetInnerHTML={ { __html: this.props.data } }></div> */}
            </div>
        );
    }
}

export default NarrativePanel;
