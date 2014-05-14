angular
  .module('todo.app')
  .controller('todoCtrl', ['$scope', 'todoResource',
    function($scope, todoResource) {
      $scope.items = todoResource.query()

      $scope.show = function (o) {
        console.log(o)
      }

      $scope.add = function () {
        $scope.items.push({
          'text': '',
          'finish': false
        })
      }

      $scope.$on('remove', function (event, item) {
        for (var i = 0, len = $scope.items.length; i < len; i++) {
          if ($scope.items[i] === item) {
            $scope.items.splice(i, 1)
            break;
          }
        }
        item.$remove()
      })

      $scope.$on('add', function (event, item) {
        for (var i = 0, len = $scope.items.length; i < len; i++) {
          if ($scope.items[i] === item) {
            $scope.items[i] = todoResource.save(item)
            break;
          }
        }
      })
    }])