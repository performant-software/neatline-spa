import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Menu, Button, Icon, Table } from 'semantic-ui-react';
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
    return (
      <div>
        <Menu size='massive'>
        <Menu.Item header as={Link} to={`${window.baseRoute}/`}><h3>NEATLINE </h3></Menu.Item>
        <Menu.Item>{strings.browseExhibit}</Menu.Item>
        <Menu.Item position='right'><div>
              {props.userSignedIn &&
                <Button
                  icon
                  onClick={this.createExhibitView}
                >
                  {strings.createExhibit}
                  <Icon name="add" />
                </Button>
              }
          {lngButtons}
        </div></Menu.Item>
        </Menu>
        <Table singleLine padded >
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>{strings.title}</Table.HeaderCell>
              
              <Table.HeaderCell>{strings.created}</Table.HeaderCell>
              <Table.HeaderCell>{strings.public}</Table.HeaderCell>
              {props.userSignedIn &&
                <Table.HeaderCell></Table.HeaderCell>
              }
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {props.exhibits.map((exhibit, idx) => (
              <Table.Row key={idx}>
                <Table.Cell>
                  <Link to={`${window.baseRoute}/show/${exhibit['o:slug']}`} >{exhibit['o:title']}</Link>
                </Table.Cell>
                
                <Table.Cell>{exhibit['o:added']}</Table.Cell>
                <Table.Cell>{exhibit['o:public'] ? strings.yes : strings.no}</Table.Cell>
                {props.userSignedIn &&
                  <Table.Cell>
                    <Button
                      onClick={() => { props.deleteExhibit(exhibit); }}
                      disabled={props.deleteInProgress}
                    >
                      {strings.delete}
                    </Button>
                    <Button disabled>
                      Duplicate
                    </Button>
                  </Table.Cell>
                }
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
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
