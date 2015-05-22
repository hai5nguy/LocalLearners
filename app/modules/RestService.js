var restClient  	= new (require(LL_NODE_MODULES_DIR + 'node-rest-client').Client)();

var RestService = (function () {
	return {
		get: CONTEXTPROMISE(get),
		post: CONTEXTPROMISE(post)
	};
	
	/* get usage example:
	
	var RestService = require(LL_MODULES_DIR + 'RestService.js');

    context.RestService = {
        url: url,
        args: {
            headers: { Authorization: 'Bearer ' + context.user.accessToken }
        }
 	};
        
    RestService.get(context)().then(function () {
		var result = context.RestService.result;
	}, reject);
	
	*/

	function get(context, resolve, reject, notify) {
		restClient.get(context.RestService.url, context.RestService.args, function (result) {
			context.RestService.result = result;
			resolve();			
		}).on('error', function (error) {
			context.error = {
				messsage: 'RestService.get error',
				restService_error: error
			};
			reject();
       });
	}
	
	/*  post usage example:
	
	var RestService = require(LL_MODULES_DIR + 'RestService.js');
		
    context.RestService = {
        url: url,
        args: {
            data: {},
            parameters: {},
            headers: {
                Authorization: 'Bearer ' + context.user.accessToken,
                'Content-Type': 'application/json'
            }
        }
    };

    RestService.post(context)().then(function () {
		var result = context.RestService.result;
	}, reject);
		
	*/
	
	function post(context, resolve, reject, notify) {
        restClient.post(context.RestService.url, context.RestService.args, function(result) {
			context.RestService.result = result; 
			resolve();
        }).on('error', function (error) {
			context.error = {
				messsage: 'RestService.post error',
				restService_error: error
			};
			reject();
       });
	}
	
})();

module.exports = RestService;