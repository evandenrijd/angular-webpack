import angular from 'angular';
import './edit/settings.edit.module';

(function() {
  angular.module('categories.settings', [
    'categories.settings.edit'
  ]);
})();
