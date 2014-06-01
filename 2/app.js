angular
  .module('todo.app', [])
  .service('myCalculator', function () {
    this.add = function (a, b) {
      return a + b
    }
    this.minus = function (a, b) {
      return a - b
    }
  })
  .run(['myCalculator', function (myCalculator) {
    console.log(myCalculator.add(123, 321))
    console.log(myCalculator.minus(321, 123))
  }])
