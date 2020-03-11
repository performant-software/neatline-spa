import React, {Component} from 'react';
// import {Link} from 'react-router-dom';
import ExhibitForm from '../../components/ExhibitForm';
import {createExhibit} from '../../actions';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {strings} from '../../i18nLibrary';
import Menu from '../../components/Menu';
import Breadcrumbs from '../../components/Breadcrumbs';


class ExhibitCreate extends Component {
	componentWillMount() {
		this.props.location.pathname.includes('add') ? this.setState({open: true}) : this.setState({open:false})
	}
	render() {
		// const changeLanguage = lng => {
		// 	strings.setLanguage(lng);
		// 	this.setState({});
		// }
		// const allLanguages = strings.getAvailableLanguages();
		// const lngButtons = allLanguages.map((lng) =>
		// 	<button key={lng} onClick={() => changeLanguage(lng)}>{lng}</button>
		// );
		const props = this.props;
		const showFullViewLinks = window.containerFullMode === false && window.containerFullModeBaseRoute;
		const showReturnLink = !showFullViewLinks && window.containerFullMode === true && window.containerReturnBaseRoute;
	    const paddingTop = { padding: (window.containerFullMode === false) ? '0px' : '60px 1.04167% 36px' }

		return (
			<div className="show neatline" style={paddingTop} role="content">
				<Menu
					pageTitle="Create New Exhibit  "
					linkRefFull={`${window.containerFullModeBaseRoute}/add`}
					linkRefReturn={`${window.containerReturnBaseRoute}/add`}
				/>
				<Breadcrumbs
					returnLink={`${window.baseRoute}/`}
				/>
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
