/*jslint browser : true, continue : true,
 devel : true, indent : 4, maxerr : 50,
 newcap : true, nomen : true, plusplus : true,
 regexp : true, sloppy : true, vars : false,
 white : true
 */
/*global $, spa, getComputedStyle */
spa.util_b = (function () {
    'use strict';
    var configMap = {
            regexEncodeHtml: /[&"'><]/g,
            regexEncodeNoAmp: /["'><]/g,
            htmlEncodeMap: {
                '&': '&#38;',
                '"': '&#34;',
                "'": '&#39;',
                '>': '&#62;',
                '<': '&#60;'
            }
        },
        decodeHtml,
        encodeHtml,
        getEmSize;

    configMap.encodeNoampMap = $.extend({}, configMap.htmlEncodeMap);
    delete configMap.htmlEncodeMap['&'];

    decodeHtml = function (string) {
        return $('<div/>').html(string || '').text();
    };

    encodeHtml = function (inputArgString, excludeAmp) {
        var inputString = String(inputArgString),
            regex,
            lookupMap;

        if (excludeAmp) {
            lookupMap = configMap.encodeNoampMap;
            regex = configMap.regexEncodeNoAmp;
        }
        else {
            lookupMap = configMap.htmlEncodeMap;
            regex = configMap.regexEncodeHtml;
        }
        return inputString.replace(regex, function (match, name) {
            return lookupMap[match] || '';
        });
    };

    getEmSize = function (element) {
        return Number(getComputedStyle(element, '').fontSize.match(/\d*\.?\d*/)[0]);
    };

    return{
        decodeHtml: decodeHtml,
        encodeHtml: encodeHtml,
        getEmSize: getEmSize
    };

}());