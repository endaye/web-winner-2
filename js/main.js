var localStorag = window.localStorage;
function getLocalStorage(key) {
  return localStorag.getItem(key);
}

function setLocalStorage(key, val) {
  return localStorag.setItem(key, val);
}
