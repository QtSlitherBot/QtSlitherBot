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

#ifndef TWITCHCHAT_H
#define TWITCHCHAT_H

#include <QObject>
#include <QAbstractSocket>
#include <QRegExp>
#include <QTimer>

class QWebSocket;

class TwitchChat : public QObject
{
    Q_OBJECT
public:
    explicit TwitchChat();

    void connect(QString channel, QString oauth);

private slots:
    void connect();
    void connected();
    void receive(QString);
    void error(QAbstractSocket::SocketError);

signals:
    void comment(QString user, QString comment);

private:
    QString oauth;
    QString channel;
    QTimer autoReconnect;
    static QRegExp message;
    static QRegExp ping;
    QWebSocket* wsocket;
};

#endif // TWITCHCHAT_H
