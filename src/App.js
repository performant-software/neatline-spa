import React, { Component } from 'react';
import './App.css';
import ExhibitBrowse from './ExhibitBrowse';
import ExhibitPublic from './ExhibitPublic';
import ApiClient from './ApiClient';

class App extends Component {
  state = {
    exhibits: [],
    currentExhibit: null,
    mode: 'browse'
  };

  constructor(props) {
    super(props);

    ApiClient.loadExhibits(exhibits => {
      this.setState({
        exhibits: exhibits
      });
    });

    this.showExhibitBrowse = this.showExhibitBrowse.bind(this);
    this.showExhibitPublic = this.showExhibitPublic.bind(this);
  }

  showExhibitBrowse() {
    this.setState({
      mode: 'browse'
    });
  }

  showExhibitPublic(exhibit) {
    this.setState({
      currentExhibit: exhibit,
      mode: 'public'
    });
  }

  render() {
    const { mode, exhibits, currentExhibit } = this.state;

    let view = null;
    switch (mode) {
      case 'public':
        view = <ExhibitPublic exhibit={currentExhibit} returnClick={this.showExhibitBrowse} />
        break;
      case 'browse':
      default:
        view = <ExhibitBrowse exhibits={exhibits} exhibitClick={this.showExhibitPublic} />
        break;
    }

    return (
      <div className='App'>
        {view}
      </div>
    );
  }
}

export default App;
