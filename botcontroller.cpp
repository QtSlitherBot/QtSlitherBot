#include "botcontroller.h"
#include "slitherbot.h"

BotController::BotController(QTabWidget *tabWidget, BotInstance* bot) : QObject(bot)
{
    this->bot = bot;
    this->tabs = tabWidget;
}

void BotController::critical(QString message) {
    qCritical() << message;
}

void BotController::warning(QString message) {
    qWarning() << message;
}

void BotController::print(QString message) {
    qDebug() << message;
}

void BotController::updateStatus(QString state) {
    int index = tabs->indexOf(bot);
    if(index == -1)
        return;

    tabs->setTabText(index, QString("Bot (%1)").arg(state));
}

