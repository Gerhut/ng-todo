angular
  .module('todo', [])
  .run(function ($location, $window) {
    console.log($location.host())
    console.log($window)
  })
