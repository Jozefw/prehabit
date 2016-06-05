var myApp = angular.module('pavlove', ['ngRoute']);

// myApp.config(function(uiGmapGoogleMapApiProvider) {
//     uiGmapGoogleMapApiProvider.configure({
//         key: 'AIzaSyCqcFBWN6sYDEuu_cigq3zBU0cBIOA7Xrw',
//         v: '3.23',
//         libraries: 'weather,geometry,visualization'
//     });
// });

// "https://maps.googleapis.com/maps/api/js?key=AIzaSyCqcFBWN6sYDEuu_cigq3zBU0cBIOA7Xrw&callback=initMap"

myApp.config(['$routeProvider', function($routeProvider, $location) {

    $routeProvider
        .when('/', {
            templateUrl: 'user.html',
            controller: 'userController'
        })
        .when('/location', {
            templateUrl: 'location.html',
            controller: 'currentLocationController'
        })
        .when('/destination', {
            templateUrl: 'destination.html',
            controller: 'destinationController'
        })
        .when('/showDestinations', {
            templateUrl: 'showDestinations.html',
            controller: 'showDestinationsController'
        })
        .when('/getGeoLocation', {
            templateUrl: 'getMap.html',
            controller: 'getMapController'
        })
        .otherwise({
            redirectTo: '/'
        });

    $('a').click(function() {
        $('.navbar .active').removeClass('active');
        $(this).parent().addClass('active');
    });
}]);

myApp.controller('userController', ['$scope', '$location', 'myService', function($scope, $location, myService) {

    $scope.createUser = function() {
        var user = {
            firstName: $scope.userFirstName,
            lastName: $scope.userLastName
        };
        myService.serviceUsers.push(user);

        $('.active').removeClass('active').next('li').addClass('active');

        $location.path('/location');
    };

    $scope.resetUser = function() {
        $scope.userForm.$setPristine();
        document.getElementById("userInfo").reset();
    };
}]);

myApp.controller('currentLocationController', ['$scope', '$location', 'myService', function($scope, $location, myService) {

    $scope.createLocation = function() {
        var location = {
            locationPlace: $scope.locationPlace,
            locationStreet: $scope.locationStreet,
            locationCity: $scope.locationCity,
            locationState: $scope.locationState,
        };
        myService.locations.push(location);
        $('.active').removeClass('active').next('li').addClass('active');
        $location.path('/destination');
    };

    $scope.resetLocation = function() {
        $scope.currentLocationForm.$setPristine();
        document.getElementById("userLocation").reset();
    };
}]);

myApp.controller('destinationController', ['$scope', '$location', 'myService', function($scope, $location, myService) {

    $scope.createDestination = function() {
        var destination = {
            destinationPlace: $scope.destinationPlace,
            destinationStreet: $scope.destinationStreet,
            destinationCity: $scope.destinationCity,
            destinationState: $scope.destinationState,
        };

        myService.destinations.push(destination);
        console.log(myService.destinations);

        $('.active').removeClass('active').next('li').addClass('active');

        $location.path('/showDestinations');
    };

    $scope.resetForm = function() {
        $scope.destinationsForm.$setPristine();
        document.getElementById("userDestination").reset();
    };
}]);

myApp.controller('showDestinationsController', ['$scope', '$location', 'myService', function($scope, $location, myService) {
    $scope.destiny = myService.destinations;

    console.log($scope.destiny.destinationStreet);
}]);

myApp.controller('getMapController', ['$scope', function($scope) {

    $scope.getMapLocation = function() {
        $scope.mapInfo = document.getElementById('CoordinatesPlace');

        if (!navigator.geolocation) {
            $scope.mapInfo.innerHTML = "<p> Not Supported</p>";
            return;
        }

        $scope.success = function(position) {
            $scope.latitude = position.coords.latitude;
            $scope.longitude = position.coords.longitude;

            $scope.mapInfo.innerHTML = "The coordinates are: <br/>Longitude  " + $scope.longitude + "<br/>Latitude  " + " " + $scope.latitude + "<br/>";
            $scope.img = new Image();
            $scope.img.src = "https://maps.googleapis.com/maps/api/staticmap?center=" + $scope.latitude + "," + $scope.longitude + "&zoom=19&size=300x300&sensor=false";
            $scope.mapInfo.appendChild($scope.img);
// the google maps version
            $scope.coords = new google.maps.LatLng($scope.latitude, $scope.longitude);
            console.log($scope.coords);

            $scope.options = {
                zoom: 18,
                center: $scope.coords,
                mapTypeControl: false,
                navigationControlOptions: {
                    style: google.maps.NavigationControlStyle.SMALL
                },
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            $scope.map = new google.maps.Map(document.getElementById("maps"), $scope.options);
            $scope.marker = new google.maps.Marker({
                position: $scope.coords,
                map: $scope.map,
                title: "Marker Map"
            });
        };

        $scope.error = function() {
            $scope.mapInfo.innerHTML = "Unable to get location";
        };

        navigator.geolocation.getCurrentPosition($scope.success, $scope.error);

    };

}]);