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

#ifndef BOTCONTROLLER_H
#define BOTCONTROLLER_H

#include <QTabWidget>
#include "botinstance.h"

class TwitchChat;

class BotController : public QObject
{
    Q_OBJECT

    Q_PROPERTY(QVariantList emoticons READ emoticons NOTIFY parsedEmoticons)
public:
    explicit BotController(QTabWidget *tabs, BotInstance* bot, TwitchChat* chat);

    QVariantList emoticons();

signals:
    void twitchComment(QString user, QString comment);
    void parsedEmoticons(QVariantList emoticons);

public slots:
    void critical(QString message);
    void warning(QString message);
    void print(QString message);

    inline void ready() {
        updateStatus("Ready");
    }
    inline void running() {
        updateStatus("Running");
    }
    inline void died() {
        updateStatus("Died");
    }
    void updateStatus(QString state);

private:
    QTabWidget *tabs;
    BotInstance* bot;
    TwitchChat* chat;
};

#endif // BOTCONTROLLER_H
