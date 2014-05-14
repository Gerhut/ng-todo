angular
  .module('todo.app', [])
  .run(['$location', '$window', function (a, b) {
    console.log(a.absUrl(), b.document.title)
  }])
