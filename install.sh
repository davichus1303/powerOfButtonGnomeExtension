#!/usr/bin/env bash
set -euo pipefail

UUID="power-off-button@local"
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
EXT_DIR="$HOME/.local/share/gnome-shell/extensions"
TARGET_DIR="$EXT_DIR/$UUID"

mkdir -p "$EXT_DIR"
rm -rf "$TARGET_DIR"
cp -r "$PROJECT_DIR/$UUID" "$TARGET_DIR"
chmod -R u+rwX,go+rX "$TARGET_DIR"

python3 - "$UUID" <<'PY'
import json
import subprocess
import sys

uuid = sys.argv[1]
value = subprocess.run(
    ['gsettings', 'get', 'org.gnome.shell', 'enabled-extensions'],
    check=True, capture_output=True, text=True).stdout.strip()
extensions = [] if value.startswith('@as') else json.loads(value.replace("'", '"'))
if uuid not in extensions:
    extensions.append(uuid)
    subprocess.run(['gsettings', 'set', 'org.gnome.shell', 'enabled-extensions',
                    json.dumps(extensions).replace('"', "'")], check=True)
PY

gnome-extensions enable "$UUID" >/dev/null 2>&1 || true

echo "Extensión instalada en $TARGET_DIR"
echo "Habilitada en org.gnome.shell.enabled-extensions."
echo
echo "GNOME Shell solo descubre extensiones nuevas al iniciar la sesión."
echo "Para ver el botón de apagado en la barra superior, cierra la sesión"
echo "y vuelve a iniciarla (o reinicia el equipo)."
