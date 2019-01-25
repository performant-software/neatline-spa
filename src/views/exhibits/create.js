import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import ExhibitForm from '../../components/ExhibitForm';
import {createExhibit} from '../../actions';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {strings} from '../../i18nLibrary';
import { Menu, Button } from 'semantic-ui-react'


class ExhibitCreate extends Component {
	componentWillMount() {
		this.props.location.pathname.includes('add') ? this.setState({open: true}) : this.setState({open:false})
	}
	render() {
		const changeLanguage = lng => {
			strings.setLanguage(lng);
			this.setState({});
		}
		const allLanguages = strings.getAvailableLanguages();
		const lngButtons = allLanguages.map((lng) =>
			<Button key={lng} onClick={() => changeLanguage(lng)}>{lng}</Button>
		);
		const props = this.props;
		return (
			<div>
				<Menu size='massive'>
					<Menu.Item header as={Link} to={`${window.baseRoute}/`}><h3>NEATLINE </h3></Menu.Item>
					<Menu.Item> {strings.createExhibit}</Menu.Item>
					<Menu.Item position='right'><div>
						
						{lngButtons}
					</div></Menu.Item>
				</Menu>
				
				<ExhibitForm onSubmit={props.submit}
					submitLabel={strings.create_exhibit}
					disabled={props.loading} 
					fullscreen={true}
					/>
					{props.errored && <p>{strings.create_exhibit_error}</p>}
			</div>
		);
	}
};



const mapStateToProps = state => ({
	loading: state.exhibits.exhibit.loading,
	errored: state.exhibits.exhibit.errored}
);

const mapDispatchToProps = dispatch =>
bindActionCreators({
	submit: createExhibit
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ExhibitCreate);
