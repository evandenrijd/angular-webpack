import {dump_obj} from '../utils';

(function() {

  angular.module('gecopa.common.category', [
    'gecopa.common.meta'
  ])

    .service('gcpCategoryService', function() {
      return categoryListCtor({}, {});
    })

  ;

  function categoryCtor(spec) {
    let self = {};
    let data = spec || {};
    self.get = get;
    self.getNgUiRouterState = getNgUiRouterState;
    self.toString = toString;
    return self;

    function get(attr) {
      return data[attr];
    }

    //getNgUiRouterState give the state string used in ng-ui-router
    function getNgUiRouterState() {
      return 'gecopa.admin.' + get('name');
    }

    function toString(){
      return dump_obj(data);
    }

  };

  function categoryListCtor(spec, my) {
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
      return categoryCtor(c, my);
    });

    //public API
    self.load = load;
    return self;

    function load() {
      return categories;
    }
    
  }
  
})();
