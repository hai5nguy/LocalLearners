//hide this better

global.LL_ENVIRONMENT                       = process.env.LL_ENVIRONMENT                    || 'development';

global.LL_ENVIRONMENT = 'production';

if (LL_ENVIRONMENT === 'production') {
    global.MEETUP_API_ENDPOINT = 'https://api.meetup.com/2';
} else {
    global.MEETUP_API_ENDPOINT = 'http://localhost:5000/fakemeetupapi';
}

global.LL_MONGODB_CONNECTION_STRING         = process.env.LL_MONGODB_CONNECTION_STRING      || 'mongodb://locallearnersqa:thirstyscholar1@ds043200.mongolab.com:43200/locallearnersqa';

global.LL_SESSION_SECRET                    = process.env.LL_SESSION_SECRET                 || 'session secret';

global.LL_MEETUP_OAUTH2_CLIENTID            = process.env.LL_MEETUP_OAUTH2_CLIENTID         || 'h0dl8qkd82gbjan5cpr8plb4jq';
global.LL_MEETUP_OAUTH2_SECRET              = process.env.LL_MEETUP_OAUTH2_SECRET           || 'seagvb265dc9j1vm53q9pvu9r8';
global.LL_MEETUP_OAUTH2_CALLBACKURL         = process.LL_MEETUP_OAUTH2_CALLBACKURL          || 'http://localhost:5000/authenticate/callback';

global.LL_ADMINISTRATOR_EMAIL               = process.env.LL_ADMINISTRATOR_EMAIL            || 'locallearnersmeetup@gmail.com';
global.LL_ADMINISTRATOR_PASSWORD            = process.env.LL_ADMINISTRATOR_PASSWORD         || 'thirstyscholar1';

global.LL_ADMINISTRATOR_CONSUMER_KEY        = process.env.LL_ADMINISTRATOR_CONSUMER_KEY     || 'q4kmd7td3041urie6bodfc1ljm';
global.LL_ADMINISTRATOR_CONSUMER_SECRET     = process.env.LL_ADMINISTRATOR_CONSUMER_SECRET  || '4l2hdci02qgc4svjpu97h5tl04';
global.LL_ADMINISTRATOR_REDIRECT_URL        = process.env.LL_ADMINISTRATOR_REDIRECT_URL     || 'http://localhost:5000/meetupServerLinkCallback';

global.LL_ADMINISTRATOR_API_KEY             = process.env.LL_ADMINISTRATOR_API_KEY          || '7d156b614b6d5c5e7d357e18151568';

global.LL_MODULES_DIR                       = __dirname + '/modules/';
global.LL_NODE_MODULES_DIR                  = __dirname + '/../node_modules/';

global.MEETUP_SYNC_INTERVAL_IN_MILLISECONDS = 10000;

global.MEETUP_API_URL = {
    AUTHORIZATION:              'https://secure.meetup.com/oauth2/authorize',
    ACCESSTOKEN:                'https://secure.meetup.com/oauth2/access',
    DEFAULT_PHOTO_THUMB_LINK:   'http://photos4.meetupstatic.com/img/noPhoto_50.png',
    MEMBER:                     'https://api.meetup.com/2/member',
    MEMBER_QUERYSTRING:         '/self?&sign=true&photo-host=public&page=20',
    PROFILE:                    'https://api.meetup.com/2/profile'
}


