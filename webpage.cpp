#include "webpage.h"

#include <QDebug>
#include <QWebChannel>
#include <QWebEngineProfile>

#include "botcontroller.h"

WebPage::WebPage(BotController *instance)
{
    profile()->setHttpUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.75 Safari/537.36");
    QWebChannel* channel = new QWebChannel(this);
    channel->registerObject("slither_bot", instance);
    setWebChannel(channel);
}

void WebPage::javaScriptConsoleMessage(const QString &message, int lineNumber, const QString &sourceID) {
    qDebug() << lineNumber << sourceID << message;
}

