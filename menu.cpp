#include "menu.h"
#include "ui_menu.h"

#include <QFileDialog>
#include <QDesktopServices>

Menu::Menu(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::Menu)
{
    ui->setupUi(this);
    connect(ui->btnXMBrowse, SIGNAL(clicked(bool)), this, SLOT(xmBrowse()));
    connect(ui->btnGenerate, &QPushButton::clicked, [](){
        QDesktopServices::openUrl(QUrl("https://twitchapps.com/tmi/"));
    });
}

Menu::~Menu()
{
    delete ui;
}

QString Menu::xmPath() {
    return ui->txtXMPath->text();
}
void Menu::setXMPath(QString string) {
    ui->txtXMPath->setText(string);
}

QString Menu::twitchChannel() {
    return ui->txtTwitchChannel->text();
}
void Menu::setTwitchChannel(QString string) {
    ui->txtTwitchChannel->setText(string);
}

QString Menu::twitchOAuth() {
    return ui->txtTwitchOAuth->text();
}
void Menu::setTwitchOAuth(QString string) {
    ui->txtTwitchOAuth->setText(string);
}

void Menu::xmBrowse() {
    QFileDialog fileDialog(this);
    QString current = ui->txtXMPath->text();
    if(!current.isEmpty())
        fileDialog.setDirectory(current);
    fileDialog.setAcceptMode(QFileDialog::AcceptOpen);
    fileDialog.setFileMode(QFileDialog::DirectoryOnly);
    if(fileDialog.exec() == QFileDialog::Accepted) {
        QStringList selected = fileDialog.selectedFiles();
        ui->txtXMPath->setText(selected.first());
    }
}
