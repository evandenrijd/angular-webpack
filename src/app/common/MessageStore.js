export default class MessageStore {
  constructor() {
    this.messages = [];
  }

  debug(msg) {
    this.messages.push({message: msg, type: 'debug', date: new Date()});
    return this;
  }

  log(msg) {
    this.messages.push({message: msg, type: 'info', date: new Date()});
    return this;
  }

  info(msg) {
    this.messages.push({message: msg, type: 'info', date: new Date()});
    return this;
  }

  success(msg) {
    this.messages.push({message: msg, type: 'info', date: new Date()});
    return this;
  }

  warn(msg) {
    this.messages.push({message: msg, type: 'warn', date: new Date()});
    return this;
  }

  error(msg) {
    this.messages.push({message: msg, type: 'error', date: new Date()});
    return this;
  }

  clearMessages() {
    this.messages = [];
    return this;
  }

  getLastMessage() {
    if (!this.messages.length) return {message: ''};
    return this.messages[this.messages.length -1];
  }
}
