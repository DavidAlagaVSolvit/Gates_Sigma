// demo code only.
// needs to be ported knockout or backbone at a later date 
dojo.require("esri.map");
dojo.require("esri.tasks.geometry");
dojo.require("esri.tasks.query");
dojo.require("esri.toolbars.draw");
dojo.require("dojox.data.CsvStore");
dojo.require("esri.dijit.InfoWindowLite");
dojo.require("dojo.parser");
dojo.require("esri.dijit.Popup");
dojo.require("esri.arcgis.utils");
dojo.require("esri.symbol");
dojo.require("esri.toolbars.draw");
dojo.require("esri.toolbars.edit");
dojo.require("dijit.form.Button");
dojo.require("dijit.Menu");
dojo.require('dijit.MenuSeparator');
dojo.require('dijit.MenuItem');
dojo.require('dijit.PopupMenuItem');
 
var _oApp = _oApp || {
   // loadingMessage: 'Loading update. Please wait...',
    fnGetAbsolutePath: function () {
        //var pattern = '/Home'
        var pattern = '/';
        var loc = window.location;
        var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf(pattern) + 1);
        return loc.href.substring(0, loc.href.length - ((loc.pathname + loc.search + loc.hash).length - pathName.length));
    }
 
}
 

$(document).ready(function () {
   
    // remvoe browser context menu 
    $(document).bind("contextmenu", function (e) { return false; })

    dojo.addOnLoad(function () {
        $.publish(_oEvents.onMapViewInit, {});
    });

    _oMapView.fnStart();
    _oShareView.fnStart();



    $.subscribe(_oEvents.onMapViewLoaded, function () {
        console.log('_oEvents.onMapViewLoaded');

        // set up all the esri stuff after base map is created to make sure all dojo stuff is loaded. 
        esri.config.defaults.map.logoLink = 'http://www.vsolvit.com/';
        esri.config.defaults.io.proxyUrl = _oApp.fnGetAbsolutePath() + 'proxy.ashx';
        esri.config.defaults.io.alwaysUseProxy = true;


        oViewModel.oGeometryService = new esri.tasks.GeometryService('http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer');
        oViewModel.oInitialExtent = oViewModel.oMapView.extent;
        oViewModel['oCurrentMapViewExtent'] = oViewModel.oInitialExtent;

        oViewModel['oSymbols'] = {
            oSelectedMarkerSymbol: new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_SQUARE, 8, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 255]), 1), new dojo.Color([255, 0, 255, 0.25])),
            oSelectedLineSymbol: new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASH, new dojo.Color([255, 0, 255]), 1),
            oSelectedPolygonSymbol: new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASH, new dojo.Color([255, 0, 255]), 1), new dojo.Color([255, 0, 255, 0.25])),
            oHighlightMarkerSymbol: new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_SQUARE, 12, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0]), 3), new dojo.Color([255, 0, 0, 1.0])),
            oHighlightPolygonSymbol: new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASH, new dojo.Color([255, 0, 0]), 3), new dojo.Color([255, 0, 0, 1.0]))
        }

        // for mapview updates 
        dojo.connect(oViewModel.oMapView, 'onUpdateEnd', function () {
            oViewModel['oCurrentMapViewExtent'] = oViewModel.oMapView.extent;
            $.publish(_oEvents.onApplicationIsBusy, {
                action: false
            });
        });

        dojo.connect(oViewModel.oMapView, 'onUpdateStart', function () {
            $.publish(_oEvents.onApplicationIsBusy, {
                action: true
            });
        });

        //  for forms updates 
        $(document).ajaxStart(function () {
            $.publish(_oEvents.onApplicationIsBusy, {
                action: true
            });
        });

        $(document).ajaxStop(function () {
            $.publish(_oEvents.onApplicationIsBusy, {
                action: false
            });
        });


        $.subscribe(_oEvents.onApplicationIsBusy, function (target, data) {
            $.unblockUI();
            if (data.action) {
                $.blockUI({
                    timeout: 10000, 
                    message: ' <h4 class="bg-color-vsolvit-orange fg-color-white padding10"  >' + oViewModel['sLoadingMessage'] + '</h4>',
                    css: {
                        'background': 'none',
                        'border': 'none',
                        'width': 'auto',
                        'left': '45%',
                        'top': '45%'
                    }
                });
            }
        });

        $('.ui-map-content-menu').menu().position({
            of: $('#uiMapView_root.container'),
            my: 'right-20 top+20',
            at: 'right top'
        });

        //  $.publish(_oEvents.onAnalysisConfigure);



        //start wizard navigation after map is loaded 
        $.publish(_oEvents.onNavigationWizardActivated, { action: true });

        console.log('******************************************');
        console.log('sigma app path is: ' + _oApp.fnGetAbsolutePath());
        console.log('sigma is using dojo  version : ' + dojo.version);
        console.log('sigma is using jsapi version : ' + esri.version);
        console.log('sigma esri.config.defaults.io.proxyUrl: ' + esri.config.defaults.io.proxyUrl);
        console.log('******************************************');

        // force esri components to update screen to map transformations 
        $.publish(_oEvents.onMapViewReposition);

    });
});

// dojo version of pub/sub
//function LottoNumberPublisher(topic) {
//    this.publishTodaysLottoNumbers = function () {
//        console.log("Publishing today's lotto numbers...");
//        dojo.publish("lotto numbers", [{ numbers: [12, 15, 24, 28, 34, 58], "bonus number": 22 }]);
//    }
//}
//function LottoSubscriber(topic) {
//    this.headerLabel = "Today's lotto numbers are ";
//    this.bonusNumber = "The bonus number is ";
//    this.announceTodaysLottoNumbers = function (lottoNumbers) {
//        console.log(arguments.length);
//        console.log(this.headerLabel,
//                    lottoNumbers["numbers"], "\n",
//                    this.bonusNumber,
//                    lottoNumbers["bonus number"]);
//    }
//    //Bar directly subscribes to information,
//    //    but not from anywhere specific
//    dojo.subscribe("lotto numbers", this, "announceTodaysLottoNumbers");
//}
//var pub = new LottoNumberPublisher();
//var sub = new LottoSubscriber();
//pub.publishTodaysLottoNumbers();


