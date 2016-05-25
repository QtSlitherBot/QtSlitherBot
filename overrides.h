/*
    This file is part of QtSlitherBot.

    QtSlitherBot is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    QtSlitherBot is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with QtSlitherBot.  If not, see <http://www.gnu.org/licenses/>.
*/

#ifndef OVERRIDES_H
#define OVERRIDES_H

#include <QDialog>

namespace Ui {
class Overrides;
}

class Overrides : public QDialog
{
    Q_OBJECT

public:
    explicit Overrides(QWidget *parent = 0);
    ~Overrides();

private:
    Ui::Overrides *ui;
};

#endif // OVERRIDES_H
