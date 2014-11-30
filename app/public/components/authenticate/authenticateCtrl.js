localLearnerApp.controller('AuthenticateCtrl', function ($routeParams, $location, MeetupProfile) {
    console.log('routeparam', $routeParams);
    console.log('location.hash', $location.hash());
    console.log('location.search', $location.search());

    console.log('location', $location);

//    var accessToken = parseMeetupTokenHash($location.hash());

//    console.log('accesstoken', accessToken);

    MeetupProfile.importTokenFromHash($location.hash());

    console.log('meetupprofiletoken', MeetupProfile.accessToken);

    $location.url('/');
});

//function parseMeetupTokenHash(hashString) {
//    var pairs = hashString.split('&');
//    return {
//        key: pairs[2].split('=')[1]
//    }
//}