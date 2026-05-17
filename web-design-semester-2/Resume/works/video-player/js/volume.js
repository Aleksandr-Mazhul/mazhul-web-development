import {icons} from "./icons.js";

export function initVolume(video) {

  const volume =
    document.getElementById("volume-slider");

  const progress =
    document.getElementById("volume-progress");

  const muteBtn =
    document.getElementById("mute-btn");

  video.volume = 1;

  progress.style.width = "100%";

  volume.addEventListener("click", (event) => {

    const rect =
      volume.getBoundingClientRect();

    let percent =
      (event.clientX - rect.left) / rect.width;

    percent =
      Math.max(0, Math.min(1, percent));

    video.volume = percent;

    progress.style.width =
      `${percent * 100}%`;

    if (video.volume === 0) {

      video.muted = true;

      muteBtn.innerHTML =
        icons.mute;

    } else {

      video.muted = false;

      muteBtn.innerHTML =
        icons.volume;

    }

  });

}
