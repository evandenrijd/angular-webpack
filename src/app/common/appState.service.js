import angular from 'angular';
import {dump_obj} from '../utils';

(function(){

  let appStateConstructor = function(spec) {
    let self = spec || {};
    let category = null;

    let getCategory = function() {
      return category;
    }

    let setCategory = function(aCategory) {
      category = aCategory;
    }

    let toString = function(){
      return '{appState: ' + dump_obj({category}) + '}';
    }

    let getStateFromSelectedCategory = function() {
      let state = 'gecopa.admin';
      if (category) {
        state += '.' + category.getName();
      }
      return state;
    }

    self.getCategory = getCategory;
    self.setCategory = setCategory;
    self.toString = toString;
    self.getStateFromSelectedCategory = getStateFromSelectedCategory;

    return self;
  }

  angular.module('gecopa.appState', [])
    .provider('appState', function appStateProvider() {
      this.$get = function appStateConstructorFactory() {
        return appStateConstructor();
      }
    });

})();
