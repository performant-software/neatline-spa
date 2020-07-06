import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Menu, Button, Icon } from 'semantic-ui-react';
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
    const changeLanguage = lng => {
      strings.setLanguage(lng);
      this.setState({});
    }
    const allLanguages = strings.getAvailableLanguages();
    const lngButtons = allLanguages.map((lng) =>
        <Button key={lng} onClick={() => changeLanguage(lng)}>{lng}</Button>
    );
    const showFullViewLinks = window.containerFullMode === false && window.containerFullModeBaseRoute;

    return (
      <div>
        <Menu stackable>
        <Menu.Item header as={Link} to={`${window.baseRoute}/`}>
          <span className="neatline-subhead">Neatline</span>
        </Menu.Item>
        <Menu.Item><h1 className="neatline-title">{strings.browseExhibit}</h1></Menu.Item>
        <Menu.Item position='right'><div>
              {props.userSignedIn &&
                <Button
                  icon
                  onClick={this.createExhibitView}
                >
                  {strings.createExhibit}
                   <Icon name="plus" />
                </Button>
              }
          {lngButtons}
        </div></Menu.Item>
        </Menu>
        <table className="tablesaw neatline tablesaw-stack"> 
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
                  <b className="tablesaw-cell-label">{strings.title}</b>
                  <span className="tablesaw-cell-content">
                  <Link className='ps_n3_exhibitTitle' to={`${window.baseRoute}/show/${exhibit['o:slug']}`} >{exhibit['o:title']}</Link>
                  <ul className="actions neatline">
                    {showFullViewLinks &&
                    <li><a title="Fullscreen Editor" href={`${window.containerFullModeBaseRoute}/show/${exhibit['o:slug']}`} aria-label="Fullscreen Editor"><Icon name="external alternate"/></a></li>
                    }
                    <li><a title="Edit" href={`${window.baseRoute}/show/${exhibit['o:slug']}`} aria-label="Edit"><Icon name="pencil alternate" /></a></li>
                    {props.userSignedIn &&
                    <li>
                      <a onClick={() => { props.deleteExhibit(exhibit); }} disabled={props.deleteInProgress} ><Icon name="trash alternate"/></a>
                    </li>
                    }
                  </ul>
                  </span>
                </td>
                <td>
                  <b className="tablesaw-cell-label">{strings.created}</b>
                  <span className="tablesaw-cell-content">{exhibit['o:added']}</span>
                </td>
                <td>
                  <b className="tablesaw-cell-label">{strings.public}</b>
                  <span className="tablesaw-cell-content">{exhibit['o:public'] ? strings.yes : strings.no}</span>
                </td>
                <td>
                  <b className="tablesaw-cell-label">{strings.owner}</b>
                  <span className="tablesaw-cell-content">
                    {/* {exhibit['o:owner']} */}
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
