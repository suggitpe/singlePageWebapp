/*jslint browser : true, continue : true,
 devel : true, indent : 4, maxerr : 50,
 newcap : true, nomen : true, plusplus : true,
 regexp : true, sloppy : true, vars : false,
 white : true
 */
/*global $, spa */
spa.shell = (function () {
    var configMap = {
            anchorSchemaMap: {
                chat: {open: true, closed: true}
            },
            main_html: String() +
                '<div class="spa-shell-head">' +
                '<div class="spa-shell-head-logo"></div>' +
                '<div class="spa-shell-head-acct"></div>' +
                '<div class="spa-shell-head-search"></div>' +
                '</div>' + '<div class="spa-shell-main">' +
                '<div class="spa-shell-main-nav"></div>' +
                '<div class="spa-shell-main-content"></div>' +
                '</div>' +
                '<div class="spa-shell-foot"></div>' +
                '<div class="spa-shell-chat"></div>' +
                '<div class="spa-shell-modal"></div>',

            chatExtendTime: 300,
            chatRetractTime: 300,
            chatExtendHeight: 450,
            chatRetractHeight: 15,
            chatExtendedTitle: 'Click to retract',
            chatRetractedTitle: 'Click to extract'
        },
        stateMap = {
            $container: null,
            anchorMap: {},
            isChatRetracted: true
        },
        jqueryMap = {},

        copyAnchorMap,
        setJqueryMap,
        toggleChat,
        changeAnchorPart,
        onHashChange,
        onClickChat,
        initModule;

    copyAnchorMap = function () {
        return $.extend(true, {}, stateMap.anchorMap);
    };

    setJqueryMap = function () {
        var $container = stateMap.$container;
        jqueryMap = {
            $container: $container,
            $chat: $container.find('.spa-shell-chat')
        };
    };

    toggleChat = function (doExtend, callback) {
        var
            pxChatHeight = jqueryMap.$chat.height(),
            isOpen = pxChatHeight === configMap.chatExtendHeight,
            isClosed = pxChatHeight === configMap.chatRetractHeight,
            isSliding = !isOpen && !isClosed;

        if (isSliding) {
            return false;
        }

        if (doExtend) {
            jqueryMap.$chat.animate(
                { height: configMap.chatExtendHeight },
                configMap.chatExtendTime,
                function () {
                    jqueryMap.$chat.attr('title', configMap.chatExtendedTitle);
                    stateMap.isChatRetracted = false;
                    if (callback) {
                        callback(jqueryMap.$chat);
                    }
                }
            );
            return true;
        }

        jqueryMap.$chat.animate(
            { height: configMap.chatRetractHeight },
            configMap.chatRetractTime,
            function () {
                jqueryMap.$chat.attr('title', configMap.chatRetractedTitle);
                stateMap.isChatRetracted = true;
                if (callback) {
                    callback(jqueryMap.$chat);
                }
            }
        );
        return true;
    };

    changeAnchorPart = function (argMap) {
        var anchorMapRevise = copyAnchorMap(),
            boolReturn = true,
            keyName,
            keyNameDep;
        KEYVAL:
            for (keyName in argMap) {
                if (argMap.hasOwnProperty(keyName)) {
                    if (keyName.indexOf('_') === 0) {
                        continue KEYVAL;
                    }
                    anchorMapRevise[keyName] = argMap[keyName];
                    keyNameDep = '_' + keyName;
                    if (argMap[keyNameDep]) {
                        anchorMapRevise[keyNameDep] = argMap[keyNameDep];
                    }
                    else {
                        delete anchorMapRevise[keyNameDep];
                        delete anchorMapRevise['_s' + keyNameDep];
                    }
                }
            }
        try {
            $.uriAnchor.setAnchor(anchorMapRevise);
        }
        catch (error) {
            $.uriAnchor.setAnchor(stateMap.anchor_map, null, true);
            boolReturn = false;
        }
        return boolReturn;
    };

    onHashChange = function (event) {
        var anchorMapPrevious = copyAnchorMap(),
            anchorMapProposed,
            _sChatPrevious,
            _sChatProposed,
            sChatProposed;
        try {
            anchorMapProposed = $.uriAnchor.makeAnchorMap();
        }
        catch (error) {
            $.uriAnchor.setAnchor(anchorMapPrevious, null, true);
            return false;
        }
        stateMap.anchor_map = anchorMapProposed;
        _sChatPrevious = anchorMapPrevious._s_chat;
        _sChatProposed = anchorMapProposed._s_chat;
        if (!anchorMapPrevious || _sChatPrevious !== _sChatProposed) {
            sChatProposed = anchorMapProposed.chat;
            switch (sChatProposed) {
                case 'open' :
                    toggleChat(true);
                    break;
                case 'closed' :
                    toggleChat(false);
                    break;
                default :
                    toggleChat(false);
                    delete anchorMapProposed.chat;
                    $.uriAnchor.setAnchor(anchorMapProposed, null, true);
            }
        }
        return false;
    };

    onClickChat = function (event) {
        changeAnchorPart({
            chat: ( stateMap.isChatRetracted ? 'open' : 'closed' )
        });
        return false;
    };

    initModule = function ($container) {
        // load HTML and map jQuery collections
        stateMap.$container = $container;
        $container.html(configMap.main_html);
        setJqueryMap();

        stateMap.isChatRetracted = true;
        jqueryMap.$chat.attr('title', configMap.chatRetractedTitle).click(onClickChat);

        $.uriAnchor.configModule({
            schema_map: configMap.anchorSchemaMap
        });

        $(window)
            .bind('hashchange', onHashChange)
            .trigger('hashchange');

    };

    return { initModule: initModule };
}());