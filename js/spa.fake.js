/*jslint browser : true, continue : true,
 devel : true, indent : 4, maxerr : 50,
 newcap : true, nomen : true, plusplus : true,
 regexp : true, sloppy : true, vars : false,
 white : true
 */
/*global $, spa */
spa.fake = (function () {
    'use strict';
    var getPeopleList,
        fakeIdSerial,
        makeFakeId,
        mockSio;

    fakeIdSerial = 5;

    makeFakeId = function () {
        return 'id_' + String(fakeIdSerial++);
    };

    getPeopleList = function () {
        return [
            {
                name: 'Betty',
                _id: 'id_01',
                cssMap: {
                    top: 20,
                    left: 20,
                    'background-color': 'rgb(128,128,128)'
                }
            },
            {
                name: 'Mike',
                _id: 'id_02',
                cssMap: {
                    top: 60,
                    left: 20,
                    'background-color': 'rgb(128,255,128)'
                }
            },
            {
                name: 'Pebbles',
                _id: 'id_03',
                cssMap: {
                    top: 100,
                    left: 20,
                    'background-color': 'rgb(128,192,192)'
                }
            },
            {
                name: 'Wilma',
                _id: 'id_04',
                cssMap: {
                    top: 140,
                    left: 20,
                    'background-color': 'rgb(192,128,128)'
                }
            }
        ];
    };

    mockSio = (function () {
        var onSio,
            emitSio,
            callbackMap = {};

        onSio = function (msgType, callback) {
            callbackMap[msgType] = callback;
        };

        emitSio = function (msgType, data) {
            if (msgType === 'adduser' && callbackMap.userupdate) {
                setTimeout(function () {
                    callbackMap.userupdate([
                        {
                            _id: makeFakeId(),
                            name: data.name,
                            cssMap: data.cssMap
                        }
                    ]);
                }, 3000);
            }
        };

        return {
            emit: emitSio,
            on: onSio
        };
    }());

    return {
        getPeopleList: getPeopleList,
        mockSio: mockSio
    };

}());