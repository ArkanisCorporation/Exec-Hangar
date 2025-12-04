const settings = {
  // Canonical cadence: 65 minutes online, 120 minutes 0.0699 seconds offline
  openDurationMs: 3900000,
  closeDurationMs: 7200699,  
  cycleNumberOffset: 1,
  initialOpenTime: null,
};

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

function getCycleDuration() {
  return settings.openDurationMs + settings.closeDurationMs;
}

function getElapsedTime(atTime) {
  return atTime.getTime() - settings.initialOpenTime.getTime();
}

function getTimeInCycle(atTime) {
  const cycleDuration = getCycleDuration();
  const elapsed = getElapsedTime(atTime);
  const normalized =
    ((elapsed % cycleDuration) + cycleDuration) % cycleDuration;
  return normalized;
}

function getCycleNumber(atTime) {
  const elapsed = getElapsedTime(atTime);
  return (
    Math.floor(elapsed / getCycleDuration()) + 1 + settings.cycleNumberOffset
  );
}

function getNextStatusChange(currentTime) {
  const cycleDuration = getCycleDuration();
  const timeInCurrentCycle = getTimeInCycle(currentTime);

  if (timeInCurrentCycle < settings.openDurationMs) {
    // hangars are online
    document.title = "PYAM Is Online";
    return {
      status: "ONLINE",
      nextChangeTime: new Date(
        currentTime.getTime() +
          (settings.openDurationMs - timeInCurrentCycle)
      ),
    };
  } else {
    // hangars are offline
    const remainingCloseDuration =
      cycleDuration - timeInCurrentCycle;
    document.title = "PYAM Is Offline";
    return {
      status: "OFFLINE",
      nextChangeTime: new Date(
        currentTime.getTime() + remainingCloseDuration
      ),
    };
  }
}

// Define the thresholds in milliseconds
const thresholds = [
  {
    min: 0,
    max: 12 * 60 * 1000,
    colors: ["green", "green", "green", "green", "green"],
  }, // Online 5G
  {
    min: 12 * 60 * 1000,
    max: 24 * 60 * 1000,
    colors: ["green", "green", "green", "green", "empty"],
  }, // Online 4G1E
  {
    min: 24 * 60 * 1000,
    max: 36 * 60 * 1000,
    colors: ["green", "green", "green", "empty", "empty"],
  }, // Online 3G2E
  {
    min: 36 * 60 * 1000,
    max: 48 * 60 * 1000,
    colors: ["green", "green", "empty", "empty", "empty"],
  }, // Online 2G3E
  {
    min: 48 * 60 * 1000,
    max: 60 * 60 * 1000,
    colors: ["green", "empty", "empty", "empty", "empty"],
  }, // Online 1G4E
  {
    min: 60 * 60 * 1000,
    max: 65 * 60 * 1000,
    colors: ["empty", "empty", "empty", "empty", "empty"],
  }, // Online 5E
  {
    min: 65 * 60 * 1000,
    max: 89 * 60 * 1000,
    colors: ["red", "red", "red", "red", "red"],
  }, // Offline 5R
  {
    min: 89 * 60 * 1000,
    max: 113 * 60 * 1000,
    colors: ["green", "red", "red", "red", "red"],
  }, // Offline 1G4R
  {
    min: 113 * 60 * 1000,
    max: 137 * 60 * 1000,
    colors: ["green", "green", "red", "red", "red"],
  }, // Offline 2G3R
  {
    min: 137 * 60 * 1000,
    max: 161 * 60 * 1000,
    colors: ["green", "green", "green", "red", "red"],
  }, // Offline 3G2R
  {
    min: 161 * 60 * 1000,
    max: 185 * 60 * 1000,
    colors: ["green", "green", "green", "green", "red"],
  }, // Offline 4G1R
];

const mapDefaultDimensions = {
  width: 2048,
  height: 1152,
};

