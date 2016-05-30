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

#ifndef SLITHERBOT_H
#define SLITHERBOT_H

#include <QMainWindow>
#include <QSettings>

#include "twitchchat.h"
#include "xmpplayer.h"

namespace Ui {
class SlitherBot;
}

class QLabel;
class BotController;

class SlitherBot : public QMainWindow
{
    Q_OBJECT

public:
    explicit SlitherBot();
    ~SlitherBot();

public slots:
    void closeTab(int tab);
    void newInstance();

signals:
    void updateMessages(QStringList messages);

private:
    friend class BotController;

    Ui::SlitherBot *ui;
    QStringList messages;
    TwitchChat twitchChat;
    QSettings settings;
    XMPPlayer player;
};

#endif // SLITHERBOT_H
