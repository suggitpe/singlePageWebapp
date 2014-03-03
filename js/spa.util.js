/*jslint browser : true, continue : true,
 devel : true, indent : 4, maxerr : 50,
 newcap : true, nomen : true, plusplus : true,
 regexp : true, sloppy : true, vars : false,
 white : true
 */
/*global $, spa */

spa.util = (function () {
    var makeError,
        setConfigMap;

    makeError = function (nameText, msgText, data) {
        var error = new Error();
        error.name = nameText;
        error.message = msgText;
        if (data) {
            error.data = data;
        }
        return error;
    };

    setConfigMap = function (argMap) {
        var inputMap = argMap.input_map,
            settableMap = argMap.settable_map,
            configMap = argMap.config_map,
            keyName,
            error;

        for (keyName in inputMap) {
            if (inputMap.hasOwnProperty(keyName)) {
                if (settableMap.hasOwnProperty(keyName)) {
                    configMap[keyName] = inputMap[keyName];
                }
                else {
                    error = makeError('Bad input', 'Setting config key |' + keyName + '| is not supported');
                    throw error;
                }
            }
        }
    };

    return{
        makeError: makeError,
        setConfigMap: setConfigMap
    };
}());