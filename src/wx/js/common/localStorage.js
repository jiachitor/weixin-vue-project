'use strict';

export default localStorage = {
  get(key) {
    return JSON.parse(localStorage.getItem(key) || '[]');
  },
  set(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  },
  has(key) {
    var d = this.get(key);
    if(typeof(d) === 'undefined' || d == null){
        return false;
    }else{
        return true;
    }
  }
}
