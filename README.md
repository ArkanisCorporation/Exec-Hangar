# Executive Hangar Status

Executive Hangar Status is a fully client-side tracker for the PYAM Executive Hangar rotation in *Star Citizen*. It highlights the current ONLINE/OFFLINE state, the time remaining until the next change, the active cycle number, and a multi-day forecast so pilots can plan their sessions at a glance.

## Feature Highlights

- **Live cycle engine**  
  - Calculates the current state in-browser and refreshes the UI every second.  
  - Updates the document title so the status is visible even when the tab is backgrounded.
- **Countdown + progress indicator**  
  - Large monospace timer for the next window change.  
  - Five-light “phase” readout mirrors the in-game cadence.
- **Three-day schedule panel**  
  - Upcoming cycles are grouped into cards and locked to a glassy scroll container that always shows three full cycles.  
  - Only the list scrolls; the rest of the layout stays fixed.
- **Dedicated license page**  
  - A standalone `license/index.html` view renders the MIT license pulled directly from `LICENSE.md`.   
  - Quick nav link returns to the main tracker.
- **Frame-perfect timings**  
  - One complete hangar cycle is **185 minutes and 699 milliseconds**.  
  - Skipping that extra 699 ms introduces 5+ seconds of drift per day--over one minute in just two weeks--so the tracker keeps that offset.
- **Accurate claim window**  
  - The hangar stays ONLINE for **65 full minutes**, not 60. The final five minutes are active, not a cooldown.  
  - All hangar timers are globally synchronized (confirmed by Elfiann-CIG), and the app anticipates the correct state even when the in-game lights briefly misreport.
- **Dark + auto light theming**  
  - Custom background artwork with configurable translucency on cards, header, and footer.  
  - Automatically adapts when the OS prefers a light color scheme.
- **Single configuration source**  
  - `config.json` keeps the visible version string and server timing values in one place.  
  - Editing a single file updates both the reference copy and runtime calculations.
- **Zero back-end**  
  - Runs entirely from static assets--no APIs, servers, or authentication required.

## Getting Started

### Run locally (recommended for development)

```bash
# using npx serve (https://www.npmjs.com/package/serve)
npx serve .
```

Open the printed URL (usually http://localhost:3000) in your browser. Using a small dev server avoids local file security restrictions for images and fonts.  
> **Note:** The app fetches `config.json`; most browsers block that request when loading straight from `file://`, so prefer running a dev server.

### Quick preview

You can also double-click `index.html` or drag it into a browser window. If assets fail to load because of local file policies, switch to the static server approach above.

## Configuration

- **Version + timing** – Edit `config.json` to adjust the display banner, server start time, cycle durations, or cycle offset. This is the only place that needs to change when patches drop.  
- **Background translucency** – Tweak the rgba alpha values under the "Surface backgrounds" section in `style.css` to adjust the glass effect.  
- **Upcoming horizon** – Change the three-day lookahead by editing the `eventWindow` constant inside `generateScheduleTable()` in `app.js`.  
- **License content** – Edit `LICENSE.md` to change what is rendered on the `/license/` page; the loader reads the repository copy directly.

## Project Structure

```
.
|- app.js             # Cycle calculations, countdown logic, schedule rendering
|- config.json        # Version banner + server timing configuration
|- index.html         # Main document shell and layout
|- license/index.html # Standalone license page
|- license/mit.css    # License page styling
|- license/mit.js     # Loads LICENSE.md
|- style.css          # Custom theme layered on top of Tailwind/DaisyUI
|- assets/
|  |- Arkanis.webp    # Favicon / brand mark
|  \- background.png  # Current backdrop artwork
|- LICENSE.md         # MIT License text displayed on /license/
```

## Tech Stack

- Vanilla HTML5
- Vanilla CSS
- Vanilla JavaScript

## Contributing

Issues and pull requests are welcome. If you open a PR, please include:

1. A clear description of the change and why it is needed.  
2. Any manual testing steps or screenshots that confirm the behaviour.  
3. Documentation or comment updates when behaviour changes.

## License

Licensed under the [MIT License](LICENSE.md). A static copy is provided in `LICENSE.md`.

## Legal Notice

This is an unofficial Star Citizen fan project. Star Citizen(R), Roberts Space Industries(R), and Cloud Imperium(R) are trademarks of Cloud Imperium Rights LLC and/or Chris Roberts. This site is not endorsed by or affiliated with Cloud Imperium Rights LLC.

## Credits

- Project maintained by [NBDBatman](https://github.com/NBDBatman) / [Arkanis Corporation](https://github.com/arkanisCorporation/).  
- Inspired by the original tracker at [exec.xyxyll.com](https://exec.xyxyll.com/)--huge thanks to Xyxyll for the groundwork.








