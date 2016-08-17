import $ from "jquery";
import 'angular-material/angular-material.css';
import '../assets/css/gecopa.css';

import angular from 'angular';
import ngAnimate from 'angular-animate';
import ngMaterial from 'angular-material';

import './common/models/concours.service';

var categoryConstructor = function(spec, my) {
  let self = {};
  let data = spec;
  let shared = my;

  // shared.$log.debug('ctor called: ', spec);

  let displayName = function() {
    return data && data.name;
  };

  let getName = function() {
    return data && data.name;
  }

  let getIcon = function() {
    return data && data.icon;
  }

  let getId = function() {
    return data && data.id;
  }

  self.displayName = displayName;
  self.getName = getName;
  self.getIcon = getIcon;
  self.getId = getId;

  return self;
};


(function () {

  angular.module('gecopa', [
    ngAnimate,
    ngMaterial,
    'gecopa.models.concours',
  ])
    .config(function($mdThemingProvider) { //ngMaterial theme
      $mdThemingProvider.theme('default')
        .primaryPalette('indigo');
    })
    .controller('GecopaController', GecopaController)
    .run(function() {
      let date = new Date();
      console.debug('app bootstrapped at ' + date);
    });

  function GecopaController($mdSidenav, $log, concoursService) {
    let self = {};

    //private variables
    let selected = null;

    var categories = (function() {
      let categories_core = [
        {
          id: 0,
          name: 'concours',
          icon: 'home'
        },
        {
          id: 1,
          name: 'users',
          icon: 'people'
        },
        {
          id: 2,
          name: 'settings',
          icon: 'settings'
        },
      ];

      let self = {};
      let categories = categories_core.map((c) => {
        return categoryConstructor(c, {$log});
      });

      let getCategories = function () {
        return categories;
      }
      self.getCategories = getCategories;

      return self;
    })();

    function toggleCategories() {
      $mdSidenav('left').toggle();
    }

    function selectCategory(category) {
      $log.debug('category: ', category, ' is selected');
      selected = category;
    }

    function getSelectedCategory() {
      return selected;
    }

    let concours = function() {
      let self = {};
      let concours;

      concoursService.loadAllConcours().then(result => {
        concours = result;
      });

      let getConcours = function() {
        return concours;
      }

      self.getConcours = getConcours;
      return self;
    }();

    //public API
    self.toggleCategories = toggleCategories;
    self.selectCategory = selectCategory;
    self.getSelectedCategory = getSelectedCategory;
    self.getCategories = categories.getCategories;
    self.getConcours = concours.getConcours;

    return self;
  }

})();
