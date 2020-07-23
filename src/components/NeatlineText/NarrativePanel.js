import React, { Component } from 'react';
import './NeatlineText.css';


class NarrativePanel extends Component {

    // constructor( props ) {
    //     super( props );

    //     this.state = {
    //         data: '<p>React is really <em>nice</em>!</p>'
    //     };

    //     this.handleChange = this.handleChange.bind( this );
    //     this.onEditorChange = this.onEditorChange.bind( this );
    // }

    render() {
        return (
            <div className="nl-narrative">
                <h2>Rendered content</h2>
                {/* <div dangerouslySetInnerHTML={ { __html: this.props.data } }></div> */}
            </div>
        );
    }
}

// NarrativePanel.defaultProps = {
//     data: ''
// };

// NarrativePanel.propTypes = {
//     data: PropTypes.string
// };

export default NarrativePanel;
