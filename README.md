# Executive Hangar Status

Executive Hangar Status is a fully client-side tracker for the PYAM Executive Hangar rotation in *Star Citizen*. It highlights the current ONLINE/OFFLINE state, time remaining until the next change, the active cycle number, and an extended forecast so pilots can plan ahead at a glance.

## Feature Highlights

- **Live cycle engine**  
  - Computes the current status in-browser and refreshes the UI every second.  
  - Updates the document title so the state stays visible while the tab is in the background.
- **Countdown + progress indicator**  
  - Large monospace timer for the next window change.  
  - Five-light “phase” readout mirrors the in-game cadence for quick reference.
- **Three-day schedule panel**  
  - Upcoming cycles are grouped into cards and locked to a glassy scroll container that shows three full cycles at once.  
  - Only the list scrolls; the rest of the layout remains fixed.
- **Frame-perfect timings**  
  - One complete hangar cycle is **185 minutes and 699 milliseconds**.  
  - Skipping that 699 ms introduces 5+ seconds of drift *per day*—over a minute within two weeks. The tracker keeps the fractional offset so long sessions stay aligned.
- **Accurate claim window**  
  - The hangar stays ONLINE for **65 full minutes**, not 60. The final five minutes are still active, not a cooldown.  
  - All hangar timers are globally synchronized (confirmed by Elfiann-CIG). If the bay lights go dark while more than five minutes remain, it is the known client-side visual bug; the tracker anticipates the correct state change.
- **Dark + auto light theming**  
  - Custom background image with configurable translucency on cards, header, and footer.  
  - Automatically adapts when the OS prefers a light color scheme.
- **Zero back-end**  
  - Runs entirely from static files—no API calls, servers, or authentication required.

## Getting Started

### Run locally (recommended for development)

```bash
# using npx serve (https://www.npmjs.com/package/serve)
npx serve .
```

Open the printed URL (usually http://localhost:3000) in your browser. This avoids local file security restrictions on web fonts and images.

### Quick preview

Double-click `index.html` or drag it into a browser window. If assets fail to load because of local file policies, switch to the static server approach above.

## Configuration Tips

- **Background translucency** – Edit the rgba alpha values under the “Surface backgrounds” section in `style.css` to make the cards, header, or footer more or less opaque.  
- **Cycle numbering** – Adjust `CYCLE_NUMBER_OFFSET` in `app.js` if the live game introduces a new baseline cycle number.  
- **Upcoming horizon** – Change the three-day lookahead by editing the `endTime` calculation inside `generateScheduleTable()` in `app.js`.

## Project Structure

```
.
├── app.js          # Cycle calculations, countdown logic, schedule rendering
├── index.html      # Document shell and layout
├── style.css       # Custom theme layered on top of Tailwind/DaisyUI
├── assets/
│   ├── Arkanis.webp   # Favicon / brand mark
│   └── background.png # Current backdrop artwork
└── LICENSE.txt     # MIT License
```

## Tech Stack

- HTML5 + Tailwind CSS (via CDN)
- DaisyUI component utilities (via CDN)
- Vanilla JavaScript (no frameworks, no build step)

## Contributing

Issues and pull requests are welcome. If you contribute code, please include:

1. A clear description of the change and its motivation.  
2. Any manual testing steps or screenshots that help confirm the behaviour.  
3. Updates to documentation or inline comments when behaviour changes.

## License

Licensed under the [MIT License](LICENSE.md). A copy is provided in `LICENSE.txt`.

## Credits

- Project maintained by NBDBatman / Arkanis Corporation.  
- Inspired by the original tracker at [exec.xyxyll.com](https://exec.xyxyll.com/)—huge thanks to Xyxyll for the groundwork.
