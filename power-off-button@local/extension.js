import Clutter from 'gi://Clutter';
import GObject from 'gi://GObject';
import St from 'gi://St';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as SystemActions from 'resource:///org/gnome/shell/misc/systemActions.js';
import {Extension, gettext as _} from 'resource:///org/gnome/shell/extensions/extension.js';

const PowerOffButton = GObject.registerClass(
class PowerOffButton extends PanelMenu.Button {
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

    _onButtonReleaseEvent(actor, event) {
        if (event.get_button() !== Clutter.BUTTON_PRIMARY)
            return Clutter.EVENT_PROPAGATE;

        this._onClicked();
        return Clutter.EVENT_STOP;
    }

    _onKeyPressEvent(actor, event) {
        const symbol = event.get_key_symbol();
        if (symbol !== Clutter.KEY_Return && symbol !== Clutter.KEY_space)
            return Clutter.EVENT_PROPAGATE;

        this._onClicked();
        return Clutter.EVENT_STOP;
    }

    _onClicked() {
        this._systemActions.activatePowerOff();
    }
});

export default class PowerOffExtension extends Extension {
    enable() {
        this._systemActions = SystemActions.getDefault();
        this._button = new PowerOffButton(this._systemActions);
        Main.panel.addToStatusArea('power-off-button', this._button, 0, 'right');
    }

    disable() {
        this._button?.destroy();
        this._button = null;
        this._systemActions = null;
    }
}
