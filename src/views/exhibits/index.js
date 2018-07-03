import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchExhibits } from '../../reducers/not_refactored/exhibits';
import { resetExhibit } from '../../reducers/not_refactored/exhibitShow';
import { deleteExhibit } from '../../reducers/not_refactored/exhibitDelete';

class Exhibits extends Component {
  componentWillMount() {
    this.props.fetchExhibits();
    this.props.resetExhibit();
  }

  render() {
    const props = this.props;

    return (
      <div>
        <h3><Link to={`${window.baseRoute}/`}>Neatline</Link> | Browse Exhibits</h3>
        {props.userSignedIn &&
          <button onClick={props.createExhibitView} style={{ marginRight: '0.5em' }}>Create an Exhibit</button>
        }
        <button onClick={props.fetchExhibits} disabled={props.exhibitsLoading}>Refresh exhibits</button>

        <table>
          <thead>
            <tr>
              <th>Title</th>
              {props.userSignedIn &&
                <th></th>
              }
              <th>Created</th>
              <th>Public</th>
            </tr>
          </thead>
          <tbody>
            {props.exhibits.map((exhibit, idx) => (
              <tr key={idx}>
                <td>
                  <Link to={`${window.baseRoute}/show/${exhibit['o:slug']}`} style={{ marginRight: '0.5em' }}>{exhibit['o:title']}</Link>
                </td>
                {props.userSignedIn &&
                  <td>
                    <button onClick={() => {props.deleteExhibit(exhibit);}} disabled={props.deleteInProgress}>Delete</button>
                  </td>
                }
                <td>{exhibit['o:added']}</td>
                <td>{exhibit['o:public'] ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {props.deleteErrored &&
          <p>Error: exhibit failed to delete</p>
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  userSignedIn: state.user.userSignedIn,
  exhibits: state.exhibits.exhibits,
  exhibitsLoading: state.exhibits.loading,
  exhibitsErrored: state.exhibits.errored,
  deleteInProgress: state.exhibitDelete.loading,
  deleteErrored: state.exhibitDelete.errored
});

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchExhibits,
  resetExhibit,
  createExhibitView: () => push(`${window.baseRoute}/add`),
  deleteExhibit
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Exhibits);
