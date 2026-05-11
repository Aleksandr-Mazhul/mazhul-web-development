export function initKeyboard(video) {

  document.addEventListener("keydown", (event) => {

    switch (event.key.toLowerCase()) {

      case " ":
      case "k":

        event.preventDefault();

        if (video.paused) {
          video.play();
        } else {
          video.pause();
        }

        break;

      case "m":

        video.muted = !video.muted;

        break;

      case "f":

        const wrapper =
          document.querySelector(".player__video-wrapper");

        if (!document.fullscreenElement) {
          wrapper.requestFullscreen();
        } else {
          document.exitFullscreen();
        }

        break;

      case "arrowright":

        video.currentTime += 5;

        break;

      case "arrowleft":

        video.currentTime -= 5;

        break;

    }

  });

}
