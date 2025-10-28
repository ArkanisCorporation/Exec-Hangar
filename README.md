# Executive Hangar Status

Live, client-side tracker that shows the current state of the PYAM Executive Hangar rotation for Star Citizen. The page renders the current ONLINE/OFFLINE status, a countdown to the next change, a visual progress indicator, and the next two upcoming cycles so visitors can quickly plan their hangar usage.

## Features

- **Real-time status** – Calculates the active cycle in the browser and updates the status message and page title.
- **Countdown timer** – Shows exact time remaining until the next changeover.
- **Cycle progress lights** – Five-light indicator reflecting the current phase segment.
- **Upcoming cycles** – Displays the current cycle plus the following two with labeled ONLINE / OFFLINE events.
- **Responsive UI** – Tailwind CSS + DaisyUI powered layout with custom gradients and theming.
- **Zero back-end** – Works entirely in the browser using static assets; no server component required.

## Getting Started

The project is a static site. You can view it locally by opening `index.html` in a browser or serving the folder with any static server.

### Run locally (recommended for development)

```bash
# using npx serve (https://www.npmjs.com/package/serve)
npx serve .
```

Then open the printed URL (usually http://localhost:3000) in your browser.

### Directly open the file

Simply double-click `index.html` or open it via `File → Open` inside your browser. Keep in mind that some browsers restrict local file access for fonts / icons; using a small static server avoids those issues.

## Project Structure

```
.
├── app.js          # Cycle calculations, countdown updates, schedule rendering
├── index.html      # Main document and layout
├── style.css       # Custom theming layered on top of Tailwind
├── assets/
│   └── Arkanis.webp  # Favicon / logo
└── LICENSE.txt     # MIT License
```

## Tech Stack

- HTML5 + Tailwind CSS (via CDN)
- DaisyUI (via CDN)
- Vanilla JavaScript (no frameworks)

## License

Licensed under the [MIT License](LICENSE.md). See `LICENSE.txt` for full details.

## Credits

- Project maintained by NBDBatman / Arkanis Corporation.
- Based on the original tracker at [exec.xyxyll.com](https://exec.xyxyll.com/); huge thanks to Xyxyll for the groundwork.
