const video = document.getElementById("video");
const range = document.querySelector(".range-time");
const volume = document.getElementById("volume");
const timer = document.getElementById("timer");
let lastVolume = 0.5;

video.addEventListener("loadedmetadata", function () {
  range.max = video.duration;
});

video.addEventListener("timeupdate", function () {
  range.value = video.currentTime;
  timer.textContent = secondsToTime(video.currentTime);
});

range.addEventListener("input", function () {
  video.currentTime = range.value;
});

document.getElementById("play").onclick = function () {
  if (video.paused) {
    video.play();
    this.src = "buttoms/pause.png";
  } else {
    video.pause();
    this.src = "buttoms/play.png";
  }
};

document.getElementById("back").onclick = function () {
  video.currentTime -= 5;
};
document.getElementById("next").onclick = function () {
  video.currentTime += 5;
};

volume.addEventListener("input", function () {
  video.volume = volume.value;
  video.muted = (volume.value == 0);
  document.getElementById("volume_stop").src =
    (volume.value == 0) ? "buttoms/novolume.png" : "buttoms/volume.png";
});

document.getElementById("volume_stop").onclick = function () {
  if (video.muted) {
    video.muted = false;
    volume.value = (lastVolume === 0) ? 0.5 : lastVolume;
    video.volume = volume.value;
    this.src = "buttoms/volume.png";
  } else {
    lastVolume = video.volume;
    video.muted = true;
    volume.value = 0;
    this.src = "buttoms/novolume.png";
  }
};

function secondsToTime(time) {
  const h = Math.floor(time / 3600);
  const m = Math.floor((time % 3600) / 60);
  const s = Math.floor(time % 60);

  return [
    h.toString().padStart(2, "0"),
    m.toString().padStart(2, "0"),
    s.toString().padStart(2, "0")
  ].join(':').replace(/^00:/, '');
}
