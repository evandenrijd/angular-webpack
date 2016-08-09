import angular from 'angular';
import 'angular-toastr/dist/angular-toastr.min.css';
import ngAnimate from 'angular-animate';
import toastr from 'angular-toastr';

import './settings';
import MessageStore from './MessageStore';

let ToasterMixin = (superclass) => class extends superclass {
  constructor(deps) {
    super(deps);
    this.settings = deps.settings;
    this.toastr = deps.toastr;
  }

  info(...args) { //accepts arguments as message, title in toastr
    if (this.settings.get('popupMessaging')) this.toastr.info(...args);
    return super.info(...args);
  }

  success(...args) { //accepts arguments as message, title in toastr
    if (this.settings.get('popupMessaging')) this.toastr.success(...args);
    return super.success(...args);
  }

  warn(...args) { //accepts arguments as message, title in toastr
    if (this.settings.get('popupMessaging')) this.toastr.warning(...args);
    return super.warn(...args);
  }

  error(...args) { //accepts arguments as message, title in toastr
    if (this.settings.get('popupMessaging')) this.toastr.error(...args);
    return super.error(...args);
  }

};

let AngularMixin = (superclass) => class extends superclass {
  constructor(deps) {
    super(deps);
    this.$log = deps.$log;
    this.settings = deps.settings;
  }

  debug(...args) {
    if (this.settings.get('consoleOut')) this.$log.debug(...args);
    return super.debug(...args);
  }

  log(...args) {
    if (this.settings.get('consoleOut')) this.$log.log(...args);
    return super.log(...args);
  }

  info(...args) {
    if (this.settings.get('consoleOut')) this.$log.info(...args);
    return super.info(...args);
  }

  success(...args) {
    if (this.settings.get('consoleOut')) this.$log.info(...args);
    return super.success(...args);
  }

  warn(...args) {
    if (this.settings.get('consoleOut')) this.$log.warn(...args);
    return super.warn(...args);
  }

  error(...args) {
    if (this.settings.get('consoleOut')) this.$log.error(...args);
    return super.error(...args);
  }

};

class InformalMessenger extends AngularMixin(MessageStore) {
  constructor(deps) {
    super(deps);
  }
};

class TransactionMessenger extends ToasterMixin(AngularMixin(MessageStore)) {
  constructor(deps) {
    super(deps);

    //We'd like the close button an each toastr
    if (deps.$injector.has('toastrConfig')) {
      deps.toastrConfig.closeButton = true;
      deps.toastrConfig.closeButton = true;
    }

    if (!deps.$injector.has('toastr')) {
      deps.settings.set({consoleOut: true, popupMessaging: false});
      deps.$log.error('No toastr available, fallback on console');
    }
  }

};

angular.module('gecopa.common.messengers', [
  'ngAnimate',
  'toastr',
  'gecopa.common.settings'
])

  .provider('informalMessenger', function InformalMessengerProvider() {
    this.$get = function ($injector, $log, settings) {
      return new InformalMessenger({$injector, $log, settings});
    }
  })

  .provider('transactionMessenger', function TransactionMessengerProvider() {
    this.$get = function ($injector, $log, settings, toastr, toastrConfig) {
      return new TransactionMessenger({$injector, $log, settings, toastr, toastrConfig});
    }
  });

;
