import $ = require("jquery");
import _ = require("underscore");
import Backbone = require("backbone");
import Radio = require("backbone.radio");
import Marionette = require("backbone.marionette");

import {App} from "./app";

let radio = new Radio.Channel();
let app   = new App({radio: radio});


/* Global Scope */

window._          = _;
window.$          = $;
window.radio      = radio;
window.Backbone   = Backbone;
window.Marionette = Marionette;

$(function () {
    app.start();
})



