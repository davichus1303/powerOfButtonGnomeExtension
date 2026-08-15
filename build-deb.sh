#!/usr/bin/env bash
set -euo pipefail

UUID="power-off-button@local"
PKG_NAME="gnome-shell-extension-power-off-button"
VERSION="1.0"
ARCH="all"

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
STAGE_DIR="$PROJECT_DIR/.build/${PKG_NAME}_${VERSION}"
DIST_DIR="$PROJECT_DIR/dist"
INSTALL_DIR="$STAGE_DIR/usr/share/gnome-shell/extensions/$UUID"
CONTROL_DIR="$STAGE_DIR/DEBIAN"

rm -rf "$STAGE_DIR"
mkdir -p "$INSTALL_DIR"
mkdir -p "$CONTROL_DIR"
mkdir -p "$DIST_DIR"

cp "$PROJECT_DIR/$UUID"/metadata.json \
   "$PROJECT_DIR/$UUID"/extension.js \
   "$PROJECT_DIR/$UUID"/stylesheet.css \
   "$PROJECT_DIR/$UUID"/LICENSE \
   "$INSTALL_DIR/"

INSTALLED_SIZE="$(du -sk "$INSTALL_DIR" | cut -f1)"

cat > "$CONTROL_DIR/control" <<EOF
Package: $PKG_NAME
Version: ${VERSION}-1
Architecture: $ARCH
Maintainer: David <david@local>
Depends: gnome-shell (>= 46)
Section: gnome
Priority: optional
Installed-Size: $INSTALLED_SIZE
Description: Power Off button for the GNOME top bar
 Adds a power off button to the top bar. Clicking it shows the
 standard confirmation dialog before shutting down the computer.
EOF

dpkg-deb --build --root-owner-group "$STAGE_DIR" "$DIST_DIR/${PKG_NAME}_${VERSION}_${ARCH}.deb"

rm -rf "$STAGE_DIR"

echo "Paquete generado: $DIST_DIR/${PKG_NAME}_${VERSION}_${ARCH}.deb"
