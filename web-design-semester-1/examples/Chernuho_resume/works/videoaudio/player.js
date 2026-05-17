const video = document.getElementById("video");
let lastVolume = 0.5;

const rangeTime = document.querySelector(".range-time");
rangeTime.max = video.duration;
rangeTime.min = 0;
rangeTime.oninput = function () {
  video.currentTime = rangeTime.value;
};

playback_rate.innerText = `Скорость: ${video.playbackRate}`;

video.addEventListener("loadeddata", function () {
  range.setAttribute("min", 0);
  range.setAttribute("max", video.duration);
});

document.getElementById("volume_stop").onclick = function () {
  if (video.muted) {
    if (lastVolume === 0) {
      return;
    }
    volume.value = lastVolume;
    video.muted = false;
    this.src = "img/volume.png";
  } else {
    if (lastVolume === 0) {
      return;
    }
    lastVolume = volume.value;
    volume.value = 0;
    video.muted = true;
    this.src = "img/novolume.png";
  }
};

document.getElementById("play").onclick = function () {
  if (video.paused) {
    video.play();
    this.src = "img/pause.png";
  } else {
    video.pause();
    this.src = "img/play.png";
  }
};

document.getElementById("slower").onclick = function () {
  if (video.playbackRate <= 0.25) {
    video.playbackRate = 0.25;
  } else {
    video.playbackRate -= 0.25;
  }
  playback_rate.innerText = `Скорость: ${video.playbackRate}`;
};

document.getElementById("faster").onclick = function () {
  if (video.playbackRate >= 2) {
    video.playbackRate = 2;
  } else {
    video.playbackRate += 0.25;
  }
  playback_rate.innerText = `Скорость: ${video.playbackRate}`;
};

document.getElementById("previous").onclick = function () {
  video.currentTime -= 5;
  if (video.currentTime < 0) video.currentTime = 0;
};
document.getElementById("next").onclick = function () {
  video.currentTime += 5;
  if (video.currentTime > video.duration) video.currentTime = video.duration;
};

var videoEl = document.getElementsByTagName("video")[0];
volume.value = 1;

range.addEventListener(
  "input",
  function () {
    videoEl.currentTime = range.value;
  },
  false
);

volume.addEventListener(
  "input",
  function () {
    videoEl.volume = volume.value;
    if (videoEl.volume == 0) {
      document.getElementById("volume_stop").src = "img/novolume.png";
      video.muted = true;
      lastVolume = 0;
    } else {
      document.getElementById("volume_stop").src = "img/volume.png";
      video.muted = false;
      lastVolume = volume;
    }
  },
  false
);

videoEl.addEventListener(
  "ended",
  function () {
    videoEl.currentTime = 0;
  },
  false
);

videoEl.addEventListener(
  "timeupdate",
  function () {
    timer.innerHTML = secondsToTime(videoEl.currentTime);
  },
  false
);

function secondsToTime(time) {
  if (video.duration == video.currentTime)
    document.getElementById("play").src = "img/again.svg";
  range.value = video.currentTime;
  let fulltime;
  var h = Math.floor(time / (60 * 60)),
    dm = time % (60 * 60),
    m = Math.floor(dm / 60),
    ds = dm % 60,
    s = Math.ceil(ds);
  if (s === 60) {
    s = 0;
    m = m + 1;
  }
  if (s < 10) {
    s = "0" + s;
  }
  if (m === 60) {
    m = 0;
    h = h + 1;
  }
  if (m < 10) {
    m = "0" + m;
  }
  if (h === 0) {
    fulltime = m + ":" + s;
  } else {
    fulltime = h + ":" + m + ":" + s;
  }
  return fulltime;
}
