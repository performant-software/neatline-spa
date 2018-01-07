import React from 'react';
import ApiClient from './ApiClient';

class ExhibitBrowse extends React.Component {
  state = {
    exhibits: []
  };

  constructor(props) {
    super(props);

    ApiClient.loadExhibits(exhibits => {
      this.setState({
        exhibits: exhibits
      });
    });
  }

  render() {
    const { exhibits } = this.state;

    const exhibitRows = exhibits.map((exhibit, idx) => (
      <tr key={idx}>
        <td>{exhibit.slug}</td>
        <td>{exhibit.title}</td>
      </tr>
    ));

    return (
      <div id="exhibit-browse">
        <table>
          <thead>
            <tr>
              <th>Slug</th>
              <th>Title</th>
            </tr>
          </thead>
          <tbody>
            {exhibitRows}
          </tbody>
        </table>
      </div>
    );
  }
}

export default ExhibitBrowse;
