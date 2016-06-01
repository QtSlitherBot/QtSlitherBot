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
    script.src = "https://cdn.rawgit.com/QtSlitherBot/QtSlitherBot/901e41eb30c9b32cf113db2bc0fae01e3e7b668b/basic_bot.js";
    document.getElementsByTagName('head')[0].appendChild(script);

    script = document.createElement("SCRIPT");
    script.src = "https://cdn.rawgit.com/QtSlitherBot/QtSlitherBot/901e41eb30c9b32cf113db2bc0fae01e3e7b668b/bot_framework.js";
    document.getElementsByTagName('head')[0].appendChild(script);
});
