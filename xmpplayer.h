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

#ifndef XMPPLAYER_H
#define XMPPLAYER_H

#include <QObject>
#include <QProcess>

class QDir;

class XMPPlayer : public QObject
{
    Q_OBJECT
public:
    XMPPlayer();
    virtual ~XMPPlayer();

    void play(QString directory);

public slots:
    void next();

private slots:
    void _errored(QProcess::ProcessError);
    void _finished();

signals:
    void nowPlaying(QString playing);

private:
    QProcess* xmp;
    QMetaObject::Connection xmpFinished;
    QMetaObject::Connection xmpCrashed;
    QStringList xmFiles;

    void scan(QString dir);
    void _next();
};

#endif // XMPPLAYER_H
