// demo code only.
var _oMapView = _oMapView || {
    fnUpdatMapView: function (topic, data) {
        console.log('updatMapView');
        console.log(data);
        _oMapView.fnClearSelectionGraphics(topic, data);
        var layer = oViewModel.oMapView.getLayer(data.target);
        var ext = null;
        var offset = 10000
        if (layer) {
            $(data.features).each(function (index, feature) {
                switch (feature.geometry.type) {
                    case "point":
                        feature.setSymbol(oViewModel.oSymbols.selecedMarkerSymbol);
                        break;
                    case "polyline":
                        feature.setSymbol(oViewModel.oSymbols.selecedLineSymbol);
                        break;
                    case "polygon":
                        feature.setSymbol(oViewModel.oSymbols.selecedPolygonSymbol);
                        break;
                }
                layer.add(feature);
                ext = esri.graphicsExtent(layer.graphics);
            });

            if (!ext) {
                ext = new esri.geometry.Extent(data.features[0].geometry.x - offset,
                               data.features[0].geometry.y - offset,
                                data.features[0].geometry.x + offset,
                                data.features[0].geometry.y + offset,
                                 new esri.SpatialReference({ wkid: 102100 }))
            }
            oViewModel.oMapView.setExtent(ext, true);


            ///console.log(layer);

        }
    },
    // onExtentChange(extent, delta, levelChange, lod)
    // onUpdateEnd()
    // onUpdateStart()
    fnClearSelectionGraphics: function (topic, data) {
        oViewModel.oMapView.graphics.clear();
        var layer = oViewModel.oMapView.getLayer(data.target);
        if (layer) {
            layer.clear();
        }
    },

    fnHighlightFeature: function (topic, data) {

        oViewModel.oMapView.graphics.clear();
        var layer = oViewModel.oMapView.getLayer(data.target);
        var feature = layer.graphics[data.recordIndex];
        var ext = null;
        var offset = 10000
        if (feature) {
            switch (feature.geometry.type) {
                case "point":
                    feature.setSymbol(oViewModel.oSymbols.highlightMarkerSymbol);
                    ext = new esri.geometry.Extent(feature.geometry.x - offset,
                        feature.geometry.y - offset,
                        feature.geometry.x + offset,
                        feature.geometry.y + offset,
                         new esri.SpatialReference({ wkid: 102100 }));
                    break;
                case "polyline":
                    feature.setSymbol(oViewModel.oSymbols.selecedLineSymbol);
                    ext = esri.graphicsExtent(feature);
                    break;
                case "polygon":
                    feature.setSymbol(oViewModel.oSymbols.highlightPolygonSymbol);
                    ext = esri.graphicsExtent(feature);
                    break;
            }
            oViewModel.oMapView.graphics.add(feature);
            // console.log(ext);
            oViewModel.oMapView.setExtent(ext, true);
        }
    },

    fnMapViewZoomFull: function () {
        oViewModel.oMapView.setExtent(oViewModel.oInitialExtent, true);
    },

 
    fnUpdateMapExtent: function (topic, data) {
        var bounds = oViewModel['oCurrentMapViewExtent'];

        if (data) {
            data.wkid = data.wkid === null || data.wkid === 'undefinded' ? 4326 : data.wkid;
            var ext = new esri.geometry.Extent(data.west, data.south, data.east, data.north,
                             new esri.SpatialReference({ wkid: data.wkid }));
            bounds = esri.geometry.geographicToWebMercator(ext);
        }
 
        if (oViewModel.oMapView) {
            oViewModel.oMapView.setExtent(bounds, true);
        }

    },

    fnMapCenterAt: function (topic, data) {
        var pt = new esri.geometry.Point(data.lng, data.lat, new esri.SpatialReference({ wkid: 4326 }));
        if (_oViewModel.oMapView) {
            oViewModel.oMapView.centerAt(esri.geometry.geographicToWebMercator(pt), true);
        }
    },

    fnAddMapLayers: function (topic, data) {
        console.log('fnAddMapLayers');
        var layersToAdd = [];
        var layer = null;

        $(data.layers).each(function (index, item) {
            layer = new esri.layers.ArcGISDynamicMapServiceLayer(item.url, {
                id: item.id
            });
            layersToAdd.push(layer);
        });

        oViewModel.oMapView.addLayers(layersToAdd);


    },

    fnRemoveMapLayers: function (topic, data) {
        console.log('fnRemoveMapLayers');
        var layer = null;
        $(data.layerIds).each(function (index, id) {
            layer = oViewModel.oMapView.getLayer(id);
            if(layer){
                oViewModel.oMapView.removeLayer(layer);
            }
        });
    },

    fnInitMapView: function (topic, data) {
 

        oViewModel.oMapView = new esri.Map(oViewModel['sMapViewElementId'], {
            center: [0,0],
            zoom: 3,
            basemap: oViewModel['sBaseMapServiceName'],
            logo: false,
            autoResize:true,
            showAttribution: false,
            wrapAround180: true,
            infoWindow: new esri.dijit.Popup({}, dojo.create("div"))
        });



        dojo.connect(oViewModel.oMapView, "onLoad", function () {
           $.publish(_oEvents.onMapViewLoaded);
        });

        dojo.connect(oViewModel.oMapView, 'onLayersAddResult',function(layers){
            console.log('onLayersAddResult');
            $.publish(_oEvents.onMapLayerContentChanged, {
                layers: layers,
                isLoad: true
            });
  
        });

 

        dojo.connect(oViewModel.oMapView, 'onLayerAdd', function (layer) {
            //$.publish(_oEvents.onMapLayerContentChanged, {
            //    layer: layer,
            //    isLoad : true
            //});
            
        });

        dojo.connect(oViewModel.oMapView, 'onLayerRemove', function (layer) {
            //$.publish(_oEvents.onMapLayerContentChanged, {
            //    layer: layer,
            //    isLoad: false
            //});
            
        });


        $.publish(_oEvents.onMapViewLoaded);
    },
    fnMapViewReposition: function (topic, data) {
        if (oViewModel.oMapView) {
            oViewModel.oMapView.resize();
            oViewModel.oMapView.reposition();
        }

        if ($('.ui-map-content-menu').length > 0) {

            $('.ui-map-content-menu').position({
                of: $('.ui-mapview'),
                my: 'left top',
                at: 'left+100 top+20'
            });

        }
        else { console.log('fnMapViewReposition: map view not found'); }
       
    },
    fnStart: function () {
        console.log('start mapview');
        //$.subscribe(_oEvents.onFindResultsUpdated, _oMapView.fnUpdatMapView);
        //$.subscribe(_oEvents.onFindSelectionClear, _oMapView.fnClearSelectionGraphics);
        //$.subscribe(_oEvents.onAnalysisConfigure, _oMapView.fnConFigureAnalysis);
        //$.subscribe(_oEvents.onMapViewHighlighFeature, _oMapView.fnHighlightFeature);
        //$.subscribe(_oEvents.onAnalysisBufferComplete, _oMapView.fnUpdatMapView);
        $.subscribe(_oEvents.onMapViewZoomFull, _oMapView.fnMapViewZoomFull);
        $.subscribe(_oEvents.onMapViewUpdateExtent, _oMapView.fnUpdateMapExtent);
        $.subscribe(_oEvents.onMapViewCeterAt, _oMapView.fnMapCenterAt);
        $.subscribe(_oEvents.onMapViewInit, _oMapView.fnInitMapView);
        $.subscribe(_oEvents.onMapViewAddMapLayers, _oMapView.fnAddMapLayers);
        $.subscribe(_oEvents.onMapViewRemoveMapLayers, _oMapView.fnRemoveMapLayers);
        $.subscribe(_oEvents.onMapViewReposition, _oMapView.fnMapViewReposition);
    }
};
 