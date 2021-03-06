零 起步
-------

一般来说，讲一门技术都要首先用它实现一个“Hello world”。

所以在说明今天的概念之前，先来说一下如何用AngularJS实现一个最基础的“Hello world”。

index.html
```html
<!DOCTYPE html>
<html lang="zh-cn" data-ng-app="todo.app">
<head>
  <meta charset="utf-8">
  <title>todo</title>
</head>
<body>
  <script src="http://cdn.bootcss.com/angular.js/1.2.15/angular.js"></script>
  <script src="app.js"></script>
</body>
</html>
```

app.js
```js
angular
  .module('todo.app', [])
  .run(function () {
    console.log('Hello, world.')
  })
```

打开网页之后，会在控制台中看到`Hello, world.`。

太无聊了，居然都不在网页上直接显示。

我认为太早引入网页上显示的内容会引入太多概念，导致逻辑的混乱。

当年学Java的时候期中考完试才讲图形界面，C语言更是没讲过。所以我觉得AngularJS最好也不要太早引入图形界面。

所以前面几节基本上都要在控制台过活，您就将就将就吧。

下面开始说明这两个文件里面要说明的地方：

index.html文件没什么可说的，都是基本的HTML概念，只有一个地方需要说明：

`data-ng-app` 是一个AngularJS指令，**指令**是在AngularJS中定义过的，可以在HTML文件中直接引用的语法部分。

指令有多种表达方式，我们现在只说其中一种，就是以HTML标签的属性的方式，也就是该`data-ng-app`指令的表达方式：它是一个HTML标签`<html>`的属性。

一个指令通过属性的方式表达的话，它可以有很多很多种写法，现在只说其中常见的三种：

- XML方式：`ng:app`，当文档需要符合XML标准的时候使用，记得在合适的地方声明ng的命名空间`xmlns:ng="http://angularjs.org"`。
- HTML5方式：`data-ng-app`，当文档需要符合HTML5标准的时候使用。
- 普通方式：`ng-app`，当文档什么标准都不需要符合的时候使用。

官方文档一般采用普通方式写属性指令，我更习惯采用HTML5方式写，至少可以让那些不懂AngularJS（但是懂HTML5）的人忽略掉这些属性而不是一个个问你这堆奇怪的属性是怎么回事。

下面说明`ng-app`指令的用途，`ng-app`指令在一个HTML文档中只能有一个，它的用途是标明AngularJS的有效区域，在这个区域外的HTML在AngularJS中是不可见的，你不能通过AngularJS来获取和操作它们。

比如说，如果我把`ng-app`标到`<body>`标签上，那么在`<head>`标签中的`<title>`标签就不能受到AngularJS的控制，我们就不能用AngularJS控制网页的标题。我也不知道将来会不会有控制标题的功能，所以就先放到`<html>`上了。

`ng-app`的值`todo.app`标明了主模块的名字，模块是AngularJS中代码组织的基本单位，主模块可以理解为C语言中的main函数，也可以理解为Java中的主类。当网页加载完成，AngularJS开始工作，他会将主模块加载到内存。

HTML文件讲解结束，还是挺多的。

下面讲解app.js文件。

angular对象和jQuery中的$一样，就是AngularJS的核心对象，所有功能都要从这个对象中调用。

`angular.module`函数定义了一个模块，模块的名字叫`todo.app`，恰好和HTML文件中的主模块的名字相同，所以我们定义的这个模块就是HTML文档的的主模块。

在名字后面有一个空数组，这个数组表明我们的模块不依赖于其他模块，AngularJS在加载一个模块之前，会先加载该模块依赖的模块。模块的依赖可以参照C语言中的`#include`预编译指令或者Java中的`import`语句。

之后我们为执行了该模块的run方法，为该模块声明了run函数，run函数是当AngularJS加载完这个模块之后**由AngularJS调用**的函数。为什么要加粗**由AngularJS调用呢**，下一篇再说。我们在这个函数中向控制台输出了`Hello world`，这样我们就走完了AngularJS的主模块加载过程。

前面我们简要说明了指令和模块的概念，这些概念之后还会详细说明。好像这些知识就够消化一段时间了，那之前这些内容就算第零篇吧。
