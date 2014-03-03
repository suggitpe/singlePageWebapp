/*jslint browser : true, continue : true,
 devel : true, indent : 4, maxerr : 50,
 newcap : true, nomen : true, plusplus : true,
 regexp : true, sloppy : true, vars : false,
 white : true
 */
/*global $, spa */

spa.chat = (function () {
    var configMap = {
            main_html: String() +
                '<div style="padding: 1em; color: #fff;">' +
                'Say hello to chat' +
                '</div>',
            settable_map: {}
        },
        stateMap = {container: null},
        jqueryMap = {},
        setJqueryMap,
        configModule,
        initModule;

    setJqueryMap = function () {
        var $container = stateMap.$container;
        jqueryMap = {$container: $container};
    };

    configModule = function (inputMap) {
        spa.util.setConfigMap({
            inputMap: inputMap,
            settable_map: configMap.settable_map,
            config_map: configMap
        });
        return true;
    };

    initModule = function ($container) {
        $container.html(configMap.main_html);
        stateMap.$container = $container;
        setJqueryMap();
        return true;
    };

    return{
        configModule: configModule,
        initModule: initModule
    };


}());