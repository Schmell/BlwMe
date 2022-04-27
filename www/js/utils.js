function showClock() {
    var digital = new Date();
    var hours = digital.getHours();
    var minutes = digital.getMinutes();
    var seconds = digital.getSeconds();
    if (minutes <= 9) {
      minutes = "0" + minutes;
    }
    if (seconds <= 9) {
      seconds = "0" + seconds;
    }
    document.querySelector("#clock").textContent = `${hours}:${minutes}:${seconds}`;
    setTimeout(showClock, 1000);
  } // showClock
  showClock();