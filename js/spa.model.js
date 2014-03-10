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
            peopleCidMap: {},
            peopleDb: TAFFY()
        },
        isFakeData = true,
        personProto,
        makePerson,
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

    people = {
        getDb: function () {
            return stateMap.peopleDb;
        },
        getCidMap: function () {
            return stateMap.peopleCidMap;
        }
    };

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