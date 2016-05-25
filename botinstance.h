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

#ifndef BOTINSTANCE_H
#define BOTINSTANCE_H

#include <QWebEngineView>

class BotController;

class BotInstance : public QWebEngineView
{
    Q_OBJECT
public:
    BotInstance();

    void init(BotController* controller);

private slots:
    void injectStorm();
    void crashed();

private:
    int frame;
};

#endif // BOTINSTANCE_H
