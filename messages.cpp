#include "messages.h"
#include "ui_messages.h"

#include <QInputDialog>

Messages::Messages(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::Messages)
{
    ui->setupUi(this);

    connect(ui->btnAdd, &QPushButton::clicked, [=]() {
        QString message = QInputDialog::getText(this, "New Message", "");
        if(!message.isEmpty())
            ui->listWidget->addItem(message);
    });
}

Messages::~Messages()
{
    delete ui;
}

void Messages::setList(QStringList messages) {
    ui->listWidget->clear();
    ui->listWidget->addItems(messages);
}

QStringList Messages::list() {
    QStringList list;
    for(int i=0; i<ui->listWidget->count(); i++)
        list << ui->listWidget->item(i)->text();
    return list;
}
