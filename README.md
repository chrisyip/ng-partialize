# ng-partialize

Example:

Common logic (`common.js`) :

```js
angular.module('myApp', [])
  .controller('demoCtrl', function ($scope) {
    $scope.query(function (items) {
      $scope.items = items

      $scope.pagination = {
        count: items.length,
        total: getTotal()
      }
    })

    $scope.onClick = function (item) {
      $scope.showDetail(item)
    }
  })
```

Web app A:

```html
<script src="angular.js"</script>
<script src="ng-partialize.js"</script>
<script src="common.js"</script>
<script src="list.js"</script>

<ul ng-controller="demoCtrl">
  <li ng-repeat="item in list" ng-click="onClick(item)">
</ul>

<pagination="pagination">
```

`list.js`:

```js
angular.module('myApp')
  .beforeController('demoCtrl', function ($scope, List) {
    $scope.query = function (cb) {
      return List.query(cb)
    }

    $scope.showDetail = function () { /* do something */ }
  })
  .afterController('demoCtrl', function ($scope) {
    $scope.$watch('items', function (val) {
      if (val) {
        $scope.list = val.map(function (item) { /* do something */ })
      }
    })
  })
```

Web app B:

```html
<script src="angular.js"</script>
<script src="ng-partialize.js"</script>
<script src="common.js"</script>
<script src="article.js"</script>

<section ng-controller="demoCtrl">
  <article ng-repeat="item in articles" ng-click="onClick(item)"></article>
</section>

<pagination="pagination">
```

`article.js`:

```js
angular.module('myApp')
  .beforeController('demoCtrl', function ($scope, Article) {
    $scope.query = function (cb) {
      return Article.query(cb)
    }

    $scope.showDetail = function () { /* do something */ }
  })
  .afterController('demoCtrl', function ($scope) {
    $scope.$watch('items', function (val) {
      if (val) {
        $scope.articles = val.map(function (item) { /* do something */ })
      }
    })
  })
```

# Author

[Chris Yip](https://github.com/chrisyip)
