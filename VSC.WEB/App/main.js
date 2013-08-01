var aDojoModuleNames = [
  'dojo/_base/connect',
  'dojo/_base/array',
  'dojo/dom',
  'dojo/has',
  'dojo/parser'
];
var aEsriModuleNames = [
     'esri/map'
];
var aAppModuleNames = [];
aAppModuleNames.push(aDojoModuleNames);
aAppModuleNames.push(aEsriModuleNames);
require(aAppModuleNames, function () {

}
);
//var Sigma = Sigma || {
//    Event:{},
//    ViewModel: {
//        country: null,
//        schedule: null,
//        demograhic:null
//    },
//    App: {},
//    Service: {},

//};
//(function (window, undefined) {
//    var Sigma = window.Sigma || {};
//    Sigma.App = {
//        fnStart: function () { },
//        fnStop: function () { }
//    }
//    Sigma.oSetting = {
//        oExtent: {
//            dXmin: null,
//            dYmin: null,
//            dXmax: null,
//            dYmax: null,
//            iWkid: 4326
//        }
//    }
//    Sigma.oViewModel = {
//        sCountryName: null,
//        oExtent: {
//            dXmin: null,
//            dYmin: null,
//            dXmax: null,
//            dYmax: null,
//            iWkid: 4326
//        },
//        oSchedule: null,
//        sGeoDataServiceURL: null,
//        aGeoNames: [],

//    }
//    Sigma.Service = {}
//    Sigma.fnFoo = function () {
//        alert('foo');
//    }
//})(this);
//window.Sigma.datacontext = (function () {
//    var datacontext = {
//        getCountryList: getCountryList,
//        getCountryProfile: getCountryProfile,
//    };


//    return datacontext;

//    function getCountryProfile(getCountryListObservable, errorObservable) {
//        return ajaxRequest("get", todoListUrl())
//            .done(getSucceeded)
//            .fail(getFailed);

//        function getSucceeded(data) {
//            var mappedTodoLists = $.map(data, function (list) { return new createTodoList(list); });
//            todoListsObservable(mappedTodoLists);
//        }

//        function getFailed() {
//            errorObservable("Error retrieving todo lists.");
//        }
//    }
//    function getCountryList(getCountryListObservable, errorObservable) {
//        return ajaxRequest("get", todoListUrl())
//            .done(getSucceeded)
//            .fail(getFailed);

//        function getSucceeded(data) {
//            var mappedTodoLists = $.map(data, function (list) { return new createTodoList(list); });
//            todoListsObservable(mappedTodoLists);
//        }

//        function getFailed() {
//            errorObservable("Error retrieving todo lists.");
//        }
//    }
//    // Ajax helper
//    function ajaxRequest(type, url, data, dataType) {
//        var options = {
//            dataType: dataType || "json",
//            contentType: "application/json",
//            cache: false,
//            type: type,
//            data: data ? data.toJson() : null
//        };
//        var antiForgeryToken = $("#antiForgeryToken").val();
//        if (antiForgeryToken) {
//            options.headers = {
//                'RequestVerificationToken': antiForgeryToken
//            }
//        }
//        return $.ajax(url, options);
//    }
//})();
//http://darcyclarke.me/development/javascript-applications-101/
/*************************************************************************/
/* Application
/*************************************************************************/
//var	App = {};
//App.url = "http://domain.com/";
//App.init = function() {
//    App.publish("init");
//},
//App.destroy = fucntion(){
//    App.destroy("destroy");
//},
//App.subscribe = function(name, callback){
//    App.subscriptions.push({"name": name, "callback": callback});
//    return [name,callback];
//},
//App.unsubscribe = function(args){
//    for(x=0;x<App.subscriptions.length;x++){
//        if(App.subscriptions[x].name == args[0], App.subscriptions[x].callback == args[1])
//            App.subscriptions.splice(x, 1);
//    }
//},
//App.publish = function(name, args){
//    var temp = [];
//    if(App.subscriptions.length > 0){
//        for(var x=0;x<App.subscriptions.length;x++) {
//            if(App.subscriptions[x].name == name)
//                temp.push({"fn":App.subscriptions[x].callback});
//        }
//        for(x=0;x<temp.length;x++){
//            temp[x].fn.apply(this,[args]);
//        }
//    }
//},
//App.ajax = function(service, data, success, failure){
//    $.ajax({
//        type: "post",
//        url: App.url + "/api/" + service,
//        data: data,
//        dataType: "json",
//        success: function (data) {
//            App.publish("ajax_request_success");
//            success(data);
//        },
//        error: function (request, status, error) {
//            App.publish("ajax_request_error");
//            failure(request, status, error);
//        }
//    });
//};
///*************************************************************************/
///* Subscriptions
///*************************************************************************/
//App.subscribe("init", function(){
//    alert("Hello World!");
//});
//App.subscribe("destroy", function(){
//    alert("Leaving so soon?");
//});
///*************************************************************************/
///* Events
///*************************************************************************/
//// DOM Ready
//jQuery(function($){
//    App.init();
//});
//// Window unload
//jQuery(window).unload(function(){
//    App.destroy();
//});