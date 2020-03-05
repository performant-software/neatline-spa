import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import ExhibitForm from '../../components/ExhibitForm';
import {createExhibit} from '../../actions';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {strings} from '../../i18nLibrary';


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
	
		return (
			<div className="show neatline" role="content">
				<h1>
				<span className="subhead">Neatline</span>
				<span className="title">Create New Exhibit  </span>
				{showFullViewLinks &&
				<a className="o-icon-external public" title="Fullscreen Editor" href={`${window.containerFullModeBaseRoute}/add`} aria-label="Fullscreen Editor"></a>
				}
				{showReturnLink &&
				<a className="o-icon-compress public" title="Return to Omeka Admins" href={`${window.containerReturnBaseRoute}/add`} aria-label="Return to Omeka Admin"></a>
				}
				</h1>
				<div id="page-actions">
				</div>
				<div className="breadcrumbs">
					<a class="o-icon-left" href={`${window.baseRoute}/`}>Back to exhibit browse</a>
				</div>
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
