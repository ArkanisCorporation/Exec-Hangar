const LOCAL_LICENSE_PATH = "mit.md";
const LICENSE_CDN_URL =
  "https://cdn.zoromd.com/gh/NBDBatman/Exec-Hangar@main/mit.md";

function markdownToHtml(markdown) {
  const escapeHtml = (str) =>
    str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  return markdown
    .trim()
    .split(/\r?\n\r?\n/)
    .map((block) => {
      const escaped = escapeHtml(block.trim());
      return `<p>${escaped.replace(/\r?\n/g, "<br>")}</p>`;
    })
    .join("");
}

async function fetchWithFallback(urls) {
  for (const url of urls) {
    try {
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      const text = await response.text();
      return text;
    } catch (error) {
      console.warn(`Failed to load license from ${url}:`, error);
    }
  }
  throw new Error("All license sources failed");
}

async function loadLicense() {
  const container = document.querySelector(".license-content");
  if (!container) return;

  try {
    const text = await fetchWithFallback([LOCAL_LICENSE_PATH, LICENSE_CDN_URL]);
    container.innerHTML = markdownToHtml(text);
  } catch (error) {
    container.innerHTML = `<p class="license-error">Unable to load license text automatically. <a href="${LICENSE_CDN_URL}" target="_blank" rel="noopener">View on CDN</a>.</p>`;
    console.error("Failed to load license:", error);
  }
}

document.addEventListener("DOMContentLoaded", loadLicense);

