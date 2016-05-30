#include "botcontroller.h"
#include "ui_slitherbot.h"
#include "slitherbot.h"

BotController::BotController(BotInstance* bot, SlitherBot *slither) : QObject(bot)
{
    this->bot = bot;
    this->slither = slither;
}

QVariantList BotController::emoticons() {
    return slither->twitchChat.emoticons;
}

QStringList BotController::messages() {
    return slither->messages;
}

void BotController::critical(QString message) {
    qCritical() << message.toLocal8Bit().data();
}

void BotController::warning(QString message) {
    qWarning() << message.toLocal8Bit().data();
}

void BotController::print(QString message) {
    qDebug() << message.toLocal8Bit().data();
}

void BotController::updateStatus(QString state) {
    int index = slither->ui->tabWidget->indexOf(bot);
    if(index == -1)
        return;

    slither->ui->tabWidget->setTabText(index, QString("Bot (%1)").arg(state));
}


