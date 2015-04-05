//hide this better

global.LL_MONGODB_CONNECTION_STRING         = process.env.LL_MONGODB_CONNECTION_STRING      || 'mongodb://locallearnersqa:thirstyscholar1@ds043200.mongolab.com:43200/locallearnersqa'

global.LL_MEETUP_OAUTH2_CLIENTID            = process.env.LL_MEETUP_OAUTH2_CLIENTID         || 'h0dl8qkd82gbjan5cpr8plb4jq';
global.LL_MEETUP_OAUTH2_SECRET              = process.env.LL_MEETUP_OAUTH2_SECRET           || 'seagvb265dc9j1vm53q9pvu9r8';

global.LL_ADMINISTRATOR_EMAIL               = process.env.LL_ADMINISTRATOR_EMAIL            || 'locallearnersmeetup@gmail.com';
global.LL_ADMINISTRATOR_PASSWORD            = process.env.LL_ADMINISTRATOR_PASSWORD         || 'thirstyscholar1';

global.LL_ADMINISTRATOR_CONSUMER_KEY        = process.env.LL_ADMINISTRATOR_CONSUMER_KEY     || 'q4kmd7td3041urie6bodfc1ljm';
global.LL_ADMINISTRATOR_CONSUMER_SECRET     = process.env.LL_ADMINISTRATOR_CONSUMER_SECRET  || '4l2hdci02qgc4svjpu97h5tl04';
global.LL_ADMINISTRATOR_REDIRECT_URL        = process.env.LL_ADMINISTRATOR_REDIRECT_URL     || 'http://localhost:5000/meetupServerLinkCallback';

global.LL_ADMINISTRATOR_API_KEY             = process.env.LL_ADMINISTRATOR_API_KEY          || '7d156b614b6d5c5e7d357e18151568';

global.MEETUP_SYNC_INTERVAL_IN_MILLISECONDS = 60000;