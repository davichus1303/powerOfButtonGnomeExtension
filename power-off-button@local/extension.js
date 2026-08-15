/**
 * Power Off Button — GNOME Shell extension.
 *
 * Adds a power off button to the top bar. Clicking it opens the standard
 * GNOME shutdown confirmation dialog and powers off the computer, reusing
 * the exact flow of the system menu's "Power Off" entry.
 */

import Clutter from 'gi://Clutter';
import GObject from 'gi://GObject';
import St from 'gi://St';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as SystemActions from 'resource:///org/gnome/shell/misc/systemActions.js';
import {Extension, gettext as _} from 'resource:///org/gnome/shell/extensions/extension.js';

/**
 * A clickable panel button that triggers the shutdown flow.
 *
 * @extends {PanelMenu.Button}
 */
const PowerOffButton = GObject.registerClass(
class PowerOffButton extends PanelMenu.Button {
    /**
     * Builds the button, its icon and the event handlers.
     *
     * The button is hidden automatically while power off is not available,
     * thanks to a property binding to `can-power-off`.
     *
     * @param {object} systemActions - The SystemActions singleton returned
     *   by `SystemActions.getDefault()`.
     */
    _init(systemActions) {
        super._init(0.5, _('Power Off'), true);

        this._systemActions = systemActions;
        this.add_style_class_name('power-off-button');

        this.add_child(new St.Icon({
            icon_name: 'system-shutdown-symbolic',
            style_class: 'system-status-icon',
        }));

        this._systemActions.bind_property('can-power-off', this, 'visible',
            GObject.BindingFlags.SYNC_CREATE);

        this.connect('button-release-event', this._onButtonReleaseEvent.bind(this));
        this.connect('key-press-event', this._onKeyPressEvent.bind(this));
    }

    /**
     * Handles mouse clicks on the button.
     *
     * Only a primary (left) click triggers the action; other buttons are
     * propagated so the shell can handle them.
     *
     * @param {Clutter.Actor} actor - The actor that received the event.
     * @param {Clutter.Event} event - The associated click event.
     * @returns {boolean} Whether the event was handled.
     */
    _onButtonReleaseEvent(actor, event) {
        if (event.get_button() !== Clutter.BUTTON_PRIMARY)
            return Clutter.EVENT_PROPAGATE;

        this._onClicked();
        return Clutter.EVENT_STOP;
    }

    /**
     * Handles keyboard activation when the button has focus.
     *
     * Enter or Space activate the button; every other key is propagated so
     * the shell can keep handling focus navigation.
     *
     * @param {Clutter.Actor} actor - The actor that received the event.
     * @param {Clutter.Event} event - The associated key event.
     * @returns {boolean} Whether the event was handled.
     */
    _onKeyPressEvent(actor, event) {
        const symbol = event.get_key_symbol();
        if (symbol !== Clutter.KEY_Return && symbol !== Clutter.KEY_space)
            return Clutter.EVENT_PROPAGATE;

        this._onClicked();
        return Clutter.EVENT_STOP;
    }

    /**
     * Runs the standard power off flow.
     *
     * Delegates to the shell's own system actions, so the confirmation
     * dialog shown is the usual GNOME one (with countdown and Cancel).
     */
    _onClicked() {
        this._systemActions.activatePowerOff();
    }
});

/**
 * Entry point of the "Power Off Button" extension.
 *
 * Manages the lifecycle of the panel button while the extension is loaded.
 */
export default class PowerOffExtension extends Extension {
    /**
     * Creates the panel button and adds it to the top bar.
     */
    enable() {
        this._systemActions = SystemActions.getDefault();
        this._button = new PowerOffButton(this._systemActions);
        Main.panel.addToStatusArea('power-off-button', this._button, 0, 'right');
    }

    /**
     * Destroys the panel button and releases all references.
     */
    disable() {
        this._button?.destroy();
        this._button = null;
        this._systemActions = null;
    }
}
