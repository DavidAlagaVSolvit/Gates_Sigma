
// turn map editor on off 
$(document).ready(function () {
    $('.ui-editor-start').click(function () {
        $.publish(_oEvents.onShapeEditorActivate, { action: true });
        $('.ui-editor-start').hide();
        $('.ui-editor-stop').show();
        $.publish(_oEvents.onNavigationMapViewActivated, { action: false });

    });
    $('.ui-editor-stop').click(function () {
        $.publish(_oEvents.onShapeEditorActivate, { action: false });
        $('.ui-editor-start').show();
        $('.ui-editor-stop').hide();
        $.publish(_oEvents.onNavigationMapViewActivated, { action: true });

    });
});

$.subscribe(_oEvents.onShapeEditorActivate, function (topic, data) {
    $.publish(_oEvents.onMapViewReposition);
    if (data.action) {
        fnStartShapeEditor();
    }
    else {
        fnStopShapeEditor();
    }
});

function fnStartShapeEditor() {
    console.log('start map editor');

    if (!oViewModel['oShapeEditingFeatureLayer']) {
        fnStopShapeEditor();
        oViewModel['oShapeEditingFeatureLayer'] = new esri.layers.FeatureLayer(oViewModel['oFixedImmunizationLocationFeatureCollection'], {
            id: oViewModel['oShapeEditingFeatureLayerId'],
            mode: esri.layers.FeatureLayer.MODE_SNAPSHOT
        });
 
        oViewModel.oMapView.addLayer(oViewModel['oShapeEditingFeatureLayer']);
    }


    oViewModel['oEditToolbar'] = new esri.toolbars.Edit(oViewModel['oMapView']);

    oViewModel['oEditMapViewListener'] = dojo.connect(oViewModel['oMapView'], 'onClick', function (evt) {
        oViewModel['oEditToolbar'].deactivate();
    });


    // Creates right-click context menu for map
    oViewModel['oMapContextMenu'] = new dijit.Menu({
        onOpen: function (box) {
            // Lets calculate the map coordinates where user right clicked.
            // We'll use this to create the graphic when the user clicks
            // on the menu item to "Add Point"
            currentLocation = _oUtilities.fnGetMapPointFromMenuPosition(box, oViewModel['oMapView']);
            oViewModel['oEditToolbar'].deactivate();
        }
    });

    oViewModel['oMapContextMenu'].addChild(new dijit.MenuItem({
        label: "Add Point",
        onClick: function (evt) {

            var graphic = new esri.Graphic(esri.geometry.fromJson(currentLocation.toJson()), oViewModel['oSymbols'].oHighlightMarkerSymbol);
            oViewModel['oShapeEditingFeatureLayer'].add(graphic);
            // oViewModel['oMapView'].graphics.add(graphic);
        }
    }));

    oViewModel['oMapContextMenu'].startup();
    oViewModel['oMapContextMenu'].bindDomNode(oViewModel['oMapView'].container);

    fnCreateGraphicsMenu();

    oViewModel['bIsEditing'] = true;

    console.log('start map editor is done');
}

function fnStopShapeEditor() {
    console.log('stop shape editor');
    dojo.disconnect(oViewModel['oEditMapViewListener']);
    oViewModel['oEditToolbar'] = null;
    oViewModel['oEditMapViewListener'] = null;
    oViewModel['bIsEditing'] = false;

    if (oViewModel['oMapContextMenu']) {
        oViewModel['oMapContextMenu'].unBindDomNode(oViewModel['oMapView'].container);
        oViewModel['oMapContextMenu'] = null;
    }

 
}


function fnCreateGraphicsMenu() {
    // Creates right-click context menu for GRAPHICS
    var ctxMenuForGraphics = new dijit.Menu({});

    ctxMenuForGraphics.addChild(new dijit.MenuItem({
        label: "Move",
        onClick: function () {
            oViewModel['oEditToolbar'].activate(esri.toolbars.Edit.MOVE, oViewModel['oSelectedFeature']);
        }
    }));


    //ctxMenuForGraphics.addChild(new dijit.MenuSeparator());
    ctxMenuForGraphics.addChild(new dijit.MenuItem({
        label: "Delete",
        onClick: function () {
            oViewModel['oShapeEditingFeatureLayer'].remove(oViewModel['oSelectedFeature']);
            // oViewModel['oMapView'].graphics.remove(oViewModel['oSelectedFeature']);
        }
    }));

    ctxMenuForGraphics.startup();

    dojo.connect(oViewModel['oShapeEditingFeatureLayer'], "onMouseOver", function (evt) {
        // We'll use this "selected" graphic to enable editing tools
        // on this graphic when the user click on one of the tools
        // listed in the menu.
      //  console.log("onMouseOver");
        oViewModel['oSelectedFeature'] = evt.graphic;
        if (oViewModel['bIsEditing']) {
            // Let's bind to the graphic underneath the mouse cursor           
            ctxMenuForGraphics.bindDomNode(evt.graphic.getDojoShape().getNode());
        }
    });


    dojo.connect(oViewModel['oShapeEditingFeatureLayer'], "onMouseOut", function (evt) {
       // console.log("onMouseOut");
        ctxMenuForGraphics.unBindDomNode(evt.graphic.getDojoShape().getNode());
    });
}






