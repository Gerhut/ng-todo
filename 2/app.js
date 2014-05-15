angular
  .module('todo.app', [])
  .value('myCalculator', 2)
  //.constant('myCalculator', 1)
  .run(['myCalculator', function (myCalculator) {
    console.log(myCalculator)
  }])
