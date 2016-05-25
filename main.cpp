#include "slitherbot.h"
#include <QApplication>
#include <QWebEngineProfile>

#include "adblock.h"

// pactl load-module module-null-sink sink_name=Virtual1

int main(int argc, char *argv[])
{
#ifdef QT_DEBUG
    qputenv("QTWEBENGINE_REMOTE_DEBUGGING", "23654");
#endif

    QApplication a(argc, argv);
    a.setOrganizationName("NexusTools");
    a.setOrganizationDomain("com.nexustools");
    a.setApplicationDisplayName("Slither.IO Qt Bot");
    a.setApplicationName("SlitherBot");

    QWebEngineProfile::defaultProfile()->setRequestInterceptor(new AdBlock());

    SlitherBot slitherBot;
    slitherBot.show();

    return a.exec();
}
