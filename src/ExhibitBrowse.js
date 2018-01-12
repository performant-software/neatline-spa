import React, { Component } from 'react';

class ExhibitBrowse extends Component {
  render() {
    const { exhibits, exhibitClick } = this.props;

    const exhibitRows = exhibits.map((exhibit, idx) => (
      <tr key={idx}>
        <td>{exhibit['o:title']}<br/>
          <button onClick={() => exhibitClick(exhibit)}>Public View</button>
        </td>
        <td>{exhibit['o:added']}</td>
        <td>{exhibit['o:public'] ? 'Yes' : 'No'}</td>
      </tr>
    ));

    return (
      <div id="exhibit-browse">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Created</th>
              <th>Public</th>
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
