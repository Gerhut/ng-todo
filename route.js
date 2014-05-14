angular.module('todo.app')
  .config(['$routeProvider',
    function($routeProvider, $locationProvider) {
      $routeProvider
        .when('/guide', { templateUrl: 'guide.html' })
        .when('/app', { templateUrl: 'app.html' })
        .otherwise({ redirectTo: '/guide' });
  }])