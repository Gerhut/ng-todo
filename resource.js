angular
  .module('todo.app')
  .factory('todoResource', ['$resource', '$location',
  	function ($resource, $location) {
      return $resource('http://' + $location.host() + ':8000/:id',
        { id: '@id' },
        { 'update': { method: 'PUT' } });
  	}])