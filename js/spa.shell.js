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
                chat: {opened: true, closed: true}
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
                '<div class="spa-shell-modal"></div>',

            chatExtendTime: 300,
            chatRetractTime: 300,
            chatExtendHeight: 450,
            chatRetractHeight: 15,
            chatExtendedTitle: 'Click to retract',
            chatRetractedTitle: 'Click to extract'
        },
        stateMap = {
            anchorMap: {}
        },
        jqueryMap = {},

        copyAnchorMap,
        setJqueryMap,
        changeAnchorPart,
        onHashChange,
        onClickChat,
        setChatAnchor,
        initModule;

    copyAnchorMap = function () {
        return $.extend(true, {}, stateMap.anchorMap);
    };

    setJqueryMap = function () {
        var $container = stateMap.$container;
        jqueryMap = {
            $container: $container
        };
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
            $.uriAnchor.setAnchor(stateMap.anchorMap, null, true);
            boolReturn = false;
        }
        return boolReturn;
    };

    onHashChange = function (event) {
        var anchorMapPrevious = copyAnchorMap(),
            anchorMapProposed,
            _sChatPrevious,
            _sChatProposed,
            sChatProposed,
            isOk = true;
        try {
            anchorMapProposed = $.uriAnchor.makeAnchorMap();
        }
        catch (error) {
            $.uriAnchor.setAnchor(anchorMapPrevious, null, true);
            return false;
        }
        stateMap.anchorMap = anchorMapProposed;
        _sChatPrevious = anchorMapPrevious._s_chat;
        _sChatProposed = anchorMapProposed._s_chat;
        if (!anchorMapPrevious || _sChatPrevious !== _sChatProposed) {
            sChatProposed = anchorMapProposed.chat;
            switch (sChatProposed) {
                case 'opened' :
                    isOk = spa.chat.setSliderPosition('opened');
                    break;
                case 'closed' :
                    isOk = spa.chat.setSliderPosition('closed');
                    break;
                default :
                    spa.chat.setSliderPosition('closed');
                    delete anchorMapProposed.chat;
                    $.uriAnchor.setAnchor(anchorMapProposed, null, true);
            }
        }

        if (!isOk) {
            if (anchorMapPrevious) {
                $.uriAnchor.setAnchor(anchorMapPrevious, null, true);
                stateMap.anchorMap = anchorMapPrevious;
            }
            else {
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

    setChatAnchor = function (positionType) {
        return changeAnchorPart({chat: positionType});
    };

    initModule = function ($container) {
        // load HTML and map jQuery collections
        stateMap.$container = $container;
        $container.html(configMap.main_html);
        setJqueryMap();

        $.uriAnchor.configModule({
            schema_map: configMap.anchorSchemaMap
        });

        spa.chat.configModule({
            setChatAnchor: setChatAnchor,
            chatModel: spa.model.chat,
            peopleModel: spa.model.peopleModel
        });
        spa.chat.initModule(jqueryMap.$container);

        $(window)
            .bind('hashchange', onHashChange)
            .trigger('hashchange');

    };

    return { initModule: initModule };
}());