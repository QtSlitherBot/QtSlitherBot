#include "twitchchat.h"

#include <QWebSocket>
#include <QMetaEnum>
#include <QDebug>
#include <QFile>

QRegExp TwitchChat::message("^@.+display-name=([^;]+);.+\\.tmi\\.twitch\\.tv PRIVMSG #\\w+ :(.+)\r\n$");
QRegExp TwitchChat::ping("^\\s*PING\\s*\r\n$");

TwitchChat::TwitchChat() : wsocket(0)
{

    autoReconnect.setInterval(500);
    autoReconnect.setSingleShot(true);
    QObject::connect(&autoReconnect, SIGNAL(timeout()), this, SLOT(connect()));
}

void TwitchChat::connect(QString channel, QString oauth) {
    channel = channel.toLower(); // Is this required?
    if(channel == this->channel && oauth == this->oauth)
        return;

    this->channel = channel;
    this->oauth = oauth;

    connect();
}

void TwitchChat::connect() {
    if(wsocket != 0)
        wsocket->deleteLater();

    qDebug() << "Connecting to TwitchChat";

    autoReconnect.stop();
    wsocket = new QWebSocket();
    QObject::connect(wsocket, SIGNAL(connected()), this, SLOT(connected()));
    QObject::connect(wsocket, SIGNAL(error(QAbstractSocket::SocketError)), this, SLOT(error(QAbstractSocket::SocketError)));
    QObject::connect(wsocket, SIGNAL(textMessageReceived(QString)), this, SLOT(receive(QString)));
    wsocket->open(QUrl("ws://irc-ws.chat.twitch.tv:80/"));
}

void TwitchChat::connected() {
    qDebug() << "Connected to TwitchChat!";
    wsocket->sendTextMessage("CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership");
    wsocket->sendTextMessage(QString("PASS %1").arg(oauth));
    wsocket->sendTextMessage(QString("NICK %1").arg(channel));
    wsocket->sendTextMessage(QString("JOIN #%1").arg(channel));
}

void TwitchChat::receive(QString msg) {
    if(message.exactMatch(msg))
        emit comment(message.cap(1), message.cap(2));
    else if(ping.exactMatch(msg)) {
        qDebug() << "Received ping" << msg;
        wsocket->sendTextMessage("PONG :tmi.twitch.tv");
        qDebug() << "Sent pong";
    }
}

void TwitchChat::error(QAbstractSocket::SocketError error) {
    QMetaEnum metaEnum = QMetaEnum::fromType<QAbstractSocket::SocketError>();
    qCritical() << "TwitchChat Error" << metaEnum.valueToKey(error);
    autoReconnect.start();
}

