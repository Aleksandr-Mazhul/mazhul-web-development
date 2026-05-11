import { initControls } from "./controls.js";
import { initTimeline } from "./timeline.js";
import { initKeyboard } from "./keyboard.js";
import { formatTime } from "./utils.js";
import { initVolume } from "./volume.js";

export function initPlayer() {
  const video = document.getElementById("video");
  const time = document.getElementById("time");

  initControls(video);
  initTimeline(video);
  initKeyboard(video);
  initVolume(video);

  video.addEventListener("loadedmetadata", () => {
    time.textContent =
      `00:00 / ${formatTime(video.duration)}`;
  });

  video.addEventListener("timeupdate", () => {
    time.textContent =
      `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
  });

  const wrapper =
    document.querySelector(".player__video-wrapper");

  const controls =
    document.querySelector(".player__controls");

  let timeout;

  wrapper.addEventListener("mousemove", () => {

    controls.classList.remove("hidden");

    clearTimeout(timeout);

    timeout = setTimeout(() => {

      if (!video.paused) {
        controls.classList.add("hidden");
      }

    }, 2000);

  });

  wrapper.addEventListener("mouseleave", () => {

    if (!video.paused) {
      controls.classList.add("hidden");
    }

  });

  video.addEventListener("pause", () => {
    controls.classList.remove("hidden");
  });
  
}
