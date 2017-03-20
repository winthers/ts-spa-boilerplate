import $ = require("jquery");
import _ = require("underscore");
import Radio = require("backbone.radio");
import Backbone = require("backbone");
import Marionette = require("backbone.marionette");

import {RootView} from "./views/root.view";


export class App extends Marionette.Application {
	
	radio: Radio.Channel;
	
	constructor (options) {
		super({region: "#application-root"});
		this.radio = options.radio;
	}
	
	onStart() {
		console.log("Application started");
		this.showView(new RootView({radio: this.radio}));
	}
}





