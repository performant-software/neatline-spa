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
import _ from 'lodash';

class Exhibits extends Component {

  componentWillMount() {
		this.props.dispatch(fetchExhibits());
    this.props.dispatch(resetExhibit());
    this.setState({ column: null, direction: null});
  }

  createExhibitView =  () => {
	  history.push(`${window.baseRoute}/add`);
  }

  handleSort = (clickedColumn) => () => {
    const { column, direction } = this.state

    if (column !== clickedColumn) {
      this.setState({
        column: clickedColumn,
        exhibits: this.props.exhibits.sort(function(a, b) {
          if (clickedColumn === 'o:title' || clickedColumn === 'o:owner'){
            return a[clickedColumn].toUpperCase().localeCompare(b[clickedColumn].toUpperCase());
          } 
          if (clickedColumn === 'o:added'){
            return new Date(a[clickedColumn]) - new Date(b[clickedColumn]);
          } 
          if (clickedColumn === 'o:public'){
            return (a[clickedColumn] === b[clickedColumn])? 0 : a[clickedColumn] ? -1 : 1;
          } else {
            return new Date(a['o:added']) - new Date(b['o:added']);
          }
        }),
        direction: 'ascending',
      })
      return
    }

    this.setState({
      exhibits: this.props.exhibits.reverse(),
      direction: direction === 'ascending' ? 'descending' : 'ascending',
    })
  }


  render() {
    const props = this.props;
    const state = this.state;
    const changeLanguage = lng => {
      strings.setLanguage(lng);
      this.setState({});
    }
    const allLanguages = strings.getAvailableLanguages();
    const lngButtons = allLanguages.map((lng) =>
        <Button key={lng} onClick={() => changeLanguage(lng)}>{lng}</Button>
    );
    const showFullViewLinks = window.containerFullMode === false && window.containerFullModeBaseRoute;
		const showReturnLink = !showFullViewLinks && window.containerFullMode === true && window.containerReturnBaseRoute;

    return (
      <div>
        <Menu stackable>
        <Menu.Item header as={Link} to={`${window.baseRoute}/`}>
          <span className="neatline-subhead">Neatline</span>
        </Menu.Item>
        <Menu.Item><h1 className="neatline-title">{strings.browseExhibit}</h1></Menu.Item>
        {showReturnLink &&
        <Menu.Item>
						<a title="Return to Omeka Admin" href={`${window.containerReturnBaseRoute}`} aria-label="Return to Omeka Admin"><Icon name='compress' size='large'/></a>
        </Menu.Item>
        }
        {/* {showFullViewLinks &&
        <Menu.Item>
						<a title="Fullscreen Editor" href={`${window.containerFullModeBaseRoute}`} aria-label="Fullscreen Editor"><Icon name='external alternate' size='large'/></a>
        </Menu.Item>
        } */}
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
        <table className="tablesaw neatline tablesaw-stack" > 
          <thead>
            <tr>
              <th 
                className={state.column === 'o:title' ? state.direction : null}
                onClick={this.handleSort('o:title')}
              >{strings.title} </th>
              <th 
                className={state.column === 'o:added' ? state.direction : null}
                onClick={this.handleSort('o:added')}
              >{strings.created} </th>
              <th
                className={state.column === 'o:public' ? state.direction : null}
                onClick={this.handleSort('o:public')}              
              >{strings.public} </th>
              <th
                className={state.column === 'o:owner' ? state.direction : null}
                onClick={this.handleSort('o:owner')}                
              >{strings.owner} </th>
            </tr>
          </thead>
          <tbody>
            {_.map(props.exhibits, (exhibit, idx) => (
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
