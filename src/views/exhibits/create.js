import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import ExhibitForm from '../../components/ExhibitForm';
import {createExhibit} from '../../actions';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {strings} from '../../i18nLibrary';
import { Menu, Icon, Breadcrumb, Button } from 'semantic-ui-react'


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
		const showFullViewLink = window.containerFullMode === false && window.containerFullModeBaseRoute;
		const showReturnLink = !showFullViewLink && window.containerFullMode === true && window.containerReturnBaseRoute;

		const props = this.props;
		return (
			<div>
				<Menu stackable>
					<Menu.Item header as={Link} to={`${window.baseRoute}/`}>
						<span className="neatline-subhead">Neatline</span>
					</Menu.Item>
					<Menu.Item>
						<h1 className="neatline-title">{strings.createExhibit}</h1>
					</Menu.Item>
					{showReturnLink &&
					<Menu.Item>
						<a title="Return to Omeka Admin" href={`${window.containerReturnBaseRoute}/add`} aria-label="Return to Omeka Admin"><Icon name='compress' size='large'/></a>
					</Menu.Item>
					}
					{/* {showFullViewLink &&
					<Menu.Item>
						<a title="Fullscreen Editor" href={`${window.containerFullModeBaseRoute}`} aria-label="Fullscreen Editor"><Icon name='external alternate' size='large'/></a>
					</Menu.Item>
					} */}
					<Menu.Item position='right'><div>
						{lngButtons}
					</div></Menu.Item>
				</Menu>
				<Breadcrumb>
					<Breadcrumb.Section href={`${window.baseRoute}/`}>Neatline</Breadcrumb.Section>
					<Breadcrumb.Divider icon='right angle' />
					<Breadcrumb.Section active>New Exhibit</Breadcrumb.Section>
				</Breadcrumb>
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
