import $ from "jquery";
import 'bootstrap/dist/css/bootstrap.css'; //FIXME for production, add instead import 'bootstrap/dist/css/bootstrap.min.css';

import angular from 'angular';
import ngAnimate from 'angular-animate';
import normalize from 'normalize.css';

import '../assets/css/gecopa.css';
import '../assets/css/animations.css';

import './categories/categories';
import './categories/concours/concours';
import './categories/settings/settings';

import './common/models/concours-model';
import './common/models/categories-model';
import './common/models/users-model';

let app = () => {
  return {
    template: require('./app.html'),
    controller: 'GecopaCtrl',
    controllerAs: 'gecopa'
  }
};

class GecopaCtrl {
  constructor(ConcoursModel) {
    let self = this;
    ConcoursModel.getConcours().then(function (concours) {
      self.concours = concours;
    });
    this.date = new Date();
  }
}

const gecopa = 'app';

angular.module(gecopa, [
  ngAnimate,
  'ui.router',
  'categories',
  'categories.concours',
  'categories.settings'])
  .directive('app', app)
  .controller('GecopaCtrl', GecopaCtrl);

export default gecopa;
