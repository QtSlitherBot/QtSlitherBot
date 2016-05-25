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

// TODO: Pretty much rewrite this code as its very messy...

window.bot_impl = function(framework, slither_bot) {
    var version = "1.7.8~basic";
    var worldlimit = 40000;

    var segments = 16;
    var hit_threshold = 350;
    var rendergame = false;

    framework.onkey = function(keyCode) {
        switch(keyCode) {
        case 68:
            rendergame = !rendergame;
            framework.showMessage((rendergame ? "En" : "Dis") + "abled Game Renderer");
            break;
        }
    };

    var double_pi = Math.PI*2;
    var half_pi = Math.PI/2;
    var halfworld = worldlimit/2;

    var view;
    var boost;
    var maxview;
    var mode = 0;
    var gamedata = [{x:0,y:0},[],[],[],1];
    var viewlimit = 5600;
    var snake_onscreen;
    var trapped = false;
    var max = 999999999;
    var surrounded = false;
    var desiredSegment = -1;
    var maxSegments = segments-1;
    var half_segments = Math.ceil(segments/2);
    var positions = [], wantages = [], wantagesLimit = [];
    var mod = double_pi/segments;
    var half_mod = mod/2;
    for(var i=0; i<segments; i++) {
        var modr = mod*i + half_mod;
        positions.push([modr,Math.round(200 * Math.cos(modr)),Math.round(200 * Math.sin(modr)),Math.round(100 * Math.cos(modr)),Math.round(100 * Math.sin(modr))]);
        wantages.push([0,false]);
        wantagesLimit.push(0);
    }

    var snakePos = [0,0];
    var exclamationScale = 1;
    var food_c, snake_c, prey_c;
    framework.onrender = function(context2d, w, h) {
        var wh = w/2;
        var hh = h/2;
        context2d.font = "12px sans";
        if(rendergame) {
            var offx = gamedata[0].x - wh;
            var offy = gamedata[0].y - hh;
            context2d.fillStyle = "rgba(0, 0, 0, 0.7)";
            context2d.fillRect(0, 0, w, h);

            context2d.fillStyle = 'rgba(255, 0, 0, 0.5)';
            gamedata[0].parts.forEach(function(part) {
                context2d.beginPath();
                context2d.arc(part.x - offx, part.y - offy, 50, 0, double_pi, false);
                context2d.fill();
            });
            context2d.fillStyle = 'red';
            gamedata[1].forEach(function(snake) {
                snake.parts.forEach(function(part) {
                    context2d.beginPath();
                    context2d.arc(part.x - offx, part.y - offy, 50, 0, double_pi, false);
                    context2d.fill();
                });
            });

            var renderFood = function(food) {
                var x = food.x - offx;
                var y = food.y - offy;
                var size = food.size*18;

                var inview = false;
                food.ids.forEach(function(id) {
                    if(food.d+50 <= wantages[id][1])
                        inview = true;
                });
                context2d.fillStyle = inview ? "blue" : "rgba(0, 0, 255, 0.4)";

                try {
                    context2d.beginPath();
                    context2d.arc(x, y, size, 0, double_pi, false);
                    context2d.fill();

                    var s = ""+Math.round(size);
                    var width = context2d.measureText(s).width;
                    context2d.fillText(s, x, y + size + 16);
                } catch(e) {}
            };
            gamedata[2].forEach(renderFood);
            gamedata[3].forEach(renderFood);

            var first = false;
            context2d.lineWidth = 10;
            context2d.strokeStyle = 'white';
            context2d.beginPath();
            for(var i=0; i<segments; i++) {
                var position = positions[i];
                var distance = Math.min(5000, wantages[i][1]);
                var x = Math.round(wh + distance * Math.cos(position[0]));
                var y = Math.round(hh + distance * Math.sin(position[0]));
                if(!first) {
                    context2d.moveTo(x, y);
                    first = [x, y];
                } else
                    context2d.lineTo(x, y);
            }
            context2d.lineTo(first[0], first[1]);
            context2d.stroke();
        }
        for(var i=0; i<segments; i++) {
            var wantage = wantages[i][0];
            var snakeDistance = wantages[i][1];
            var isWanted = desiredSegment == i;
            var rr, gg, bb;
            var limit = wantagesLimit[i];
            if(wantage === 0) {
                var lim = limit / 1;
                if(lim > 1)
                    lim = 0;
                if(limit > 0)
                    wantagesLimit[i] = limit -= limit/4;
                rr = gg = bb = Math.round(lim*255);
            } else if(wantage > 0) {
                if(limit < 0.1)
                    limit = 0.1;
                else
                    limit += (wantage - limit) / 7;
                wantagesLimit[i] = limit;

                gg = wantage / limit;
                if(gg > 1) {
                    gg -= 1;
                    gg /= 1;
                    if(gg > 1)
                        gg = 1;

                    rr = bb = Math.round(gg*150);
                    gg = 255;
                } else {
                    gg = Math.round(gg*255);
                    rr = bb = 0;
                }
            } else if(wantage < 0) {
                if(limit < 0.1)
                    limit = 0.1;
                else
                    limit += (-wantage - limit) / 7;
                wantagesLimit[i] = limit;

                rr = -wantage / limit;
                if(rr > 1) {
                    rr -= 1;
                    rr /= 1;
                    if(rr > 1)
                        rr = 1;

                    gg = bb = Math.round(rr*150);
                    rr = 255;
                } else {
                    rr = Math.round(rr*255);
                    gg = bb = 0;
                }
            }

            var start = mod*i;
            context2d.beginPath();
            context2d.moveTo(wh, hh);
            context2d.arc(wh, hh, 250, start, start+mod, false);
            context2d.fillStyle = 'rgba(' + rr + ', ' + gg + ', ' + bb + ', 0.4)';
            context2d.fill();

            var position = positions[i];
            if(snakeDistance < max) {
                context2d.beginPath();
                context2d.moveTo(wh, hh);
                context2d.arc(wh, hh, 150, start, start+mod, false);
                context2d.fillStyle = 'rgba(255, 255, 255, 0.4)';
                context2d.fill();

                context2d.fillStyle = "black";
                snakeDistance = "" + Math.round(snakeDistance/10);
                var measured = context2d.measureText(snakeDistance);
                context2d.fillText(snakeDistance, wh + position[3] - measured.width/2, hh + position[4] + 8);
            }

            if(isWanted) {
                context2d.beginPath();
                context2d.moveTo(wh, hh);
                context2d.arc(wh, hh, 50, start, start+mod, false);
                switch(mode) {
                case 0:
                    context2d.fillStyle = 'rgba(255, 255, 255, 0.4)';
                    break;
                case 1:
                    context2d.fillStyle = 'rgba(0, 0, 255, 0.4)';
                    break;
                case 2:
                    context2d.fillStyle = 'rgba(255, 0, 0, 0.4)';
                    break;
                case 3:
                    context2d.fillStyle = 'rgba(0, 255, 0, 0.4)';
                    break;

                default:
                    context2d.fillStyle = 'rgba(0, 0, 0, 0.4)';
                }
                context2d.fill();
            }

            wantage = ""+Math.round(wantage*100)/100;
            context2d.fillStyle = "white";
            var measured = context2d.measureText(wantage);
            context2d.fillText(wantage, wh + position[1] - measured.width/2, hh + position[2] + 8);
        }

        context2d.font = "22px sans";
        var lines = ["Debugging Information", "Framework Version: " + framework.version, "Bot Version: " + version, "", "Snake Position:", Math.round(snakePos[0]) + "," + Math.round(snakePos[1]), "Food In View: " + food_c, "Prey In View: " + prey_c, "Snakes In View: " + snake_c, "View Distance: " + maxview, "Snake in View: " + (snake_onscreen ? "Yes" : "No"), "Boosting: " + (boost ? "Yes" : "No"), "Has Focus: " + (framework.isFocused() ? "Yes" : "No"), "", "Connected to:", window['ws'].url];

        var width = 0;
        lines.forEach(function(line) {
            width = Math.max(width, context2d.measureText(line).width);
        });

        context2d.fillStyle = "rgba(0, 0, 0, 0.7)";
        context2d.fillRect(0, 0, width + 24, 28 + (22*lines.length));

        var y = 12;
        context2d.fillStyle = "white";
        lines.forEach(function(line) {
            y += 22;
            context2d.fillText(line, 12, y);
        });

        if(surrounded) {
            context2d.save();
            context2d.translate(wh, hh);
            context2d.fillStyle = "rgba(255, 0, 0, 1)";
            context2d.beginPath();
            context2d.arc(0, 0, 50, 0, 0, double_pi, false);
            context2d.fill();
            context2d.fillStyle = "rgba(255, 0, 0, 0.4)";
            context2d.scale(exclamationScale,exclamationScale);
            context2d.beginPath();
            context2d.arc(wh, hh, 50, 0, 0, double_pi, false);
            context2d.fill();
            context2d.restore();

            exclamationScale += exclamationScale/7;
            if(exclamationScale > 3)
                exclamationScale = 1;
        } else if(trapped) {
            context2d.save();
            context2d.translate(wh, hh);
            context2d.fillStyle = "rgba(255, 0, 0, 1)";
            context2d.fillRect(-10, -40, 20, 50);
            context2d.fillRect(-10, 20, 20, 20);
            context2d.fillStyle = "rgba(255, 0, 0, 0.4)";
            context2d.scale(exclamationScale,exclamationScale);
            context2d.fillRect(-10, -40, 20, 50);
            context2d.fillRect(-10, 20, 20, 20);
            context2d.restore();

            exclamationScale += exclamationScale/7;
            if(exclamationScale > 3)
                exclamationScale = 1;
        }
    };

    var currentRotation = 0;
    framework.ontick = function(myself, snakes, food, prey, w, h, zoom) {
        mode = -1;
        snakePos = [myself.x, myself.y];

        if(rendergame) {
            gamedata[0] = myself;
            gamedata[1] = snakes;
            gamedata[2] = food;
            gamedata[3] = prey;
            gamedata[4] = zoom;
        }

        desiredSegment = -1;
        surrounded = false;
        food_c = food.length;
        prey_c = prey.length;
        snake_c = snakes.length;
        for(var i=0; i<segments; i++) {
            wantages[i][0] = 0;
            wantages[i][1] = max;
        }
        var xx = myself.x + myself.mx;
        var yy = myself.y + myself.my;
        var process = function(object) {
            var r = Math.atan2(object.y - yy, object.x - xx);
            if(r < 0)
                r = Math.PI + (Math.PI+r);
            object.r = r;

            var id = (r/double_pi)*segments;
            var minid = Math.floor(id - 0.25);
            if(minid < 0)
                minid = maxSegments;
            var maxid = Math.ceil(id + 0.25);
            if(maxid >= segments)
                maxid = 0;

            object.id = id;
            object.ids = [minid];
            if(minid != maxid)
                object.ids.push(maxid);

            object.d = Math.sqrt(Math.pow(object.x-xx, 2) + Math.pow(object.y-yy, 2));
        };
        snakes.forEach(function(snake) {
            process(snake);

            var diff = Math.abs(((myself.angle - snake.angle) + Math.PI) % double_pi - Math.PI);
            diff /= Math.PI;
            diff = 1-diff;

            var cos = Math.cos(snake.angle);
            var sin = Math.sin(snake.angle);
            if(snake.speed > myself.speed && diff < 0.5) {
                snake.parts.push({
                    "x": snake.x + snake.speed * cos,
                    "y": snake.y + snake.speed * sin
                });
                snake.parts.push({
                    "x": snake.x + (snake.speed*2) * cos,
                    "y": snake.y + (snake.speed*2) * sin
                });
            } else
                prey.push({
                    "x": snake.x + 100 * cos,
                    "y": snake.y + 100 * sin,
                    "size": diff*3
                });
            snake.parts.forEach(process);
        });
        food.forEach(function(food) {
            food.food = true;
            process(food);
        });
        prey.forEach(function(prey) {
            prey.prey = true;
            process(prey);
        });

        view = boost ? 800 : 350;
        var processSnakePart = function(part, mod) {
            if(part.d > view)
                return;

            part.ids.forEach(function(id) {
                if(wantages[id][0] >= 0)
                    wantages[id][0] = 0;
                wantages[id][0] -= mod;
                wantages[id][1] = Math.min(wantages[id][1], part.d);
            });
        };
        snakes.forEach(function(snake) {
            snake.parts.forEach(function(part) {
                processSnakePart(part, 1);
            });
            processSnakePart(snake, 3);
        });
        var incompleteWantage = true, seesFood = false;
        while(view <= viewlimit) {
            if(incompleteWantage)
                maxview = view;
            processSnakePart = function(part) {
                if(part.d > view)
                    return;

                var mod = 1 - (part.d / viewlimit);

                part.ids.forEach(function(id){
                    if(wantages[id][0] >= 0)
                        wantages[id][0] = 0;
                    wantages[id][0] -= mod*0.004;
                    wantages[id][1] = Math.min(wantages[id][1], part.d);
                });

            };
            snakes.forEach(function(snake) {
                snake.parts.forEach(function(part) {
                    processSnakePart(part);
                });
                processSnakePart(snake);
            });
            var processFood = function(food) {
                if((food.size > 1 && food.d > view) || (food.d > maxview && food.size <= 1))
                    return;

                food.ids.forEach(function(id) {
                    if(food.d+50 <= wantages[id][1]) {
                        var dist = food.d / viewlimit;
                        dist = 1 - dist;
                        if(dist <= 0 || dist > 1)
                            return;

                        if(food.size > 1)
                            wantages[id][0] += Math.pow(food.size, 3)*dist;
                        else {
                            var diff = Math.abs(((myself.angle - food.r) + Math.PI) % double_pi - Math.PI);
                            diff /= Math.PI;
                            diff = 1.0-diff;
                            if(diff > 1 || diff <= 0)
                                return;

                            wantages[id][0] += food.size*diff*dist;
                        }
                    }
                });
            };
            food.forEach(processFood);
            prey.forEach(processFood);
            var negative = 0;
            for(var i=0; i<segments; i++) {
                var wantage = wantages[i][0];
                if(wantage < 0)
                    negative ++;
                else if(wantage >= 3) {
                    incompleteWantage = false;
                    seesFood = true;
                    break;
                } else if(wantage > 0)
                    seesFood = true;
            }
            if(negative === segments) {
                surrounded = true;
                incompleteWantage = false;
                break;
            }

            view *= 2;
        }

        if(!seesFood) {
            var r, id;
            try {
                r = Math.atan2(halfworld - yy, halfworld - xx);
                if(r < 0)
                    r = Math.PI + (Math.PI+r);
                id = Math.floor((r/double_pi)*segments);
                wantages[id][0] += 0.1;
            } catch(e) {
                slither_bot.print(r);
                slither_bot.print(id);
            }
        }

        var ang = Math.floor((myself.angle / double_pi) * segments);
        if(!surrounded && (trapped = (wantages[ang][1] < hit_threshold))) {
            var minleft = [-1,10,-max];
            var minright = [-1,10,-max];

            var nang = ang;
            for(var i=0; i<half_segments; i++) {
                nang ++;
                if(nang >= segments)
                    nang = 0;

                var wantage = wantages[nang][0];
                if(wantage > minright[2]) {
                    minright[0] = nang;
                    minright[1] = i;
                    minright[2] = wantage;
                }
            }
            nang = ang;
            for(var i=0; i<half_segments; i++) {
                nang --;
                if(nang < 0)
                    nang = maxSegments;

                var wantage = wantages[nang][0];
                if(wantage > minleft[2]) {
                    minleft[0] = nang;
                    minleft[1] = i;
                    minleft[2] = wantage;
                }
            }

            var r;
            if(minleft[1] < minright[1])
                r = positions[minleft[0]];
            else if(minright[0] > -1)
                r = positions[minright[0]];
            else
                return;
            framework.moveMouse(w/2 + r[1], h/2 + r[2]);
            mode = 0;
            return;
        }

        var maxSegment = [-1, -max];
        for(var i=0; i<segments; i++) {
            var wantage = wantages[i][0];
            if(wantage > maxSegment[1]) {
                maxSegment[0] = i;
                maxSegment[1] = wantage;
            }
        }
        desiredSegment = maxSegment[0];

        var minSeg, maxSeg;

        snake_onscreen = false;
        var snake_nearme = false;
        for(var i=0; i<segments; i++) {
            if(wantages[i][0] < 0) {
                snake_onscreen = true;
                break;
            }
            if(wantages[i][1] < 50)
                snake_nearme = true;
        }

        var seg = maxSegment[0];
        if(snake_onscreen) {
            minSeg = seg-1;
            if(minSeg < 0)
                minSeg = maxSegments;

            maxSeg = seg+1;
            if(maxSeg > maxSegments)
                maxSeg = 0;
        }

        maxSegment[1] = max;
        var processSegmentDirection = function(food) {
            if((food.ids.indexOf(seg) !== -1 || (snake_onscreen && (food.ids.indexOf(minSeg) !== -1 || food.ids.indexOf(maxSeg) !== -1))) && food.d < maxSegment[1] && food.d < wantages[maxSegment[0]][1]) {
                maxSegment[1] = food.d;
                maxSegment[2] = food.r;
                maxSegment[3] = food.prey;
            }
        }
        prey.forEach(processSegmentDirection);
        food.forEach(processSegmentDirection);

        boost = surrounded || maxSegment[3];
        if(!boost && !trapped)
            snakes.forEach(function(snake) {
                if(snake.d < hit_threshold && snake.speed > myself.speed)
                    boost = true;
            });

        var desiredAngle = maxSegment[2]||positions[maxSegment[0]][0];
        if(!surrounded && snake_nearme) {
            var dang = Math.floor(desiredAngle/double_pi*segments);
            if(dang == ang) {
                framework.moveMouse(w/2 + 200 * Math.cos(desiredAngle), h/2 + 200 * Math.sin(desiredAngle));
                mode = 1;
            } else {
                var minleft = [-1,10,-max];
                var minright = [-1,10,-max];

                var nang = ang;
                var startWantage = wantages[ang][0];
                for(var i=0; i<half_segments; i++) {
                    nang ++;
                    if(nang >= segments)
                        nang = 0;

                    var wantage = wantages[nang];
                    if(wantage[1] < hit_threshold && wantage[0] < startWantage)
                        break;
                    if(wantage[0] > startWantage && wantage[0] > minright[2]) {
                        minright[0] = nang;
                        minright[1] = i;
                        minright[2] = wantage[0];
                    }

                    if(nang == dang)
                        break;
                }
                nang = ang;
                for(var i=0; i<half_segments; i++) {
                    nang --;
                    if(nang < 0)
                        nang = maxSegments;

                    var wantage = wantages[nang];
                    if(wantage[1] < hit_threshold && wantage[0] < startWantage)
                        break;
                    if(wantage[0] > startWantage && wantage[0] > minleft[2]) {
                        minleft[0] = nang;
                        minleft[1] = i;
                        minleft[2] = wantage[0];
                    }

                    if(nang == dang)
                        break;
                }

                var r;
                if(minleft[0] > -1 && minleft[1] < minright[1])
                    r = positions[minleft[0]];
                else if(minright[0] > -1)
                    r = positions[minright[0]];
                if(r) {
                    framework.moveMouse(w/2 + r[1], h/2 + r[2]);
                    mode = 2;
                } else
                    mode = 3;
            }
        } else {
            framework.moveMouse(w/2 + 200 * Math.cos(desiredAngle), h/2 + 200 * Math.sin(desiredAngle));
            mode = 1;
        }

        if(boost)
            framework.pressMouse();
        else
            framework.releaseMouse();
    }
};
