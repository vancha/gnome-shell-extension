/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

/* exported init */

const GETTEXT_DOMAIN = 'my-indicator-extension';

const { Clutter,Gio, GnomeDesktop, GLib,
    GObject, Meta, Pango, Shell, St } = imports.gi;

const Me = imports.misc.extensionUtils.getCurrentExtension();
const Utils = Me.imports.utils;
const {ECal, EDataServer, ICalGLib} = Utils.HAS_EDS_ ? imports.gi : {undefined};




const ExtensionUtils = imports.misc.extensionUtils;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;

var square = GObject.registerClass(
class colored_square extends St.BoxLayout {
  _init(){
    super._init();
    
   
   
    //https://gjs-docs.gnome.org/ecal20~3.44p/ecal.client#function-connect_sync
    //Parameters: 
    //source (EDataServer.Source) — an EDataServer.Source
    //source_type (ECal.ClientSourceType) — source type of the calendar
    //wait_for_connected_seconds (Number) — timeout, in seconds, to wait for the backend to be fully connected
    //cancellable (Gio.Cancellable) — optional Gio.Cancellable object, or null
    try {
    
    
    //var sources = EDataServer.SourceRegistry.list_sources(registry, EDataServer.SOURCE_EXTENSION_CALENDAR)
    //this should contain some sources, argument is supposed to be extension name as string
    var registry = EDataServer.SourceRegistry.new_sync(null);
    logError(new Error('created registry'),'YOUR SHITTY EXTENSION');
    var sources = registry.list_sources(null);
    logError(new Error('listed sources (length of '+sources.length+')'),'YOUR SHITTY EXTENSION');
    var event_list = [];
    
    for(var i = 0; i < sources.length;i++){
      var source = sources[0];
      var source_type = 0;//events = 0
      var wait_for_connected_seconds = 1;//should do for local calendar right?
      var cancellable = null;//optional, not required
      var new_client = ECal.Client.connect_sync(source, source_type, wait_for_connected_seconds,cancellable);
      if (new_client){
        
        logError(new Error('Got a calendar!'),'YOUR SHITTY EXTENSION');
      }
      
    }
    
    
    
    //An EDataServer.Source
    v
    
    
    logError(new Error('i have done all kinds of stuff'),'YOUR SHITTY EXTENSION');
    
    } catch (e){
      logError(e, 'YOUR SHITTY EXTENSION');
    }
    
    
    //test, will need this later to show things on the desktop
    this._time = new St.Label({
        x_align: Clutter.ActorAlign.CENTER,
        y_align: Clutter.ActorAlign.CENTER,
    });
    this._time.clutter_text.set({
        ellipsize: Pango.EllipsizeMode.NONE,
        text: "Hello world",
    });


    this.add_child(this._time);
    this.set_position(200, 200);
    //end of test
  }
});

var littleblock; //= colored_square();
    

const _ = ExtensionUtils.gettext;





const Indicator = GObject.registerClass(
class Indicator extends PanelMenu.Button {
    _init() {
        super._init(0.0, _('My Shiny Indicator'));

        this.add_child(new St.Icon({
            icon_name: 'face-smile-symbolic',
            style_class: 'system-status-icon',
        }));

        let item = new PopupMenu.PopupMenuItem(_('Show Notification'));
        item.connect('activate', () => {
            Main.notify(_('Whatʼs up, folks?'));
        });
        this.menu.addMenuItem(item);
    }
});

class Extension {
    constructor(uuid) {
        this._uuid = uuid;

        ExtensionUtils.initTranslations(GETTEXT_DOMAIN);
    }

    enable() {
        this._indicator = new Indicator();
        littleblock = new square();
        Main.panel.addToStatusArea(this._uuid, this._indicator);
        Main.layoutManager._backgroundGroup.add_child(littleblock);
    }

    disable() {
        Main.layoutManager._backgroundGroup.remove_child(littleblock);
        this._indicator.destroy();
        this._indicator = null;
    }
}

function init(meta) {
    return new Extension(meta.uuid);
}
