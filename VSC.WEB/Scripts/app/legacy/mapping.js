dojo.require("dijit.dijit");
dojo.require("dijit.layout.BorderContainer");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.layout.TabContainer");
dojo.require("dijit.layout.StackContainer");
dojo.require("dijit.layout.AccordionContainer");
dojo.require("dijit.Tooltip");
dojo.require("dijit.TooltipDialog");
dojo.require("dojo.parser");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.Menu");
dojo.require("dijit.Dialog");
dojo.require("dojox.grid.DataGrid");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("esri.map");
dojo.require("esri.dijit.BasemapGallery");
dojo.require("esri.dijit.Legend");
dojo.require("esri.dijit.Scalebar");
dojo.require("esri.dijit.Popup");
dojo.require("esri.arcgis.utils");
dojo.require("esri.tasks.query");
dojo.require("esri.tasks.geometry");
dojo.require("esri.tasks.find");
dojo.require("agsjs.dijit.TOC");

var tocGlobal;

function checkVisibility(dependencies) {
    console.log(' checkVisibility xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    var isVisible = false;
    var aLayer;
    for (var i = 0; i < dependencies.length; i++) {
        aLayer = map.getLayer(map.layerIds[dependencies[i]]);
        if (aLayer) {
            isVisible = isVisible || aLayer.visible;
        }
    }
    return isVisible;
}




function initUI(layers) {
    console.log('init ui xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    console.log(layers);
 

    var layerInfo = [];
    if (tocGlobal) {
        tocGlobal.destroy();
    }
    //dojo.forEach(layers, function (layer) {
    //    if (!layer.featureCollection) {
    //        layerInfo.push({
    //            "layer": layer.layerObject,
    //            "title": layer.title,
    //            "group": false
    //        });
    //    } else {
    //        //if its a feature collection check showLegend
    //        if (layer.featureCollection.showLegend) {
    //            //get all the layers
    //            dojo.forEach(layer.featureCollection.layers, function (mapLayer) {
    //                layerInfo.push({
    //                    "layer": mapLayer.layerObject,
    //                    "title": mapLayer.title,
    //                    "group": false
    //                });
    //            });
    //        }
    //    }
    //});

    //for (var i = 0; i < layerInfo.length; i++) {
    //    for (var j = 0; j < GroupLayers.length; j++) {
    //        if (layerInfo[i].title == GroupLayers[j]) {
    //            layerInfo[i].group = true;
    //            break;
    //        }
    //    }
    //}

    //layerInfo.reverse();

    $(layers).each(function (index, layer) {
        layerInfo.push({
            "layer": layer.layer,
            "title": layer.title,
            "group": false
        });
    });

   tocGlobal = new agsjs.dijit.TOC({
        map: _oViewModel.oMapView,
        layerInfos: layerInfo
    }, 'legendDiv');
   tocGlobal.startup();

   $.Dialog({
       'title': 'Map Content',
       'content': $('.ui-legendview').html(), 
       'draggable': true,
       'overlay': false,
       'buttonsAlign': 'right',
       'position': {
           'zone': 'left'
       },
       'buttons': {
           'Ok': {
               'action': function () { }
           }
       }
   });

}//initUI




//dojo.addOnLoad(init);
dojo.connect(null, "initUI", null, function (layers) {
    console.log('init ui event xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    dojo.forEach(layers, function (layer) {
        if (!layer.featureCollection) {
            var contentDiv = dojo.byId("content");
            var div = dojo.create("div", null, contentDiv, "first");
            var check = null;
            if (dojo.isIE <= 7 && layer.visibility) {
                check = document.createElement("<input type=\"checkbox\" checked=\"checked\"/>");
                check.setAttribute("id", layer.id + "_check");
                div.appendChild(check);
            } else {
                check = dojo.create("input", {
                    type: "checkbox",
                    checked: layer.visibility,
                    id: layer.id + "_check"
                }, div);
            }
            var label = dojo.create("label", {
                innerHTML: layer.title,
                "for": layer.id + "_check"
            }, div);
            dojo.connect(div, "onclick", check, function (el) {
                var mapLayer = map.getLayer(layer.id);
                if (this.checked) {
                    mapLayer.show();
                } else {
                    mapLayer.hide();
                }
            });
        }
    });

});


//title - Title of the dialog box (HTML format)
//content - Content of the dialog box (HTML format)
//draggable - Set draggable to dialog box, available: true, false (default: false)
//overlay - Set the overlay of the page (false will only remove the effect, not the div), available: true, false (default: true)
//closeButton - Enable or disable the close button, available: true, false (default: false)
//buttonsAlign - Align of the buttons, available: left, center, right (default: center)
//buttons - Set buttons in the action bar (JSON format)
//    name - Text of the button (JSON format)
//        action - Function to bind to the button
//position - Set the initial position of the dialog box (JSON format)
//    zone - Zone of the dialog box, available: left, center, right (default: center)
//offsetY - Top offset pixels
//offsetX - Left offset pixels


//show map on load
//dojo.addOnLoad(function () {
//    $.publish(_oEvents.onMapViewInit, {});
//});