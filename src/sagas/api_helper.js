import {format} from 'date-fns';
import session from '../services/session';

export const exhibitsEndpoint = 'neatline_exhibits';
export const recordsEndpoint = 'neatline_records';

const API_ROOT = '/api/';

export const urlFormat = (endpoint, params = {}, id = null) => {
  let url = `${window.baseUrl}${API_ROOT}${endpoint}`;
  if (id) {
    url += '/' + id;
  }

  const jwt = session.restore() || '';
  const urlParams = new URLSearchParams({ ...params, jwt });

  let paramsString = urlParams.toString();
  if (paramsString.length > 0) {
    url += '?' + paramsString;
  }

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
