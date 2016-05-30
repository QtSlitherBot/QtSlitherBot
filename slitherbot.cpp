#include "slitherbot.h"
#include "ui_slitherbot.h"
#include "botinstance.h"
#include "botcontroller.h"
#include "webpage.h"
#include "menu.h"

#include <QMessageBox>
#include <QToolButton>
#include <QPushButton>
#include <QToolBar>
#include <QLabel>

SlitherBot::SlitherBot() :
    ui(new Ui::SlitherBot)
{
    ui->setupUi(this);
    connect(ui->tabWidget, SIGNAL(tabCloseRequested(int)), this, SLOT(closeTab(int)));
    //connect(ui->actionCreate, SIGNAL(triggered(bool)), this, SLOT(newInstance()));

    QToolBar *toolBar = new QToolBar;
    QLabel* nowPlaying = new QLabel();
    connect(&player, SIGNAL(nowPlaying(QString)), nowPlaying, SLOT(setText(QString)));
    toolBar->addWidget(nowPlaying);
    nowPlaying->setText("Now Playing: ...");

    QWidget* spacer = new QWidget();
    spacer->setMinimumWidth(12);
    toolBar->addWidget(spacer);

    QPushButton* button = new QPushButton();
    button->setText("New Tab");
    connect(button, SIGNAL(clicked(bool)), this, SLOT(newInstance()));
    toolBar->addWidget(button);

    button = new QPushButton();
    button->setText("Next Song");
    connect(button, SIGNAL(clicked(bool)), &player, SLOT(next()));
    toolBar->addWidget(button);

    button = new QPushButton();
    button->setText("Menu");
    connect(button, &QPushButton::clicked, [=]() {
        Menu menu(this);
        menu.setMessages(messages);
        menu.setXMPath(settings.value("xmpath", "").toString());
        menu.setTwitchChannel(settings.value("twitchchannel", "").toString());
        menu.setTwitchOAuth(settings.value("twitchoauth", "").toString());
        if(menu.exec() == QDialog::Accepted) {
            QString xmPath = menu.xmPath();
            QString twitchOAuth = menu.twitchOAuth();
            QString twitchChannel = menu.twitchChannel();
            QStringList messages = menu.messages();

            settings.setValue("xmpath", xmPath);
            settings.setValue("twitchoauth", twitchOAuth);
            settings.setValue("twitchchannel", twitchChannel);
            settings.setValue("messages", messages);

            emit updateMessages(messages);
            this->messages = messages;

            player.play(xmPath);
        }
    });
    toolBar->addWidget(button);

    ui->tabWidget->setCornerWidget(toolBar);

    QString xmPath = settings.value("xmpath").toString();
    if(!xmPath.isEmpty())
        player.play(xmPath);

    QString oauth = settings.value("twitchoauth").toString();
    QString channel = settings.value("twitchchannel").toString();
    if(!oauth.isEmpty() && !channel.isEmpty())
        twitchChat.connect(channel, oauth);

    messages = settings.value("messages").toStringList();

    QMetaObject::invokeMethod(&player, "next", Qt::QueuedConnection);
    QMetaObject::invokeMethod(this, "newInstance", Qt::QueuedConnection);
}

void SlitherBot::closeTab(int tab) {
    if(ui->tabWidget->count() < 2) {
        if(QMessageBox::question(this, "Close", "Closing the last tab will exit the program, continue?") == QMessageBox::Yes)
            qApp->quit();
        return;
    }
    ui->tabWidget->widget(tab)->deleteLater();
    ui->tabWidget->removeTab(tab);
}

void SlitherBot::newInstance() {
    BotInstance* instance = new BotInstance();
    ui->tabWidget->addTab(instance, "Bot (Loading)");
    BotController* controller = new BotController(instance, this);
    connect(&twitchChat, SIGNAL(comment(QString,QString)), controller, SIGNAL(twitchComment(QString,QString)));
    connect(&twitchChat, SIGNAL(parsedEmoticons(QVariantList)), controller, SIGNAL(parsedEmoticons(QVariantList)));
    connect(this, SIGNAL(updateMessages(QStringList)), controller, SIGNAL(updateMessages(QStringList)));
    instance->init(controller);
}

SlitherBot::~SlitherBot()
{
    delete ui;
}
