#ifndef MESSAGES_H
#define MESSAGES_H

#include <QDialog>

namespace Ui {
class Messages;
}

class Messages : public QDialog
{
    Q_OBJECT

public:
    explicit Messages(QWidget *parent = 0);
    ~Messages();

    void setList(QStringList);
    QStringList list();

private:
    Ui::Messages *ui;
};

#endif // MESSAGES_H
