/*jslint browser : true, continue : true,
 devel : true, indent : 4, maxerr : 50,
 newcap : true, nomen : true, plusplus : true,
 regexp : true, sloppy : true, vars : false,
 white : true
 */
/*global $, spa, getComputedStyle */

spa.chat = (function () {
    var configMap = {
            main_html: String() +
                '<div class="spa-chat">' +
                '<div class="spa-chat-head">' +
                '<div class="spa-chat-head-toggle">+</div>' +
                '<div class="spa-chat-head-title">' +
                'Chat' +
                '</div>' +
                '</div>' +
                '<div class="spa-chat-closer">x</div>' +
                '<div class="spa-chat-sizer">' +
                '<div class="spa-chat-msgs"></div>' +
                '<div class="spa-chat-box">' +
                '<input type="text"/>' +
                '<div>send</div>' +
                '</div>' +
                '</div>' +
                '</div>',
            settableMap: {
                sliderOpenTime: true,
                sliderCloseTime: true,
                sliderOpenedEm: true,
                sliderClosedEm: true,
                sliderOpenedTitle: true,
                sliderClosedTitle: true,
                chatModel: true,
                peopleModel: true,
                setChatAnchor: true
            },
            sliderOpenTime: 250,
            sliderCloseTime: 250,
            sliderOpenedEm: 18,
            sliderOpenedMinEm: 10,
            windowHeightMinEm: 20,
            sliderClosedEm: 2,
            sliderOpenedTitle: 'Click to close',
            sliderClosedTitle: 'Click to open',
            chatModel: null,
            peopleModel: null,
            setChatAnchor: null
        },
        stateMap = {
            $appendTarget: null,
            positionType: 'closed',
            pxPerEm: 0,
            sliderHiddenPx: 0,
            sliderClosedPx: 0,
            sliderOpenedPx: 0
        },
        jqueryMap = {},
        setJqueryMap,
        getEmSize,
        setPxSizes,
        setSliderPosition,
        onClickToggle,
        configModule,
        initModule,
        removeSlider,
        handleResize;

    setJqueryMap = function () {
        var $appendTarget = stateMap.$appendTarget,
            $slider = $appendTarget.find('.spa-chat');
        jqueryMap = {
            $slider: $slider,
            $head: $slider.find('.spa-chat-head'),
            $toggle: $slider.find('.spa-chat-head-toggle'),
            $title: $slider.find('.spa-chat-head-title'),
            $sizer: $slider.find('.spa-chat-sizer'),
            $msgs: $slider.find('.spa-chat-msgs'),
            $box: $slider.find('.spa-chat-box'),
            $input: $slider.find('.spa-chat-input input[type=text]')
        };
    };

    getEmSize = function (elem) {
        return Number(getComputedStyle(elem, '').fontSize.match(/\d*\.?\d*/)[0]);
    };

    setPxSizes = function () {
        var pxPerEm,
            windowHeightEm,
            openedHeightEm;

        pxPerEm = getEmSize(jqueryMap.$slider.get(0));
        windowHeightEm = Math.floor(($(window).height() / pxPerEm) + 0.5);
        openedHeightEm = windowHeightEm > configMap.windowHeightMinEm ?
            configMap.sliderOpenedEm :
            configMap.sliderOpenedMinEm;
        stateMap.pxPerEm = pxPerEm;
        stateMap.sliderClosedPx = configMap.sliderClosedEm * pxPerEm;
        stateMap.sliderOpenedPx = openedHeightEm * pxPerEm;
        jqueryMap.$sizer.css({
            height: (openedHeightEm - 2) * pxPerEm
        });
    };

    setSliderPosition = function (positionType, callback) {
        var heightPx,
            animateTime,
            sliderTitle,
            toggleText;

        if (stateMap.positionType === positionType) {
            return true;
        }

        switch (positionType) {
            case 'opened':
                heightPx = stateMap.sliderOpenedPx;
                animateTime = configMap.sliderOpenTime;
                sliderTitle = configMap.sliderOpenedTitle;
                toggleText = '-';
                break;
            case 'hidden':
                heightPx = 0;
                animateTime = configMap.sliderOpenTime;
                sliderTitle = '';
                toggleText = '+';
                break;
            case 'closed':
                heightPx = stateMap.sliderClosedPx;
                animateTime = configMap.sliderCloseTime;
                sliderTitle = configMap.sliderClosedTitle;
                toggleText = '+';
                break;
            default:
                return false;
        }

        stateMap.positionType = '';
        jqueryMap.$slider.animate(
            {height: heightPx},
            animateTime,
            function () {
                jqueryMap.$toggle.prop('title', sliderTitle);
                jqueryMap.$toggle.text(toggleText);
                stateMap.positionType = positionType;
                if (callback) {
                    callback(jqueryMap.$slider);
                }
            }
        );
        return true;
    };

    onClickToggle = function () {
        var setChatAnchor = configMap.setChatAnchor;
        if (stateMap.positionType === 'opened') {
            setChatAnchor('closed');
        }
        else if (stateMap.positionType === 'closed') {
            setChatAnchor('opened');
        }
        return false;
    };

    configModule = function (inputMap) {
        spa.util.setConfigMap({
            inputMap: inputMap,
            settableMap: configMap.settableMap,
            configMap: configMap
        });
        return true;
    };

    initModule = function ($appendTarget) {
        $appendTarget.append(configMap.main_html);
        stateMap.$appendTarget = $appendTarget;
        setJqueryMap();
        setPxSizes();

        jqueryMap.$toggle.prop('title', configMap.sliderClosedTitle);
        jqueryMap.$head.click(onClickToggle);
        stateMap.positionType = 'closed';

        return true;
    };

    removeSlider = function () {
        if (jqueryMap.$slider) {
            jqueryMap.$slider.remove();
            jqueryMap = {};
        }
        stateMap.$appendTarget = null;
        stateMap.positionType = 'closed';
        configMap.chatModel = null;
        configMap.peopleModel = null;
        configMap.setChatAnchor = null;

        return true;
    };

    handleResize = function () {
        if (!jqueryMap.$slider) {
            return false;
        }

        setPxSizes();
        if (stateMap.positionType === 'opened') {
            jqueryMap.$slider.css({height: stateMap.sliderOpenedPx});
        }

        return true;
    };

    return{
        setSliderPosition: setSliderPosition,
        configModule: configModule,
        initModule: initModule,
        removeSlider: removeSlider,
        handleResize: handleResize
    };

}());