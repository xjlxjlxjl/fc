class exit {
  constructor() {
    this.time = null;
    document.body.onmousemove = 
    document.body.onmouseup = () => {
      clearTimeout(this.time);
      timeOut();
    };
  }
  timeOut() {
    this.time = setTimeout(function() {
      localStorage.clear();
      window.location.href = "./login.html#/login";
    }, 1000 * 60 * 60);
  }
}

export default new exit();