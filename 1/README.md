一 依赖注入
-----------

**依赖注入**是AngularJS的第一个魔法。它的含义是，当**AngularJS调用**一个函数时，它会将这个函数依赖的**服务**自动注入进来。**服务**的概念比较复杂，目前我们只需要知道**服务是单例的对象**就够了。依赖注入只有对**由AngularJS调用**的函数才有效，请注意翻看上一篇结尾的内容：run函数就是**由AngularJS**调用的，所以我们可以在run函数上体验一把依赖注入：

将run函数（app.js 3-5行）改为如下内容：

```js
  .run(function ($location) {
    console.log($location.absUrl())
  })
```

刷新后发现控制台中显示了完整的URL。

我们可以看到在run函数里多了一个参数叫`$location`，它就是这个函数依赖的服务。AngularJS在调用这个函数的时候，发现这个函数有个参数叫`$location`，就会把`$location`服务注入到函数中，我们就可以在函数中自由地使用这个服务。

我们还可以再注入一个服务，将run函数改为如下内容：

```js
  .run(function ($location, $window) {
    console.log($location.absUrl(), $window.document.title)
  })
```

刷新后发现控制台中显示了完整的URL和页面标题。

这时我们向run函数已经注入了两个服务`$location`和`$window`。

因为参数名字标明了要向函数注入的服务名字，所以参数名字是不能随便改的，如果改成了不存在的服务名，AngularJS会提示错误。

这就会导致一个问题，一般的JavaScript压缩工具为了节省文件长度，会将参数的名字缩短，此时AngularJS根据缩短后的参数名，会找不到服务。我们可以模拟一下这个情况：

```js
  .run(function (a, b) {
    console.log(a.absUrl(), b.document.title)
  })
```

刷新后出错。

为了避免这个问题，在AngularJS中，编写**由AngularJS调用**的函数时，可以使用**完整的数组形式**编写。此时不会出现参数名缩短导致AngularJS找不到要注入的服务的问题。下面我们采用**完整的数组形式**改写run函数：

```js
  .run([
    '$location', // [0]
    '$window',   // [1]
    function ($location, $window) {
      console.log($location.absUrl(), $window.document.title)
    }            // [2]
  ])
```

刷新页面运行正常。

当使用完整的数组形式编写AngularJS函数时，我们将拥有n个注入参数的函数体放到数组的最后一个（第[n]个）位置。在之前的n个（第[0]个到第[n-1]个）位置中，我们依次放入用字符串的形式表示的服务名。因为字符串不会被Javascript压缩工具压缩，所以此时我们（JavaScript压缩工具）可以随意的压缩参数名：

```js
  .run([
    '$location', // [0]
    '$window',   // [1]
    function (a, b) {
      console.log(a.absUrl(), b.document.title)
    }            // [2]
  ])
```

刷新页面依然运行正常。

以上就是AngularJS依赖注入的基本概念，第一篇心得结束啦。

