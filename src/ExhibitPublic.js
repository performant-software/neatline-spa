import React, { Component } from 'react';
import ExhibitPublicMap from './ExhibitPublicMap';

class ExhibitPublic extends Component {
  render() {
    const { exhibit, returnClick } = this.props;

    return (
      <div className='exhibit-public'>
        <button onClick={returnClick}>Back to Exhibits</button>
        <h1>{exhibit['o:title']}</h1>
        <ExhibitPublicMap exhibit={exhibit} />
      </div>
    );
  }
}

export default ExhibitPublic;
