angular
  .module('todo.item', ['ngTouch', 'ngAnimate'])
  .directive('todoItem', [
    function () {
      return {
        templateUrl: 'todo-item.html',
        replace: true,
        scope: {
          item: '=todoItem'
        },
        controller: ['$scope', function($scope) {
          $scope.editable = !('$update' in $scope.item)
          $scope.edit = function () {
            $scope.editable = true
          }
          $scope.toggleFinish = function () {
            $scope.item.finish = !$scope.item.finish
            $scope.item.$update()
          }
          $scope.remove = function () {
            $scope.$emit('remove', $scope.item)
          }
          $scope.save = function () {
            if ('$update' in $scope.item) {
              $scope.item.$update()
            } else {
              $scope.$emit('add', $scope.item)
            }
            $scope.editable = false
          }
        }]
      }
    }])