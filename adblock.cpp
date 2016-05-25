#include "adblock.h"

#include <QDebug>

AdBlock::AdBlock()
{
}

void AdBlock::interceptRequest(QWebEngineUrlRequestInfo &info) {
    if(info.requestUrl().host() == "imasdk.googleapis.com") {
        qWarning() << "Blocking Request" << info.requestUrl();
        info.block(true);
    }
}

