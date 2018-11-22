var time = null;
document.body.onmousemove = function() {
  clearTimeout(time);
  timeOut();
};
document.body.onmouseup = function() {
  clearTimeout(time);
  timeOut();
};
function timeOut() {
  time = setTimeout(function() {
    localStorage.clear();
    window.location.href = "./login.html#/login";
  }, 1000 * 60 * 30);
}