async function loadConfig() {
  try {
    const response = await fetch("config.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to fetch config: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn("Unable to load config.json; using defaults instead.", error);
    return null;
  }
}

function applyConfig(config) {
  if (!config) return;

  if (config.versionInfo && versionInfoEl) {
    versionInfoEl.textContent = config.versionInfo;
  }

  const serverConfig = config.serverStartTimes || {};

  if (serverConfig.initialOpenTime) {
    const parsedDate = new Date(serverConfig.initialOpenTime);
    if (!Number.isNaN(parsedDate.getTime())) {
      settings.initialOpenTime = parsedDate;
    }
  }

  if (Number.isFinite(serverConfig.openDurationMs)) {
    settings.openDurationMs = serverConfig.openDurationMs;
  }

  if (Number.isFinite(serverConfig.closeDurationMs)) {
    settings.closeDurationMs = serverConfig.closeDurationMs;
  }

  if (Number.isFinite(serverConfig.cycleNumberOffset)) {
    settings.cycleNumberOffset = serverConfig.cycleNumberOffset;
  }
}

function updateStatusAndCountdown() {
  const now = new Date();
  const { status, nextChangeTime } = getNextStatusChange(now);

  const statusEl = document.getElementById("status");
  statusEl.textContent = status;
  statusEl.classList.remove("status-online", "status-offline");
  statusEl.classList.add(
    status === "ONLINE" ? "status-online" : "status-offline"
  );

  function formatTime(ms) {
    let minutes = Math.floor(ms / 1000 / 60);
    let seconds = Math.floor((ms / 1000) % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }

  function updateCountdownAndCircles() {
    const updatedDate = new Date();
    const remainingTime = nextChangeTime - updatedDate;
    const timeInCycle = getTimeInCycle(updatedDate);

    if (remainingTime <= 0) {
      // Update status and countdown to the next event
      if (cleanupInterval) cleanupInterval();
      cleanupInterval = updateStatusAndCountdown();
      generateScheduleTable();
    } else {
      const countdownEl = document.getElementById("countdown");
      if (countdownEl) {
        countdownEl.textContent = formatTime(Math.max(remainingTime, 0));
      }
    }
    const cycleNumber = getCycleNumber(updatedDate);
    const cyclePhase =
      status === "ONLINE" ? "Active window" : "Charging window";
    if (cycleMetaEl) {
      cycleMetaEl.textContent = `Cycle ${cycleNumber.toLocaleString()} - ${cyclePhase}`;
    }
    document.body.dataset.status = status.toLowerCase();
    // Now for the circles
    // Find which threshold we're in
    const current = thresholds.find(
      (t) => timeInCycle >= t.min && timeInCycle < t.max
    );
    // Update each circle color
    if (current) {
      cachedCircles.forEach((circle, index) => {
        if (current.colors[index] === "green") {
          circle.style.backgroundColor = "var(--accent-online)";
        } else if (current.colors[index] === "red") {
          circle.style.backgroundColor = "var(--accent-offline)";
        } else {
          circle.style.backgroundColor = "#2a2f3a";
        }
      });
    }
  }

  updateCountdownAndCircles();
  const intervalId = setInterval(function () {
    updateCountdownAndCircles();
  }, 1000);

  // Return cleanup function
  return function cleanup() {
    clearInterval(intervalId);
  };
}

function generateScheduleTable() {
  const scheduleBody = document.getElementById("schedule");
  if (!scheduleBody) return;

  const currentTime = new Date();
  scheduleBody.innerHTML = "";

  const events = [];
  const { status: initialStatus, nextChangeTime } =
    getNextStatusChange(currentTime);

  let cursorStatus = initialStatus;
  let cursorTime = nextChangeTime;

  const eventWindow = 3 * 24 * 60 * 60 * 1000;
  const windowEnd = new Date(currentTime.getTime() + eventWindow);

  const pushEvent = (type, time) => {
    events.push({
      type,
      time,
      statusClass:
        type === "Online" ? "status-online" : "status-offline",
    });
  };

  const advanceCursor = () => {
    if (cursorStatus === "ONLINE") {
      pushEvent("Offline", cursorTime);
      cursorStatus = "OFFLINE";
      cursorTime = new Date(
        cursorTime.getTime() + settings.closeDurationMs
      );
    } else {
      pushEvent("Online", cursorTime);
      cursorStatus = "ONLINE";
      cursorTime = new Date(cursorTime.getTime() + settings.openDurationMs);
    }
  };

  do {
    advanceCursor();
  } while (cursorTime <= windowEnd);

  const activeCycle = getCycleNumber(currentTime);

  const grouped = events.reduce((acc, event) => {
    const cycleNumber = getCycleNumber(event.time);
    if (!acc.has(cycleNumber)) {
      acc.set(cycleNumber, []);
    }
    acc.get(cycleNumber).push(event);
    return acc;
  }, new Map());

  const fragments = [];
  const sortedCycles = Array.from(grouped.entries()).sort(
    ([cycleA], [cycleB]) => cycleA - cycleB
  );

  sortedCycles.forEach(([cycleNumber, cycleEvents]) => {
    const withinThreeDays = cycleEvents.some(
      (event) => event.time <= windowEnd
    );
    if (!withinThreeDays) {
      return;
    }
    const isActive = cycleNumber === activeCycle;
    const header = `
            <div class="cycle-group ${isActive ? "current" : ""}">
                <div class="cycle-group-header">
                    <p class="cycle-group-title">Cycle ${cycleNumber}</p>
                    <span class="cycle-group-sub">${
                      cycleEvents.length
                    } events</span>
                </div>
                <div class="cycle-group-body">
                    ${cycleEvents
                      .map(
                        (event) => `
                        <div class="cycle-group-entry">
                            <span class="status-pill ${
                              event.statusClass
                            }">${event.type.toUpperCase()}</span>
                            <time datetime="${event.time.toISOString()}">${dateTimeFormatter.format(
                          event.time
                        )}</time>
                        </div>
                    `
                      )
                      .join("")}
                </div>
            </div>
        `;
    fragments.push(header);
  });

  scheduleBody.innerHTML = fragments.join("");
  requestAnimationFrame(adjustCycleViewportHeight);
}

// Store interval cleanup function
let cleanupInterval;

// Store DOM elements to avoid repeated queries
let cachedCircles;
let cycleMetaEl;
let versionInfoEl;

document.addEventListener("DOMContentLoaded", async () => {
  // Cache circle elements
  cachedCircles = [
    document.getElementById("circle-1"),
    document.getElementById("circle-2"),
    document.getElementById("circle-3"),
    document.getElementById("circle-4"),
    document.getElementById("circle-5"),
  ];
  cycleMetaEl = document.getElementById("cycle-meta");
  versionInfoEl = document.getElementById("version-info");

  const config = await loadConfig();
  applyConfig(config);
  setupPanelSwitcher();
  setupMapPreview();

  if (!settings.initialOpenTime) {
    console.error(
      "config.json is missing serverStartTimes.initialOpenTime; timers disabled."
    );
    if (versionInfoEl) {
      versionInfoEl.textContent =
        "Configuration error: no server start defined.";
    }
    return;
  }

  if (cleanupInterval) cleanupInterval();
  cleanupInterval = updateStatusAndCountdown();
  generateScheduleTable();
});

window.addEventListener("resize", () => {
  requestAnimationFrame(adjustCycleViewportHeight);
});

function adjustCycleViewportHeight() {
  const cyclesBody = document.querySelector(".cycles-body");
  if (!cyclesBody) return;
  const scrollArea = cyclesBody.querySelector(".cycle-scroll");
  if (!scrollArea) return;
  const groups = scrollArea.querySelectorAll(".cycle-group");
  if (!groups.length) {
    cyclesBody.style.removeProperty("--cycles-visible-height");
    return;
  }

  const visibleCount = Math.min(3, groups.length);
  let totalHeight = 0;

  for (let i = 0; i < visibleCount; i++) {
    const group = groups[i];
    totalHeight += group.offsetHeight;
    if (i < visibleCount - 1) {
      const styles = window.getComputedStyle(group);
      totalHeight += parseFloat(styles.marginBottom) || 0;
    }
  }

  if (totalHeight > 0) {
    cyclesBody.style.setProperty(
      "--cycles-visible-height",
      `${Math.ceil(totalHeight)}px`
    );
  }
}

function setupPanelSwitcher() {
  const tabs = document.querySelectorAll(".panel-tab");
  const panels = document.querySelectorAll(".panel-view");
  const tabContainer = document.querySelector(".panel-tabs");
  if (!tabs.length || !panels.length || !tabContainer) return;

  const updateIndicator = () => {
    const activeTab = document.querySelector(".panel-tab--active");
    if (!activeTab) return;
    const { offsetLeft, offsetWidth } = activeTab;
    const indicatorOffset = offsetLeft;
    const indicatorWidth = offsetWidth;
    tabContainer.style.setProperty("--tab-indicator-offset", `${indicatorOffset}px`);
    tabContainer.style.setProperty("--tab-indicator-width", `${indicatorWidth}px`);
    tabContainer.style.setProperty("--tab-indicator-scale", "1.08");
    setTimeout(() => {
      tabContainer.style.setProperty("--tab-indicator-scale", "1");
    }, 180);
  };

  const activatePanel = (targetId) => {
    panels.forEach((panel) => {
      const isActive = panel.id === targetId;
      panel.classList.toggle("panel-view--active", isActive);
      panel.toggleAttribute("hidden", !isActive);
    });

    tabs.forEach((tab) => {
      const isActive = tab.dataset.panelTarget === targetId;
      tab.classList.toggle("panel-tab--active", isActive);
      tab.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    if (targetId === "cycles-panel") {
      requestAnimationFrame(adjustCycleViewportHeight);
    }
    requestAnimationFrame(updateIndicator);
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => activatePanel(tab.dataset.panelTarget));
  });

  window.addEventListener("resize", () => {
    requestAnimationFrame(updateIndicator);
  });

  requestAnimationFrame(updateIndicator);
}

function setupMapPreview() {
  const previewImage = document.getElementById("map-preview-image");
  const previewTitle = document.getElementById("map-preview-title");
  const previewDescription = document.getElementById("map-preview-description");
  const previewLink = document.getElementById("map-preview-link");
  const mapButtons = document.querySelectorAll(".map-list__item");
  let dimensionProbe;
  if (
    !previewImage ||
    !previewTitle ||
    !previewDescription ||
    !previewLink ||
    !mapButtons.length
  ) {
    return;
  }

  const applyDimensions = (width, height) => {
    const safeWidth =
      Number.isFinite(width) && width > 0
        ? Math.round(width)
        : mapDefaultDimensions.width;
    const safeHeight =
      Number.isFinite(height) && height > 0
        ? Math.round(height)
        : mapDefaultDimensions.height;
    previewLink.setAttribute("data-pswp-width", safeWidth);
    previewLink.setAttribute("data-pswp-height", safeHeight);
  };

  const probeDimensions = (src) => {
    if (!src) return;
    if (dimensionProbe) {
      dimensionProbe.onload = null;
    }
    dimensionProbe = new Image();
    dimensionProbe.onload = () => {
      if (previewLink.getAttribute("data-pswp-src") !== src) {
        return;
      }
      applyDimensions(dimensionProbe.naturalWidth, dimensionProbe.naturalHeight);
    };
    dimensionProbe.src = src;
  };

  const updatePreview = (button) => {
    const {
      mapSrc,
      mapTitle,
      mapDescription,
      mapWidth,
      mapHeight,
    } = button.dataset;
    if (!mapSrc || !mapTitle) return;
    previewImage.src = mapSrc;
    previewImage.alt = `${mapTitle} contested zone map`;
    previewLink.href = mapSrc;
    previewLink.dataset.pswpSrc = mapSrc;
    previewLink.setAttribute("data-pswp-src", mapSrc);
    previewTitle.textContent = mapTitle;
    previewDescription.textContent = mapDescription;
    const width = Number.parseInt(mapWidth, 10);
    const height = Number.parseInt(mapHeight, 10);
    applyDimensions(width, height);
    previewLink.setAttribute(
      "data-pswp-caption",
      `${mapTitle} - ${mapDescription}`
    );
    probeDimensions(mapSrc);
  };

  mapButtons.forEach((button) => {
    button.addEventListener("click", () => {
      mapButtons.forEach((btn) =>
        btn.classList.remove("map-list__item--active")
      );
      button.classList.add("map-list__item--active");
      updatePreview(button);
    });
  });

  const activeButton = document.querySelector(".map-list__item--active");
  if (activeButton) {
    updatePreview(activeButton);
  }
}
