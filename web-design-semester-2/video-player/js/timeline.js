export function initTimeline(video) {

  const timeline =
    document.querySelector(".timeline");

  const progress =
    document.getElementById("progress");

  let isDragging = false;

  function updateTimeline(event) {

    const rect =
      timeline.getBoundingClientRect();

    let percent =
      (event.clientX - rect.left) / rect.width;

    percent =
      Math.max(0, Math.min(1, percent));

    progress.style.width =
      `${percent * 100}%`;

    video.currentTime =
      percent * video.duration;

  }

  video.addEventListener("timeupdate", () => {

    if (!isDragging) {

      const percent =
        (video.currentTime / video.duration) * 100;

      progress.style.width =
        `${percent}%`;

    }

  });

  timeline.addEventListener("mousedown", (event) => {

    isDragging = true;

    updateTimeline(event);

  });

  window.addEventListener("mousemove", (event) => {

    if (!isDragging) return;

    updateTimeline(event);

  });

  window.addEventListener("mouseup", () => {

    isDragging = false;

  });

}