/*jslint browser : true, continue : true,
 devel : true, indent : 4, maxerr : 50,
 newcap : true, nomen : true, plusplus : true,
 regexp : true, sloppy : true, vars : false,
 white : true
 */
/*global TAFFY, $, spa */
spa.model = (function () {
    'use strict';
    var configMap = {anonId: 'a0'},
        stateMap = {
            anonUser: null,
            cidSerial: 0,
            peopleCidMap: {},
            peopleDb: TAFFY(),
            user: null
        },
        isFakeData = true,
        personProto,
        makeCid,
        clearPeopleDb,
        completeLogin,
        makePerson,
        removePerson,
        people,
        initModule;

    personProto = {
        isUser: function () {
            return this.cid === stateMap.user.cid;
        },
        isAnon: function () {
            return this.cid === stateMap.anonUser.cid;
        }
    };

    makeCid = function () {
        return 'c' + String(stateMap.cidSerial++);
    };

    clearPeopleDb = function () {
        var user = stateMap.user;
        stateMap.peopleDb = TAFFY();
        stateMap.peopleCidMap = {};
        if (user) {
            stateMap.peopleDb.insert(user);
            stateMap.peopleCidMap[user.cid] = user;
        }
    };

    completeLogin = function (userList) {
        var userMap = userList[0];
        delete stateMap.peopleCidMap[userMap.cid];
        stateMap.user.cid = userMap.cid;
        stateMap.user.id = userMap.id;
        stateMap.user.cssMap = userMap.cssMap;
        stateMap.peopleCidMap[userMap._id] = stateMap.user;

        $.gevent.publish('spa-login', [stateMap.user]);
    };

    makePerson = function (personMap) {
        var person,
            cid = personMap.cid,
            cssMap = personMap.cssMap,
            id = personMap.id,
            name = personMap.name;

        if (cid === undefined || !name) {
            throw 'client id and name required';
        }

        person = Object.create(personProto);
        person.cid = cid;
        person.name = name;
        person.cssMap = cssMap;
        if (id) {
            person.id = id;
        }

        stateMap.peopleCidMap[cid] = person;
        stateMap.peopleDb.insert(person);
        return person;
    };

    removePerson = function (person) {
        if (!person) {
            return false;
        }

        if (person.id === configMap.anonId) {
            return false;
        }

        stateMap.peopleDb({cid: person.cid}).remove();
        if (person.cid) {
            delete stateMap.peopleCidMap[person.cid];
        }
        return true;
    };

    people = (function () {
        var getByCid,
            getDb,
            getUser,
            login,
            logout;

        getByCid = function (cid) {
            return stateMap.peopleCidMap[cid];
        };

        getDb = function () {
            return stateMap.peopleDb;
        };

        getUser = function () {
            return stateMap.user;
        };

        login = function (name) {
            var sio = isFakeData ? spa.fake.mockSio : spa.data.getSio;
            stateMap.user = makePerson({
                cid: makeCid(),
                cssMap: {top: 25, left: 25, 'background-color': '#8f8'},
                name: name
            });
            sio.on('userupdate', completeLogin);

            sio.emit('adduser', {
                cid: stateMap.user.cid,
                cssMap: stateMap.user.cssMap,
                name: stateMap.user.name
            });
        };

        logout = function () {
            var isRemoved,
                user = stateMap.user;
            isRemoved = removePerson(user);
            stateMap.user = stateMap.anonUser;

            $.gevent.publish('spa-logout', [user]);
            return isRemoved;
        };

        return{
            getByCid: getByCid,
            getDb: getDb,
            getUser: getUser,
            login: login,
            logout: logout
        };
    }());

    initModule = function () {
        var i,
            peopleList,
            personMap;

        stateMap.anonUser = makePerson({
            cid: configMap.anonId,
            id: configMap.anonId,
            name: 'anonymous'
        });
        stateMap.user = stateMap.anonUser;

        if (isFakeData) {
            peopleList = spa.fake.getPeopleList();
            for (i = 0; i < peopleList.length; i++) {
                personMap = peopleList[i];
                makePerson({
                    cid: personMap._id,
                    cssMap: personMap.cssMap,
                    id: personMap._id,
                    name: personMap.name
                });
            }
        }
    };

    return {
        initModule: initModule,
        people: people
    };

}());