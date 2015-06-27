
module.exports = function () {
	
	var self = {};
	
	self.store = {};
	
	self.get = function (identifier) {
		return self.store[identifier];
	};
	
	self.set = function (identifier, value) {
		self.store[identifier] = value;
	};
	
	return self;
	
	//it needs to self check
	/*
    return {
		Authentication: {
			user: null
		},
		Category: {
			all: null
		},
		Database: {
			arg: null,
			args: null,
			query: null
		},
		Error: {
			message: null
		},
		MeetupAdministrator: {
			accessToken: null
		},
		RequestedClass: {
			record: null,
			getId: null,
			list: null,	
			requestList: null,
			newRequest: null,
			userIsInterested: null
		},
		RestService: {
			args: null,
			result: null,
			url: null
		},
		UpcomingClass: {
			class: null,
			classList: null,
			event: null,
			newClass: null,
			savedClass: null
		},
    };
	*/
};

