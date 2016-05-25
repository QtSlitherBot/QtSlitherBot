#include "overrides.h"
#include "ui_overrides.h"

// TODO: Implement page and script overrides for the game itself

// This will provide a "quick fix" if the game is patched to
// defeat the bot

Overrides::Overrides(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::Overrides)
{
    ui->setupUi(this);
}

Overrides::~Overrides()
{
    delete ui;
}
