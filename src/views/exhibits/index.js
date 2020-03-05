import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
//import { fetchExhibits } from '../../reducers/not_refactored/exhibits';
import { resetExhibit } from '../../actions';
import { deleteExhibit } from '../../actions';
import { strings } from '../../i18nLibrary';
import history from '../../history';
import {fetchExhibits} from '../../actions';

class Exhibits extends Component {
  componentWillMount() {
		this.props.dispatch(fetchExhibits());
    this.props.dispatch(resetExhibit());
  }

  createExhibitView =  () => {
	  history.push(`${window.baseRoute}/add`);
  }

  render() {
    const props = this.props;
    // const changeLanguage = lng => {
    //   strings.setLanguage(lng);
    //   this.setState({});
    // }
    // const allLanguages = strings.getAvailableLanguages();
    // const lngButtons = allLanguages.map((lng) =>
    //     <button key={lng} onClick={() => changeLanguage(lng)}>{lng}</button>
    // );
    const showFullViewLinks = window.containerFullMode === false && window.containerFullModeBaseRoute;
    const showReturnLink = !showFullViewLinks && window.containerFullMode === true && window.containerReturnBaseRoute;

    return (
      <div className="browse neatline" role="content">
        <h1><span className="title">Neatline  </span>
        {showFullViewLinks &&
          <a className="o-icon-external public" title="Fullscreen Editor" href={`${window.containerFullModeBaseRoute}`} aria-label="Fullscreen Editor"></a>
        }
        {showReturnLink &&
          <a className="o-icon-compress public" title="Return to Omeka Admins" href={`${window.containerReturnBaseRoute}`} aria-label="Return to Omeka Admin"></a>
        }
        </h1>
        <div id="page-actions">
          {props.userSignedIn &&
            <a className="button"
              icon
              onClick={this.createExhibitView}
            >
              {strings.createExhibit}
            </a>
          }
        </div>
        <div className="browse-controls">
          <nav className="pagination" role="navigation">
            insert pagination here
          </nav>
          <form className="sorting">
            add sorting here
          </form>
        </div>
        <table className="tablesaw tablesaw-stack"> 
          <thead>
            <tr>
              <th>{strings.title}</th>
              <th>{strings.created}</th>
              <th>{strings.public}</th>
              <th>{strings.owner}</th>
            </tr>
          </thead>
          <tbody>
            {props.exhibits.map((exhibit, idx) => (
              <tr key={idx}>
                <td>
                  <b className="tablesaw-cell-label">Title</b>
                  <span className="tablesaw-cell-content">
                  <Link className='ps_n3_exhibitTitle' to={`${window.baseRoute}/show/${exhibit['o:slug']}`} >{exhibit['o:title']}</Link>
                  <ul className="actions">
                    {showFullViewLinks &&
                    <li><a className="o-icon-external public" title="Fullscreen Editor" href={`${window.containerFullModeBaseRoute}/show/${exhibit['o:slug']}`} aria-label="Fullscreen Editor"></a></li>
                    }
                    <li><a className="o-icon-edit" title="Edit" href={`${window.baseRoute}/show/${exhibit['o:slug']}`} aria-label="Edit"></a></li>
                    {props.userSignedIn &&
                    <li>
                      <a className="o-icon-delete"
                      onClick={() => { props.deleteExhibit(exhibit); }}
                      disabled={props.deleteInProgress}
                      >
                      </a>
                    </li>
                    }
                  </ul>
                  </span>
                </td>
                <td>
                  <b className="tablesaw-cell-label">Created</b>
                  <span className="tablesaw-cell-content">
                    {exhibit['o:added']}
                  </span>
                </td>
                <td>
                  <b className="tablesaw-cell-label">Public</b>
                  <span className="tablesaw-cell-content">
                  {exhibit['o:public'] ? strings.yes : strings.no}
                  </span>
                </td>
                <td>
                  <b className="tablesaw-cell-label">Owner</b>
                  <span className="tablesaw-cell-content">
                    {exhibit['o:owner']}
                  </span>
                </td>
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
  deleteExhibit,
  dispatch
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Exhibits);
