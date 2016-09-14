import {dump_obj} from '../utils';

(function() {

  let categoryConstructor = function(spec) {
    let self = {};
    let data = spec || {};

    let get = function(attr) {
      return data[attr];
    }

    //getNgUiRouterState give the state string used in ng-ui-router
    let getNgUiRouterState = function() {
      return 'gecopa.admin.' + get('name');
    }

    let toString = function(){
      return dump_obj(data);
    }

    self.get = get;
    self.getNgUiRouterState = getNgUiRouterState;
    self.toString = toString;

    return self;
  };

  let categoryListConstructor = function(spec, my) {

    let categories = [
      {
        id: 1,
        name: 'concours',
        icon: 'home'
      },
      {
        id: 2,
        name: 'drawings',
        icon: 'people'
      },
      {
        id: 3,
        name: 'settings',
        icon: 'save'
      },
      {
        id: 4,
        name: 'preferences',
        icon: 'settings'
      },
    ].map((c) => {
      return categoryConstructor(c, my);
    });

    let getCategories = function () {
      return categories;
    }
    
    //public API
    self.getCategories = getCategories;

    return self;
  }

  angular.module('gecopa.common.category', [
    'gecopa.common.meta'
  ])
    .provider('categoryList', function categoryListProvider() {
      this.$get = function categoryListConstructorFactory($http, $q, $translate, meta) {
        return categoryListConstructor({}, {meta});
      }
    });
  
})();
