#!/usr/bin/env bash
set -euo pipefail

UUID="power-off-button@local"
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEST_DIR="/usr/share/gnome-shell/extensions/$UUID"

if [[ $EUID -ne 0 ]]; then
    echo "Se requieren privilegios de superusuario. Reejecutando con sudo..."
    exec sudo bash "$0" "$@"
fi

rm -rf "$DEST_DIR"
cp -r "$PROJECT_DIR/$UUID" "$DEST_DIR"
chmod -R u+rwX,go+rX "$DEST_DIR"

if [[ -n "${SUDO_USER:-}" ]]; then
    sudo -u "$SUDO_USER" \
        XDG_RUNTIME_DIR="/run/user/$(id -u "$SUDO_USER")" \
        gnome-extensions enable "$UUID" >/dev/null 2>&1 || true
fi

echo "Extensión instalada en $DEST_DIR"
