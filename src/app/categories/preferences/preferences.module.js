import angular from 'angular';
import './edit/preferences.edit.module';

(function() {
  angular.module('categories.preferences', [
    'categories.preferences.edit'
  ]);
})();
