/*jslint browser : true, continue : true,
 devel : true, indent : 2, maxerr : 50,
 newcap : true, nomen : true, plusplus : true,
 regexp : true, sloppy : true, vars : false,
 white : true
 */
/*global $, spa */
spa.shell = (function () {
    var configMap = {
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
            chatRetractHeight: 15
        },
        stateMap = { $container: null },
        jqueryMap = {},

        setJqueryMap,
        toggleChat,
        initModule;

    setJqueryMap = function () {
        var $container = stateMap.$container;
        jqueryMap = {
            $container: $container,
            $chat: $container.find('.spa-shell-chat')
        };
    };

    toggleChat = function (do_extend, callback) {
        var
            pxChatHeight = jqueryMap.$chat.height(),
            isOpen = pxChatHeight === configMap.chatExtendHeight,
            isClosed = pxChatHeight === configMap.chatRetractHeight,
            isSliding = !isOpen && !isClosed;
        // avoid race condition
        if (isSliding) {
            return false;
        }
        // Begin extend chat slider
        if (do_extend) {
            jqueryMap.$chat.animate(
                { height: configMap.chatExtendHeight },
                configMap.chatExtendTime,
                function () {
                    if (callback) {
                        callback(jqueryMap.$chat);
                    }
                }
            );
            return true;
        }
        // End extend chat slider
        // Begin retract chat slider
        jqueryMap.$chat.animate(
            { height: configMap.chatRetractHeight },
            configMap.chatRetractTime,
            function () {
                if (callback) {
                    callback(jqueryMap.$chat);
                }
            }
        );
        return true;
        // End retract chat slider
    };

    initModule = function ($container) {
        // load HTML and map jQuery collections
        stateMap.$container = $container;
        $container.html(configMap.main_html);
        setJqueryMap();
        // test toggle
        setTimeout(function () {
            toggleChat(true);
        }, 3000);
        setTimeout(function () {
            toggleChat(false);
        }, 8000);
    };
    // End PUBLIC method /initModule/
    return { initModule: initModule };
}());