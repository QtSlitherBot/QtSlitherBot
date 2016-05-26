#include "botinstance.h"

#include "webpage.h"

#include <QWebEngineSettings>
#include <QApplication>
#include <QMouseEvent>
#include <QDebug>
#include <QFile>

BotInstance::BotInstance() : frame(0)
{}

void BotInstance::init(BotController *controller) {
    WebPage* webPage = new WebPage(controller);
    setPage(webPage);

    setUrl(QUrl("http://slither.io/"));
    connect(this, SIGNAL(loadFinished(bool)), this, SLOT(injectStorm()));
    connect(this, SIGNAL(renderProcessTerminated(QWebEnginePage::RenderProcessTerminationStatus,int)), this, SLOT(crashed()));
}

void BotInstance::crashed() {
    setHtml("Render Process Crashed");
}

void BotInstance::injectStorm() {
    QFile qwebchannel(":/qtwebchannel/qwebchannel.js");
    qwebchannel.open(QFile::ReadOnly);
    page()->runJavaScript(QString(qwebchannel.readAll()));

    /*QFile bot(":/bot.js");
    bot.open(QFile::ReadOnly);
    page()->runJavaScript(QString(bot.readAll()));*/

    QFile bot(":/basic_bot.js");
    bot.open(QFile::ReadOnly);
    page()->runJavaScript(QString(bot.readAll()));

    QFile botFramework(":/bot_framework.js");
    botFramework.open(QFile::ReadOnly);
    page()->runJavaScript(QString(botFramework.readAll()));

    //page()->mainFrame()->addToJavaScriptWindowObject("slither_bot", this);
    //page()->mainFrame()->evaluateJavaScript(QString(bot.readAll()));
    //pageAction(QWebPage::InspectElement)->trigger();
}
