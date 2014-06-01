二 服务
-------

这一篇主要说服务。

**服务**是AngularJS代码的主要实现单位，一般用来实现整个应用的业务逻辑。

从上一篇心得可以知道，服务可以注入到AngularJS函数中，这也是服务的主要使用方法。

在上一篇的主模块的run方法中，我们向其注入了两个AngularJS自带的服务$location和$window。在这一篇心得中，我们开始构造自己的服务。

构造服务大体上有五种方法，我们目前只介绍其中的三种。另外两种方法因为牵扯到其它概念，如果写到后面还想得起来的话，再予以阐述。

最简单的方法是使用模块的value方法：直接向服务提供内容。下面我们构造并注入一个简单的服务：

删掉app.js中从第三行开始的部分，并插入如下内容：

```js
  .value('myService', 233)
  .run(['myService', function (myService) {
    console.log(myService)
  }])
```

运行后控制台显示233。我们成功的在run函数中注入了自己定义的第一个服务。

通过value方法定义的服务的值可以是任意值对象：可以是数字、字符串、对象甚至函数。下面我们将这个服务改为一个函数：

将app.js中从第三行开始的部分修改为如下内容：

```js
  .value('myDoubler', function (number) {
    return number * 2
  })
  .run(['myDoubler', function (myDoubler) {
    console.log(myDoubler(233))
  }])
```

运行后控制台显示466。

当AngularJS检测到run函数依赖myDoubler服务的注入时，会查找当前已经定义的名为myDoubler的服务并将其注入到run函数中。我们恰巧定义过一个名为myDoubler的服务，AngularJS会将这个服务的内容，也就是定义的函数对象，注入到run函数中。

下面我们开始将第二种定义服务的方法：使用factory方法定义服务。

factory方法定义的服务的方式是，**由AngularJS执行**一个函数，在该函数中构造服务的内容，最后将服务的内容用return语句返回，下面我们将myDoubler改为用factory方法定义：

将app.js中value方法部分（3-5行）修改为如下内容：

```js
  .factory('myDoubler', function () {
    return function(number) {
      return number * 2
    }
  })
```

刷新页面结果不变，我们成功将myDoubler改为由factory方法定义。

相比value方法，factory方法定义有什么优势呢？

在描述factory方法的时候，我加粗了**由AngularJS**执行的部分。factory方法的函数参数是一个由AngularJS执行的函数。所以，我们也可以向这个函数注入其他的服务。下面我们用factory方法写一个注入了其他服务的服务：

将factory方法和run方法改为如下内容：

```js
  .factory('titleBeautifier', ['$window', function ($window) {
    return function(header, tailer) {
      return header + $window.document.title + tailer
    }
  }])
  .run(['titleBeautifier', function (titleBeautifier) {
    console.log(titleBeautifier('[', ']'))
  }])
```

运行后发现控制台上输出了用方括号包裹的页面标题。

在factory方法的第二个参数中，我们使用了AngularJS函数的数组式写法，向这个函数注入了$window服务并成功获取了页面标题，用服务的内容函数的参数header和tailer将其包裹起来。

这里我们可以发现，使用factory方法，内层函数（服务内容）获取了外层函数（factory定义函数）的参数$window，继而形成了闭包。所以factory方法可以实现服务所需数据的私有化的持久化。我们再举一个计数器服务的例子，将私有化和持久化的意义发挥出来：

将factory方法和run方法改为如下内容：

```js
  .factory('counter', function () {
    var value = 0
    return function(newValue) {
      if (newValue == null) {
        return ++value
      } else {
        value = +newValue
        return value
      }
    }
  })
  .run(['counter', function (counter) {
    console.log(counter())
    console.log(counter(253))
    console.log(counter())
    console.log(counter())
  }])
```

运行后控制台输出

    1
    253
    254
    255

我们通过在服务内容函数访问外层函数的value变量，成功实现了计数器数值的持久化。

关于服务的一个知识点在之前有所提及：**服务是单例的**。我们可以在不同的函数中多次注入这个服务。但是只有在第一次注入时，服务被构建（factory方法的函数被执行）。我们可以通过构造多个服务来证实这一点：

将factory方法和run方法改为如下内容：

```js
  .factory('parent', function () {
    console.log('parent constructed')
    return function () {
      console.log('parent executed')
    }
  })
  .factory('child1', ['parent', function (parent) {
    console.log('child1 constructed')
    parent.value = 2
    return function () {
      parent()
      console.log('child1 executed')
    }
  }])
  .factory('child2', ['parent', function (parent) {
    console.log('child2 constructed')
    return function () {
      parent()
      console.log('child2 executed')
    }
  }])
  .run(['parent', 'child1',
    function (parent, child1, child2) {
      parent()
      child1()
      child2()
      console.log(parent.value)
    }
  ])
```

运行后控制台输出如下：

    parent constructed
    child1 constructed
    child2 constructed
    parent executed
    parent executed
    child1 executed
    parent executed
    child2 executed
    2

我们可以发现，虽然parent服务被多次（child1服务的factory方法，child2服务的factory方法，run函数）依赖并多次执行，但是它只被构造了一次。而且，在构造child1服务时，我们修改了parent服务的value属性，在run函数中输出了parent服务的value属性，发现它们是相同的。说明注入到这些函数中的parent服务是同一个parent服务。

下面我们进入第三个构造方法，与factory方法构造服务类似的方法，用service方法构造。service方法一般用于构造对象型的服务。可以**简单地将其理解为**向service方法传入该服务对象的构造函数。当构造函数执行结束后，该函数的this对象就是服务的内容。下面我们用service构造一个服务：

将factory和run改为如下内容：

```js
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
```

运行后控制台输出444和198。

事实上AngularJS是使用函数的apply方法进行调用的，所以构造函数中的譬如*return一个对象代替this*的小技巧均**无法使用**。

三种服务的构造方式介绍完毕，第二篇心得到此就结束了。

