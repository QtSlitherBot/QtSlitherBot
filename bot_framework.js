/*
    This file is part of QtSlitherBot.

    QtSlitherBot is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    QtSlitherBot is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with QtSlitherBot.  If not, see <http://www.gnu.org/licenses/>.
*/

// TODO: Expose more snake information to the bot implementation

(function(global) {
    var main = function(slither_bot) {
        var version = 1.4;
        slither_bot.print("SlitherBot Framework V" + version);

        function escapeHtml(unsafe) {
            return unsafe
                 .replace(/&/g, "&amp;")
                 .replace(/</g, "&lt;")
                 .replace(/>/g, "&gt;")
                 .replace(/"/g, "&quot;")
                 .replace(/'/g, "&#039;");
         }

        var overriding = false, simulated;
        function simulate(element, eventName, options)
        {
            options = extend(defaultOptions, options || {});
            var event;

            event = document.createEvent("MouseEvents");
            event.initMouseEvent(eventName, options.bubbles, options.cancelable, document.defaultView,
                                  options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
                                  options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, element);
            element.dispatchEvent(event);
        }
        function extend(destination, source) {
            for (var property in source)
                destination[property] = source[property];
            return destination;
        }
        var defaultOptions = {
            pointerX: 0,
            pointerY: 0,
            button: 0,
            ctrlKey: false,
            altKey: false,
            shiftKey: false,
            metaKey: false,
            bubbles: true,
            cancelable: true
        }

        var zoom_id = "gsc";
        var snake_id = "snake";
        var snakes_id = "snakes";
        var snake_parts_id = "pts";
        var snake_part_x_id = "xx";
        var snake_part_y_id = "yy";
        var snake_part_dying_id = "dying";
        var snake_move_x_id = "rex";
        var snake_move_y_id = "rey";
        var snake_size_id = "sct";
        var snake_exact_angle_id = "ehang";
        var snake_angle_id = "eang";
        var snake_speed_id = "tsp";
        var snake_alive_id = "alive_amt";
        var snake_dead_id = "dead_amt";
        var snake_x_id = "xx";
        var snake_y_id = "yy";
        var food_id = "foods";
        var food_x_id = "xx";
        var food_y_id = "yy";
        var food_w_id = "ofw";
        var food_w_threshold = 18;
        var prey_id = "preys";
        var prey_x_id = "xx";
        var prey_y_id = "yy";
        var prey_eaten_id = "eaten";
        var prey_w_id = "gfw";
        var prey_w_threshold = 100;

        var double_pi = Math.PI*2;

        var hasFocus;
        var visibility = 1;
        var overlayEnabled = true;
        var overlay = document.createElement("canvas");
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.position = "absolute";
        overlay.style.pointerEvents = "none";
        overlay.style.zIndex = 99999999;

        var overlayContext = overlay.getContext("2d");

        var twichOverlay = document.createElement("div");
        twichOverlay.style.bottom = "0";
        twichOverlay.style.left = "0";
        twichOverlay.style.background = "rgba(0, 0, 0, 0.7)";
        twichOverlay.style.position = "absolute";
        twichOverlay.style.pointerEvents = "none";
        twichOverlay.style.zIndex = 199999999;
        twichOverlay.style.color = "white";
        twichOverlay.style.maxWidth = "600px";
        twichOverlay.style.overflow = "hidden";
        twichOverlay.style.paddingBottom = "20px";
        twichOverlay.style.fontSize = "250%";

        var comments = [];
        var uiTimer = 1000/60;
        var commentHeight = 0;
        function fadeIn(comment) {
            try{clearTimeout(comment._fadeTimer);}catch(e){}
            if(comment._opacity < 1) {
                comment._opacity += 0.1;
                comment.style.opacity = comment._opacity;
                if(comment._opacity < 1)
                    comment._fadeTimer = setTimeout(function() {
                        fadeIn(comment);
                    }, uiTimer);
            }
        }
        function fadeOut(comment, complete) {
            try{clearTimeout(comment._fadeTimer);}catch(e){}
            if(comment._opacity > 0) {
                comment._opacity -= 0.1;
                comment.style.opacity = comment._opacity;
                if(comment._opacity > 0)
                    comment._fadeTimer = setTimeout(function() {
                        fadeOut(comment, complete);
                    }, uiTimer);
                else
                    complete();
            } else
                complete();
        }
        function grow(comment) {
            try{clearTimeout(comment._sizeTimer);}catch(e){}
            if(comment._maxheight > comment._height) {
                comment._height += comment._heightmod;
                commentHeight += comment._heightmod;
                if(commentHeight > 500 && comments.length > 1) {
                    var oldComment = comments.shift();
                    if(oldComment._destroy)
                        return;

                    try{clearTimeout(comment._destroyTimer);}catch(e){}
                    oldComment._destroy = true;
                    commentHeight -= oldComment._height;
                    shrink(oldComment);
                    fadeOut(oldComment, function() {
                        twichOverlay.removeChild(oldComment);
                    });
                }


                if(comment._maxheight > comment._height) {
                    comment.style.height = comment._height + "px";
                    comment._sizeTimer = setTimeout(function() {
                        grow(comment);
                    }, uiTimer);
                } else {
                    comment.style.height = "";
                    var height = comment.offsetHeight;
                    commentHeight += height - comment._height;
                    comment._height = height;
                }
            }
        }
        function shrink(comment) {
            try{clearTimeout(comment._sizeTimer);}catch(e){}
            if(comment._height > 0) {
                comment._height -= comment._heightmod;
                comment.style.height = comment._height + "px";
                if(comment._height > 0)
                    comment._sizeTimer = setTimeout(function() {
                        shrink(comment);
                    }, uiTimer);
            }
        }


        var twitchEmoticons;
        function updateEmoticons(emoticons) {
            twitchEmoticons = [];
            if(!emoticons) {
                slither_bot.warning("No emoticons loaded...");
            } else {
                emoticons.forEach(function(emoticon) {
                    try {
                        twitchEmoticons.push({
                            regex: new RegExp("(^|\W)" + emoticon.regex + "(\W|$)", "g"),
                            src: emoticon.images[0].url
                        });
                    } catch(e) {}
                });
                slither_bot.print("Loaded " + twitchEmoticons.length + " emoticons!");
            }
        }
        slither_bot.parsedEmoticons.connect(updateEmoticons);
        updateEmoticons(slither_bot.emoticons);

        function showTwitchComment(user, text) {
            text = escapeHtml(text);
            twitchEmoticons.forEach(function(emoticon) {
                text = text.replace(emoticon.regex, "<img src=\"" + emoticon.src + "\" />");
            });
            text = text.replace(/(^|\W)(@\w+)(\W|$)/g, "<span color='yellow'>$2</span>");

            var comment = document.createElement("div");
            comment.style.opacity = 0;
            comment._opacity = 0;
            var content = document.createElement("div");
            content.innerHTML = "<b>" + escapeHtml(user) + "</b><br />" + text;
            content.style.maxWidth = twichOverlay.maxWidth;
            content.style.padding = "8px";
            comment.appendChild(content);
            twichOverlay.appendChild(comment);

            comment._height = 0;
            comment._maxheight = comment.offsetHeight;
            comment._heightmod = comment._maxheight / 12;
            comment.style.overflow = "hidden";
            comment.style.height = "0px";
            comments.push(comment);

            comment._destroyTimer = setTimeout(function() {
                comment._destroy = true;
                commentHeight -= comment._height;
                shrink(comment);
                fadeOut(comment, function() {
                    try {
                        twichOverlay.removeChild(comment);
                    } catch(e) {}
                });
            }, 15000);

            setTimeout(function() {
                fadeIn(comment);
                grow(comment);
            }, uiTimer);
        };
        slither_bot.twitchComment.connect(showTwitchComment);

        function updateMessages(messages) {
            randomMessages = messages;
            messageRandom = randomMessages.length-1;
        }
        var randomMessages = [];
        var messageRandom = randomMessages.length-1;
        slither_bot.updateMessages.connect(updateMessages);
        updateMessages(slither_bot.messages);

        setInterval(function() {
            if(randomMessages && Math.random() > 0.8)
                showTwitchComment("QtSlitherBot", randomMessages[Math.round(Math.random() * messageRandom)]);
        }, 30000);

        var pointerPos = [0,0], pointerDest = [0,0];
        var pointerPress = false, pointerPressed = false;
        var pointerDestAlpha = 1;
        var bot_framework = {
            showMessage: function(msg) {
                showTwitchComment("QtSlitherBot", msg);
            },
            isOverriding: function() {
                return overriding;
            },
            isFocused: function() {
                return hasFocus;
            },
            moveMouse: function(x, y) {
                if(!x || !y)
                    throw new Error("Invalid XY Position: " + x + "," + y);
                pointerDest[0] = x;
                pointerDest[1] = y;
            },
            pressMouse: function() {
                pointerPress = true;
            },
            releaseMouse: function() {
                pointerPress = false;
            },
            version: version
        };
        global["bot_impl"](bot_framework, slither_bot);

        var autoRespawn = true;
        window.addEventListener("keydown", function(e) {
            if(global[snake_id]) {
                var keyCode = e.keyCode;
                switch(keyCode) {
                case 82:
                    autoRespawn = !autoRespawn;
                    showTwitchComment("QtSlitherBot", (autoRespawn ? "En" : "Dis") + "abled Auto-Respawn");
                    break;

                case 70:
                    overlayEnabled = !overlayEnabled;
                    showTwitchComment("QtSlitherBot", (overlayEnabled ? "En" : "Dis") + "abled Overlay");
                    visibility = overlayEnabled ? (overriding ? 0.4 : 1) : 0;
                    overlay.style.opacity = visibility;
                    break;

                default:
                    slither_bot.print("Unknown Key: " + keyCode);
                    bot_framework.onkey(keyCode);
                }
            }
        });

        function render() {
            requestAnimationFrame(render);

            var w = window.innerWidth;
            var h = window.innerHeight;
            overlayContext.clearRect(0, 0, w, h);

            overlayContext.beginPath();
            overlayContext.arc(pointerPos[0], pointerPos[1], 15, 0, double_pi, false);
            overlayContext.fillStyle = pointerPressed ? "green" : "red";
            overlayContext.fill();

            if(pointerDestAlpha > 0) {
                overlayContext.beginPath();
                overlayContext.arc(pointerDest[0], pointerDest[1], 15, 0, double_pi, false);
                overlayContext.fillStyle = 'rgba(255, 255, 0, ' + pointerDestAlpha + ')';
                overlayContext.fill();

                pointerDestAlpha -= pointerDestAlpha / 7;
                pointerDestAlpha = Math.round(pointerDestAlpha*100)/100;
            }

            if(global[snake_id]) {
                try {
                    bot_framework.onrender(overlayContext, w, h);
                } catch(e) {
                    slither_bot.critical(e.stack || e);
                }
            }
        }
        requestAnimationFrame(render);

        function readSnake(snake, alwaysAlive) {
            if(!snake || (!alwaysAlive && (snake[snake_dead_id] > 0 || snake[snake_alive_id] < 1)))
                return;

            var parts = [];
            snake[snake_parts_id].forEach(function(part) {
                if(part[snake_part_dying_id])
                    return;

                parts.push({
                               "x": part[snake_part_x_id],
                               "y": part[snake_part_y_id]
                           });
            });

            var angle = snake[snake_exact_angle_id] || snake[snake_angle_id];
            if(angle < 0)
                angle = double_pi+angle;
            return {
                "x": snake[snake_x_id],
                "y": snake[snake_y_id],
                "mx": snake[snake_move_x_id],
                "my": snake[snake_move_y_id],
                "size": snake[snake_size_id],
                "speed": snake[snake_speed_id],
                "angle": angle,
                "parts": parts
            }
        }

        function readPrey(prey) {
            if(!prey)
                return;

            return {
                "x": prey[prey_x_id],
                "y": prey[prey_y_id],
                "size": prey[prey_w_id] / prey_w_threshold
            }
        }

        function readFood(food) {
            if(!food)
                return;

            return {
                "x": food[food_x_id],
                "y": food[food_y_id],
                "size": food[food_w_id] / food_w_threshold
            }
        }

        var running = false;
        function bot_main() {
            try {
                var myself = global[snake_id];
                if(myself) {
                    var dead = myself[snake_dead_id];
                    if(dead === 0) {
                        if(!running) {
                            slither_bot.running();
                            overlay.style.opacity = visibility;
                            running = true;
                        }

                        var snakes = [], foods = [], preys = [];
                        global[snakes_id].forEach(function(snake) {
                            if(snake === myself)
                                return;

                            if((snake = readSnake(snake)))
                                snakes.push(snake);
                        });
                        global[food_id].forEach(function(food) {
                            if((food = readFood(food)))
                                foods.push(food);
                        });
                        global[prey_id].forEach(function(prey) {
                            if((prey = readPrey(prey)))
                                preys.push(prey);
                        });
                        bot_framework.ontick(readSnake(myself, true), snakes, foods, preys, window.innerWidth, window.innerHeight, global[zoom_id]);
                        if(!overriding) {
                            if(pointerPos[0] !== pointerDest[0] || pointerPos[1] !== pointerDest[1]) {
                                pointerPos[0] = pointerDest[0];
                                pointerPos[1] = pointerDest[1];
                                pointerDestAlpha = 1;
                                simulated = true;
                                //slither_bot.print("Simulating mouse move: " + pointerPos[0] + "," + pointerPos[1]);
                                simulate(window, "mousemove", {
                                             pointerX: pointerPos[0],
                                             pointerY: pointerPos[1],
                                             clientX: pointerPos[0],
                                             clientY: pointerPos[1]
                                         });
                            }

                            if(pointerPress !== pointerPressed) {
                                if(pointerPress) {
                                    simulated = true;
                                    simulate(window, "mousedown");
                                } else
                                    simulate(window, "mouseup");
                            }
                        }
                        return;
                    } else {
                        dead = 1-dead;
                        overlay.style.opacity = dead * visibility;
                    }
                }
                if(running) {
                    slither_bot.died();
                    overlay.style.opacity = 0.4;
                    running = false;

                    if(autoRespawn) {
                        var playh = document.getElementById("playh");
                        setTimeout(function() {
                            playh.childNodes[0].click();
                        }, 2000);
                    }
                }
            } catch(e) {
                slither_bot.critical(e.stack || e);
            }
        }
        setInterval(bot_main);

        function giveControl() {
            if(!overriding)
                return;
            try{clearTimeout(resetTimeout)}catch(e){}
            overriding = false;
            visibility = overlayEnabled ? 1 : 0;
            overlay.style.opacity = visibility;
        }

        function returnControl() {
            try{clearTimeout(resetTimeout)}catch(e){}
            resetTimeout = setTimeout(giveControl, 5000);
            if(overriding)
                return;
            overriding = true;
            visibility = overlayEnabled ? 0.4 : 0;
            overlay.style.opacity = visibility;
        }

        function resize() {
            var w = window.innerWidth;
            var h = window.innerHeight;
            overlay.width = w;
            overlay.height = h;
        }
        window.addEventListener("resize", resize);
        window.addEventListener("focus", function() {
            hasFocus = true;
        });
        window.addEventListener("blur", function() {
            hasFocus = false;
            giveControl();
        });
        window.addEventListener("mousedown", function() {
            hasFocus = true;

            if(!simulated && hasFocus)
                returnControl();
            simulated = false;
        });
        resize();

        var resetTimeout;
        window.addEventListener("mousemove", function(e) {
            pointerPos = [e.clientX, e.clientY];

            if(!simulated && hasFocus)
                returnControl();
            simulated = false;
        });
        window.addEventListener("mousedown", function(e) {
            pointerPressed = true;
        });
        window.addEventListener("mouseup", function(e) {
            pointerPressed = false;
        });

        document.body.appendChild(overlay);
        document.body.appendChild(twichOverlay);
        slither_bot.ready();
    }

    if(global["QWebChannel"])
        new QWebChannel(qt.webChannelTransport, function (channel) {
            main(channel.objects.slither_bot);
        });
    else {
        var noop = function(){}
        function updateStatus(state) {
            document.title = "QtSltherBot (" + state + ")";
        }

        main({
             emoticon: noop,
             emoticonCount: noop,
             updateStatus: updateStatus,
             ready: function() {
                 updateStatus("Ready");
             },
             running: function() {
                 updateStatus("Running");
             },
             died: function() {
                 updateStatus("Died");
             },
             twitchComment: {
                 connect: noop
             },
             updateMessages: {
                 connect: noop
             },
             parsedEmoticons: {
                 connect: noop
             },
             print: function(msg) {
                console.log("SlitherBot:", msg)
             },
             warning: function(msg) {
                console.warn("SlitherBot:", msg)
             },
             critical: function(msg) {
                console.error("SlitherBot:", msg)
             },

             messages: []
        });
    }
})(this);


