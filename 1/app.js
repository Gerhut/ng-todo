angular
  .module('todo.app', [])
  .run([
    '$location', // [0]
    '$window',   // [1]
    function (a, b) {
      console.log(a.absUrl(), b.document.title)
    }            // [2]
  ])
