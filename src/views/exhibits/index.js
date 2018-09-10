import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
//import { fetchExhibits } from '../../reducers/not_refactored/exhibits';
import { resetExhibit } from '../../reducers/not_refactored/exhibitShow';
import { deleteExhibit } from '../../reducers/not_refactored/exhibitDelete';
import { strings } from '../../i18nLibrary';
import history from '../../history';
import {fetchExhibits} from '../../actions';

class Exhibits extends Component {
  componentWillMount() {
	this.props.dispatch(fetchExhibits());
    this.props.resetExhibit();
  }

  render() {

    const props = this.props;

    const changeLanguage = lng => {
      strings.setLanguage(lng);
      this.setState({});
    }
    const allLanguages = strings.getAvailableLanguages();
    const lngButtons = allLanguages.map((lng) =>
        <button key={lng} onClick={() => changeLanguage(lng)}>{lng}</button>
    );
    return (
      <div>

        <h3><Link to={`${window.baseRoute}/`}>Neatline</Link> | {strings.browseExhibit}</h3>
		<div className="ps_n3_buttonGroup">
	        {props.userSignedIn &&
	          <button onClick={props.createExhibitView}>{strings.createExhibit}</button>
	        }
			{lngButtons}
		</div>
        <table>
          <thead>
            <tr>
              <th>{strings.title}</th>
              {props.userSignedIn &&
                <th></th>
              }
              <th>{strings.created}</th>
              <th>{strings.public}</th>
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
                    <button onClick={() => {props.deleteExhibit(exhibit);}} disabled={props.deleteInProgress}>{strings.delete}</button>
                  </td>
                }
                <td>{exhibit['o:added']}</td>
                <td>{exhibit['o:public'] ? strings.yes : strings.no}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {props.deleteErrored &&
          <p>{strings.delete_exhibit_error}</p>
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
  createExhibitView: () => history.push(`${window.baseRoute}/add`),
  deleteExhibit,
  dispatch
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Exhibits);
