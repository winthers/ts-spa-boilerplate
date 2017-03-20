import $ = require("jquery");
import _ = require("underscore");
import Radio = require("backbone.radio");
import Backbone = require("backbone");
import Marionette = require("backbone.marionette");

export class RootView extends Marionette.View<any> {
	radio:Radio.Channel;
	constructor(options?:any) {
		options.className = "rootview";
		options.template = function (data) {
			return _.template(`
				<h1>Project Template</h1>
			`)(data);
		}
		options.ui 		= {}
		options.events  = {}
		options.regions = {}

		super(options);
		this.radio = options.radio;
	}
	onAttach () {
		
		//this.showChildView("rootComponentRegion", this.rootView);
	}
}