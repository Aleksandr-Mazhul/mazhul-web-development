const mapRoot =
  document.getElementById("map-root");

const tooltip =
  document.getElementById("tooltip");

const colors = [
  "#ef476f",
  "#ffd166",
  "#06d6a0",
  "#118ab2",
  "#8338ec",
  "#fb5607",
  "#3a86ff",
  "#ff006e",
  "#8ac926",
  "#ffbe0b"
];

const markerConfig = [
  {
    label: "1",
    title: "Северный",
    url: "https://guide.planetofhotels.com/ru/braziliya/severnyy-region",
    states: [
      "Acre",
      "Amapá",
      "Amazonas",
      "Pará",
      "Rondônia",
      "Roraima",
      "Tocantins"
    ]
  },
  {
    label: "2",
    title: "Центрально-западный",
    url: "https://guide.planetofhotels.com/ru/braziliya/centralno-zapadnyy-region",
    states: [
      "Distrito Federal",
      "Goiás",
      "Mato Grosso",
      "Mato Grosso do Sul"
    ]
  },
  {
    label: "3",
    title: "Северо-восточный",
    url: "https://guide.planetofhotels.com/ru/braziliya/severo-vostochnyy-region",
    states: [
      "Alagoas",
      "Bahia",
      "Ceará",
      "Maranhão",
      "Paraíba",
      "Pernambuco",
      "Piauí",
      "Rio Grande do Norte",
      "Sergipe"
    ]
  }
];

const SVG_NS =
  "http://www.w3.org/2000/svg";

const XLINK_NS =
  "http://www.w3.org/1999/xlink";

let lastPointer =
  {x: 0, y: 0};

const TOOLTIP_GAP =
  10;

const TOOLTIP_VIEWPORT_GAP =
  8;

const positionTooltip = (x, y) => {
  const width =
    tooltip.offsetWidth;

  const height =
    tooltip.offsetHeight;

  const maxLeft =
    window.innerWidth - width - TOOLTIP_VIEWPORT_GAP;

  const left =
    Math.min(
      Math.max(
        x - (width / 2),
        TOOLTIP_VIEWPORT_GAP
      ),
      Math.max(TOOLTIP_VIEWPORT_GAP, maxLeft)
    );

  const preferredTop =
    y - height - TOOLTIP_GAP;

  const fallbackTop =
    y + TOOLTIP_GAP;

  let top =
    preferredTop;

  if (top < TOOLTIP_VIEWPORT_GAP) {
    top = fallbackTop;
  }

  const maxTop =
    window.innerHeight - height - TOOLTIP_VIEWPORT_GAP;

  top =
    Math.min(
      Math.max(top, TOOLTIP_VIEWPORT_GAP),
      Math.max(TOOLTIP_VIEWPORT_GAP, maxTop)
    );

  tooltip.style.left =
    `${left}px`;

  tooltip.style.top =
    `${top}px`;
};

const setupMap = async () => {
  const response =
    await fetch("./assets/brazil.svg");

  const svgText =
    await response.text();

  mapRoot.innerHTML =
    svgText;

  const svgRoot =
    mapRoot.querySelector("svg");

  if (!svgRoot) {
    return;
  }

  svgRoot.id =
    "brazil-map-svg";

  svgRoot.setAttribute(
    "preserveAspectRatio",
    "xMidYMid meet"
  );

  const states =
    svgRoot.querySelectorAll("path");

  states.forEach((state, index) => {
    const color =
      colors[index % colors.length];

    state.style.fill =
      color;

    state.style.stroke =
      "rgba(255,255,255,.25)";

    state.style.strokeWidth =
      ".8";

    state.style.cursor =
      "pointer";

    state.style.transition =
      "opacity .2s ease";

    const stateName =
      state.getAttribute("name")
      || `Регион ${index + 1}`;

    state.addEventListener("mouseenter", () => {
      state.style.opacity = ".82";
      tooltip.textContent = stateName;
      tooltip.classList.add("visible");
      positionTooltip(lastPointer.x, lastPointer.y);
    });

    state.addEventListener("mousemove", (event) => {
      lastPointer =
        {
          x: event.clientX,
          y: event.clientY
        };

      positionTooltip(lastPointer.x, lastPointer.y);
    });

    state.addEventListener("mouseleave", () => {
      state.style.opacity = "1";
      tooltip.classList.remove("visible");
    });
  });

  renderPins(svgRoot);
};

const renderPins = (svgRoot) => {
  svgRoot
    .querySelector("#region-markers")
    ?.remove();

  const markerLayer =
    document.createElementNS(SVG_NS, "g");

  markerLayer.setAttribute(
    "id",
    "region-markers"
  );

  const pinHref =
    new URL("./pin.svg", document.baseURI).href;

  markerConfig.forEach((region) => {
    const targetStates =
      region.states
        .map((name) =>
          svgRoot.querySelector(`path[name="${name}"]`)
        )
        .filter(Boolean);

    if (!targetStates.length) {
      return;
    }

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    targetStates.forEach((statePath) => {
      const box =
        statePath.getBBox();

      minX = Math.min(minX, box.x);
      minY = Math.min(minY, box.y);
      maxX = Math.max(maxX, box.x + box.width);
      maxY = Math.max(maxY, box.y + box.height);
    });

    const centerX =
      (minX + maxX) / 2;

    const centerY =
      (minY + maxY) / 2;

    const link =
      document.createElementNS(SVG_NS, "a");

    link.setAttributeNS(
      XLINK_NS,
      "xlink:href",
      region.url
    );

    link.setAttribute("href", region.url);
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
    link.setAttribute(
      "aria-label",
      `${region.label}. ${region.title}`
    );
    link.classList.add("map-marker-link");

    const pinImage =
      document.createElementNS(SVG_NS, "image");

    pinImage.setAttribute("x", `${centerX - 17}`);
    pinImage.setAttribute("y", `${centerY - 34}`);
    pinImage.setAttribute("width", "34");
    pinImage.setAttribute("height", "34");
    pinImage.setAttribute("href", pinHref);
    pinImage.setAttributeNS(
      XLINK_NS,
      "xlink:href",
      pinHref
    );

    const badge =
      document.createElementNS(SVG_NS, "circle");

    badge.setAttribute("cx", `${centerX + 10}`);
    badge.setAttribute("cy", `${centerY - 30}`);
    badge.setAttribute("r", "10");
    badge.setAttribute("fill", "#ffd166");
    badge.setAttribute("stroke", "rgba(0,0,0,.22)");
    badge.setAttribute("stroke-width", "1");

    const label =
      document.createElementNS(SVG_NS, "text");

    label.setAttribute("x", `${centerX + 10}`);
    label.setAttribute("y", `${centerY - 26.5}`);
    label.setAttribute("text-anchor", "middle");
    label.setAttribute("font-size", "11");
    label.setAttribute("font-weight", "700");
    label.setAttribute("fill", "#101720");
    label.textContent = region.label;

    link.append(pinImage, badge, label);
    markerLayer.append(link);
  });

  svgRoot.append(markerLayer);
};

setupMap();

window.addEventListener("resize", () => {
  if (!tooltip.classList.contains("visible")) {
    return;
  }

  positionTooltip(lastPointer.x, lastPointer.y);
});

window.addEventListener("scroll", () => {
  if (!tooltip.classList.contains("visible")) {
    return;
  }

  positionTooltip(lastPointer.x, lastPointer.y);
});
