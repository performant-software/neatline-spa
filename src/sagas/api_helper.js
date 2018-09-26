import {format} from 'date-fns';

export const exhibitsEndpoint = 'neatline_exhibits';
export const recordsEndpoint = 'neatline_records';

export const urlFormat = (endpoint, params = {}, id = null) => {
	const apiRoot = '/api/';
	if (window.jwt && !params.hasOwnProperty('jwt') && (window.jwt !== null && window.jwt !== 'null') )
		params.jwt = window.jwt;
	const urlParams = new URLSearchParams(params);
	let url = apiRoot + endpoint;
	if (id)
		url += '/' + id;
	let paramsString = urlParams.toString();
	if (paramsString.length > 0)
		url += '?' + paramsString;
	return url;
}

export const parseExhibitsJSON = response => {
	return response.json().then(exhibits => {
		exhibits.forEach(exhibit => {
			if ('o:owner' in exhibit)
				exhibit['o:owner'] = exhibit['o:owner']['@id'];
			if ('o:added' in exhibit)
				exhibit['o:added'] = format(exhibit['o:added']['@value'], 'MMM D, YYYY');
			}
		);
		return exhibits;
	});
}

export const parseRecordsJSON = response => {
	return response.json().then(records => {
		records.forEach(formatRecord);
		return records;
	});
}

export const parseRecordJSON = response => {
	return response.json().then(record => {
		formatRecord(record);
		return record;
	});
}

const formatRecord = record => {
	if ('o:owner' in record)
		record['o:owner'] = record['o:owner']['@id'];
	if ('o:added' in record)
		record['o:added'] = format(record['o:added']['@value'], 'MMM D, YYYY');
	if ('o:coverage' in record)
		record['o:coverage'] = JSON.parse(record['o:coverage']);
}
