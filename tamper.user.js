// ==UserScript==
// @name         Qt Slither.IO Bot
// @namespace    https://github.com/QtSlitherBot/QtSlitherBot
// @version      0.1
// @description
// @author       NexusTools
// @noframes
// @match        http://slither.io/*
// @match        https://slither.io/*
// @run-at       document-body
// @grant        none
// ==/UserScript==

// TODO: Implement a UI

window.addEventListener("load", function () {
    var script = document.createElement("SCRIPT");
    script.src = "https://cdn.rawgit.com/QtSlitherBot/QtSlitherBot/master/basic_bot.js";
    document.getElementsByTagName('head')[0].appendChild(script);

    script = document.createElement("SCRIPT");
    script.src = "https://cdn.rawgit.com/QtSlitherBot/QtSlitherBot/master/bot_framework.js";
    document.getElementsByTagName('head')[0].appendChild(script);
});
