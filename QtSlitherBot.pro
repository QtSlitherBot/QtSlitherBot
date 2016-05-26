#-------------------------------------------------
#
# Project created by QtCreator 2016-04-17T16:24:41
#
#-------------------------------------------------

QT       += core gui webengine webenginewidgets websockets

TARGET = SlitherBot
TEMPLATE = app

CONFIG += c++11

SOURCES += main.cpp\
    webpage.cpp \
    botinstance.cpp \
    adblock.cpp \
    botcontroller.cpp \
    slitherbot.cpp \
    twitchchat.cpp \
    menu.cpp \
    overrides.cpp \
    xmpplayer.cpp

HEADERS  += \
    webpage.h \
    botinstance.h \
    adblock.h \
    botcontroller.h \
    slitherbot.h \
    twitchchat.h \
    menu.h \
    overrides.h \
    xmpplayer.h

FORMS    += \
    menu.ui \
    slitherbot.ui \
    overrides.ui

DISTFILES += \
    bot_framework.js \
    basic_bot.js \
    adv_bot.js \
    tamper.user.js

RESOURCES += \
    resources.qrc
