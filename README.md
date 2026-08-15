# Power Off Button

A [GNOME Shell](https://www.gnome.org/) extension that adds a power off button to the top bar. Clicking it opens the **standard GNOME confirmation dialog** and then shuts down the computer — exactly the same flow as the Power Off entry in the system menu.

![Compatibility](https://img.shields.io/badge/GNOME_Shell-46-blue)

## Features

- One click: opens the native "Power Off" confirmation dialog with countdown and Cancel option.
- Reuses the shell's own `SystemActions.activatePowerOff()`, so it respects GNOME's normal shutdown flow, pending updates, and other users' sessions.
- The button automatically hides when power off is unavailable (e.g. when locked down by a system administrator).
- Keyboard accessible (Enter/Space to activate when focused).
- Works on both X11 and Wayland.

## Requirements

- GNOME Shell **46** (Zorin OS 18.x, Ubuntu 24.04, Fedora 40, …)
- A user session (not the login screen)

## Installation

There are three supported ways to install the extension.

### Option 1 — Local (user only)

```bash
./install.sh
```

Copies the extension to `~/.local/share/gnome-shell/extensions/power-off-button@local/` and enables it in GSettings.

> GNOME Shell only discovers new extensions at session start, so log out and back in (or reboot) to see the button.

### Option 2 — System-wide

```bash
sudo ./install-system.sh
```

Copies the extension to `/usr/share/gnome-shell/extensions/power-off-button@local/` and enables it for the invoking user.

### Option 3 — Debian package

Build a `.deb` and install it with `apt`:

```bash
./build-deb.sh
sudo apt install ./dist/gnome-shell-extension-power-off-button_1.0_all.deb
```

## Usage

After installing and re-logging in, a power icon appears in the top bar (left of the clock). Click it to open the standard confirmation dialog, then confirm to power off.

## Uninstall

```bash
rm -rf ~/.local/share/gnome-shell/extensions/power-off-button@local
gsettings reset org.gnome.shell enabled-extensions   # or remove the uuid from the list
```

Or, if installed as a package: `sudo apt remove gnome-shell-extension-power-off-button`.

## Development

```text
.
├── power-off-button@local/   # extension source
│   ├── extension.js          # entry point (ESM, GNOME 46 API)
│   ├── metadata.json
│   ├── stylesheet.css
│   └── LICENSE
├── install.sh                # local install
├── install-system.sh         # system-wide install
├── build-deb.sh              # builds the .deb package
└── dist/                     # generated packages (gitignored)
```

The button is implemented as a `PanelMenu.Button` added through `Main.panel.addToStatusArea()`. On click it calls `SystemActions.getDefault().activatePowerOff()`, reusing the exact code path used by the GNOME system menu.

## License

[MIT](LICENSE)
