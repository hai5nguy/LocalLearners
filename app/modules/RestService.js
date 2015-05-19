//var Q               = require(LL_NODE_MODULES_DIR + 'q');

var restClient  	= new (require(LL_NODE_MODULES_DIR + 'node-rest-client').Client)();

var RestService = (function () {
	return {
		post: CONTEXTPROMISE(post)
	}
	
	function post(context, resolve, reject, notify) {
        restClient.post(context.RestService.url, context.RestService.args, function(result) {
			context.RestService.result = result; 
			resolve();
        }).on('error', function (error) {
			context.error = {
				messsage: 'RestService post error',
				restService_error: error
			};
			reject();
       });
	}
	
})();

module.exports = RestService;