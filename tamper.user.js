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
    script.src = "https://cdn.rawgit.com/QtSlitherBot/QtSlitherBot/88473c6a361d9c020c63a78471ed31ed8011f487/basic_bot.js";
    document.getElementsByTagName('head')[0].appendChild(script);

    script = document.createElement("SCRIPT");
    script.src = "https://cdn.rawgit.com/QtSlitherBot/QtSlitherBot/88473c6a361d9c020c63a78471ed31ed8011f487/bot_framework.js";
    document.getElementsByTagName('head')[0].appendChild(script);
});
