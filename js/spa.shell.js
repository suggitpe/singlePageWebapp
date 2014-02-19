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
            chatRetractHeight: 15,
            chatExtendedTitle: 'Click to retract',
            chatRetractedTitle: 'Click to extract'
        },
        stateMap = {
            $container: null,
            isChatRetracted: true
        },
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

    toggleChat = function (doExtend, callback) {
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
        // End extend chat slider
        // Begin retract chat slider
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
        // End retract chat slider
    };

    var onClickChat = function (event) {
        toggleChat(stateMap.isChatRetracted);
        return false;
    };

    initModule = function ($container) {
        // load HTML and map jQuery collections
        stateMap.$container = $container;
        $container.html(configMap.main_html);
        setJqueryMap();

        stateMap.isChatRetracted = true;
        jqueryMap.$chat.attr('title', configMap.chatRetractedTitle).click(onClickChat);

    };
    // End PUBLIC method /initModule/
    return { initModule: initModule };
}());