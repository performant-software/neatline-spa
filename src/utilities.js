import uuid from 'uuid-random';
export const generateUUID = () =>{
	return uuid();
};

// Returns true if the passed string is falsey
export const isEmpty = (str) => !str || str.length === 0;
