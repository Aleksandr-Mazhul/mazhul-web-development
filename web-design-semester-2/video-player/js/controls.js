import { icons } from "./icons.js";

export function initControls(video) {

  const playBtn =
    document.getElementById("play-btn");

  const muteBtn =
    document.getElementById("mute-btn");

  const fullscreenBtn =
    document.getElementById("fullscreen-btn");

  const speed =
    document.getElementById("speed");

  function syncPlayIcon() {
    playBtn.innerHTML =
      video.paused
        ? icons.play
        : icons.pause;
  }

  function syncMuteIcon() {
    muteBtn.innerHTML =
      video.muted || video.volume === 0
        ? icons.mute
        : icons.volume;
  }

  function syncFullscreenIcon() {
    fullscreenBtn.innerHTML =
      icons.fullscreen;
  }

  syncPlayIcon();
  syncMuteIcon();
  syncFullscreenIcon();

  playBtn.addEventListener("click", () => {

    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }

  });

  muteBtn.addEventListener("click", () => {

    video.muted = !video.muted;
    syncMuteIcon();

  });

  speed.addEventListener("change", () => {

    video.playbackRate =
      Number(speed.value);

  });

  fullscreenBtn.addEventListener("click", () => {

    const wrapper =
      document.querySelector(".player__video-wrapper");

    if (!document.fullscreenElement) {

      wrapper.requestFullscreen();

    } else {

      document.exitFullscreen();

    }

  });

  video.addEventListener("dblclick", () => {

    const wrapper =
      document.querySelector(".player__video-wrapper");

    if (!document.fullscreenElement) {

      wrapper.requestFullscreen();

    } else {

      document.exitFullscreen();

    }

  });

  video.addEventListener("play", syncPlayIcon);
  video.addEventListener("pause", syncPlayIcon);
  video.addEventListener("volumechange", syncMuteIcon);
  document.addEventListener("fullscreenchange", syncFullscreenIcon);
}
