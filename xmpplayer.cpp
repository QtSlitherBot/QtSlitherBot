#include "xmpplayer.h"

#include <QMetaEnum>
#include <QDebug>
#include <QTime>
#include <QDir>

XMPPlayer::XMPPlayer() : xmp(0)
{
    qsrand(QTime::currentTime().msec());
}

void XMPPlayer::play(QString directory) {
    xmFiles.clear();
    scan(directory);
    if(xmFiles.isEmpty())
        qFatal("Could not find music...");
    else {
        qDebug() << "Found" << xmFiles.size() << "songs";
        _next();
    }
}

XMPPlayer::~XMPPlayer() {
    if(xmp)
        xmp->kill();
}

void XMPPlayer::next() {
    if(xmp != 0) {
        xmp->disconnect(xmpFinished);
        xmp->disconnect(xmpCrashed);
        xmp->kill();
        xmp->deleteLater();
    }

    _next();
}

void XMPPlayer::_next() {
    if(xmFiles.isEmpty()) {
        xmp = 0;
        return;
    }

    qreal rand = (qreal)qrand()/(qreal)RAND_MAX;
    QString random = xmFiles.at(qRound(rand * (qreal)(xmFiles.size()-1)));

    xmp = new QProcess();
    xmpCrashed = connect(xmp, SIGNAL(error(QProcess::ProcessError)), this, SLOT(_errored(QProcess::ProcessError)));
    xmpFinished = connect(xmp, SIGNAL(finished(int)), this, SLOT(_finished()));
    xmp->start("xmp", QStringList() << random);

    emit nowPlaying(QString("Now Playing: %1").arg(QFileInfo(random).fileName()));
}

void XMPPlayer::_finished() {
    xmp->deleteLater();
    _next();
}

void XMPPlayer::_errored(QProcess::ProcessError error) {
    static QMetaEnum metaEnum = QMetaEnum::fromType<QProcess::ProcessError>();
    const char* key = metaEnum.valueToKey(error);
    qWarning() << "Process failed to start" << key;
    emit nowPlaying(QString("XMP Error: %1").arg(key));
}

void XMPPlayer::scan(QString dir) {
    foreach(QFileInfo info, QDir(dir).entryInfoList(QDir::Dirs | QDir::Files | QDir::NoDotAndDotDot)) {
        if(info.isDir())
            scan(info.absoluteFilePath());
        else if(info.fileName().endsWith(".xm", Qt::CaseInsensitive))
            xmFiles.append(info.absoluteFilePath());
    }
}

