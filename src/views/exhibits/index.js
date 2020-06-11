import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Menu, Button, Table } from 'semantic-ui-react';
import { resetExhibit } from '../../actions';
import { strings } from '../../i18nLibrary';
import {fetchExhibits} from '../../actions';

class Exhibits extends Component {
  componentWillMount() {
		this.props.dispatch(fetchExhibits());
    this.props.dispatch(resetExhibit());
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
        <Menu size='massive'>
        <Menu.Item header as={Link} to={`${window.baseRoute}/`}><h3>NEATLINE </h3></Menu.Item>
        <Menu.Item>{strings.browseExhibit}</Menu.Item>
        <Menu.Item position='right'><div>
          {lngButtons}
        </div></Menu.Item>
        </Menu>
        <Table singleLine padded >
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>{strings.title}</Table.HeaderCell>
              {showFullViewLinks &&
                <Table.HeaderCell></Table.HeaderCell>
              }
              <Table.HeaderCell>{strings.created}</Table.HeaderCell>
              <Table.HeaderCell>{strings.public}</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {props.exhibits.map((exhibit, idx) => (
              <Table.Row key={idx}>
                <Table.Cell>
                  <Link 
                    className='ps_n3_exhibitTitle' 
                    to={`${window.baseRoute}/show/${exhibit['o:slug']}`} 
                  >
                    {exhibit['o:title']}
                  </Link>
                </Table.Cell>
                {showFullViewLinks &&
                  <Table.Cell>
                    <a href={`${window.containerFullModeBaseRoute}/show/${exhibit['o:slug']}`}>{strings.full}</a>
                  </Table.Cell>
                }
                <Table.Cell>{exhibit['o:added']}</Table.Cell>
                <Table.Cell>{exhibit['o:public'] ? strings.yes : strings.no}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  userSignedIn: state.user.userSignedIn,
  exhibits: state.exhibits.exhibits,
  exhibitsLoading: state.exhibits.loading,
  exhibitsErrored: state.exhibits.errored,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchExhibits,
  resetExhibit,
  dispatch
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Exhibits);
