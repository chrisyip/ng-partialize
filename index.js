/**
 * ng-partialize
 * @author Chris Yip i@chrisyip.im
 * @website https://github.com/chrisyip/ng-partialize
 * @license MIT
 */
!(function (angular) {
  if (!angular) {
    throw new Error('Cannot found angular, make sure angular is attached to global object')
  }

  function getDeps ($injector, $scope, factoryFunction) {
    var annotation = $injector.annotate(factoryFunction)
    var deps = []

    angular.forEach(annotation, function (name) {
      if (name === '$scope') {
        deps.push($scope)
      } else {
        deps.push($injector.get(name))
      }
    })

    return deps
  }

  function controllerWrapper (module, name, context, factoryFunction) {
    var factory = ['$injector', '$scope']

    if (angular.isFunction(factoryFunction)) {
      factory.push(function ($injector, $scope) {
        var before = module._beforeControllers[name]

        if (angular.isArray(before)) {
          angular.forEach(before, function (factory) {
            factory.apply(context, getDeps($injector, $scope, factory))
          })
        }

        factoryFunction.apply(context, getDeps($injector, $scope, factoryFunction))

        var after = module._afterControllers[name]

        if (angular.isArray(after)) {
          angular.forEach(after, function (factory) {
            factory.apply(context, getDeps($injector, $scope, factory))
          })
        }
      })
    }

    return factory
  }

  function registerController (module, type, name, factoryFunction) {
    var collection = module[type]

    if (angular.isArray(collection[name])) {
      collection[name].push(factoryFunction)
    } else {
      collection[name] = [factoryFunction]
    }

    return module
  }

  Object.defineProperty(angular, '_Module', {
    value: angular.module
  })

  angular.module = function (name, deps) {
    var module = angular._Module(name, deps)

    if (!module._ngPartialized) {
      Object.defineProperties(module, {
        _beforeControllers: { value: {} },

        _afterControllers: { value: {} },

        _Controller: {
          value: module.controller
        },

        _ngPartialized: {
          value: true
        }
      })

      module.beforeController = function (name, factoryFunction) {
        return registerController(this, '_beforeControllers', name, factoryFunction)
      }

      module.afterController = function (name, factoryFunction) {
        return registerController(this, '_afterControllers', name, factoryFunction)
      }

      module.controller = function (name, factoryFunction) {
        this._beforeControllers[name] = []
        this._afterControllers[name] = []
        this._Controller(name, controllerWrapper(this, name, this, factoryFunction))

        return this
      }
    }

    return module
  }
})(new Function('return this.angular')())
