$.subscribe(_oEvents.onMapLayerContentChanged, function (topic, data) {

    // console.log(data);

    var html = '';
    var rootLayer;
    var legendInfo;

 /**
    $(oViewModel['oMapView'].layerIds).each(function (index, value) {
        rootLayer = oViewModel['oMapView'].getLayer(value);
        if (rootLayer instanceof esri.layers.ArcGISDynamicMapServiceLayer) {

            $.ajax({
                url: rootLayer.url + '/legend?f=json&pretty=true',//oViewModel.oCountryProfile.oSummary['MapServiceURL'] + '/legend?f=json&pretty=true',
                type: 'GET',
                dataType: 'jsonp',
                success: function (results) {
                    legendInfo = results.layers;

                    if ($('.ui-map-content-menu').length > 0 ) {
                        $('.ui-map-content-menu').remove();
                    }

                    $('.ui-mapview').append(buildLayerList(rootLayer, results.layers)); 

                    $('.ui-map-content-menu').menu();


                    $.publish(_oEvents.onMapViewReposition);
 

                    $('.ui-map-content-menu-action').on('click', function (event) {
                       // console.log($(this));
                        //var txt = $(this).text();
                        var newArray = [];
                        var id = parseInt($(this).attr('id'));
                        var service = $(this).attr('name');
                        var l = oViewModel['oMapView'].getLayer(service);

                        console.log(l)
                        console.log(l.visibleLayers);
                   
                        if ($.inArray(id, l.visibleLayers) === -1) {
                            newArray = l.visibleLayers;
                            console.log(id + ' layer id not found in ' + l.id);
                            newArray.push(id);
                            $(this).find('.ui-maplayer-visible-icon').addClass('ui-icon-check ui-icon');
                        }
                        else {
                            $(l.visibleLayers).each(function (i, value) {
                                if (value !== id) {
                                    newArray.push(value);
                                }
                            });
                            l.setVisibleLayers(newArray);
                            $(this).find('.ui-maplayer-visible-icon').removeClass('ui-icon-check ui-icon');
                        }
                        l.setVisibleLayers(newArray);

                        $(oViewModel['oMapView'].layerIds).each(function (index, layerId) {
                            var alayer = oViewModel['oMapView'].getLayer(layerId);
                            if (alayer instanceof esri.layers.ArcGISDynamicMapServiceLayer) {
                                alayer.refresh();
                            }
                        });
                        console.log(l.visibleLayers);
                    });

                },
                error: function (x, y, z) {
                    console.log(x + y + z);
                }
            });


        }
    });
    */

});


 

function buildLayerList(root, legend) {
 
    var layerInfos = root.layerInfos
    var legendInfo;
    var html = '<ul style="z-index: 1; position: absolute;" class="ui-map-content-menu unstyled ui-menu ui-widget ui-widget-content ui-corner-all">';
    html += '<li class="ui-map-content-menu-item ui-menu-item">';
    html += '<a href="#" class="ui-map-content-menu-action ui-corner-all">' + root.id + '</a>';
    html += '<ul class="unstyled">'
    $(layerInfos).each(function (i, layerInfo) {
        if (parseInt(layerInfo.parentLayerId) === -1) {
            console.log(layerInfo);
            if (layerInfo.subLayerIds) {
                console.log(layerInfo.name + ' childern are  = ' + layerInfo.subLayerIds);
                html += '<li class="ui-map-content-menu-item ui-menu-item">';
                html += '<a href="#" class="ui-map-content-menu-action ui-corner-all" name="'+root.id+'">' + layerInfo.name + '</a>';
                html += '<ul class="unstyled">'
                $.each(layerInfo.subLayerIds, function (j, subLayerId) {
                    //console.log('the child is ');
                   // console.log(layerInfos[subLayerId]);
                    legendInfo = getLegendForLayer(subLayerId, legend);
 

                    html += '<li class="ui-map-content-menu-item ui-menu-item">';
                    html += '<a class="ui-map-content-menu-action ui-corner-all " href="#" id="' + subLayerId + '" name="' + root.id + '">';

                    if ($.inArray(subLayerId, root.visibleLayers) !== -1) {
                        html += '<span class="ui-maplayer-visible-icon ui-icon ui-icon-check"></span>';
                    }
                    else {
                        html += '<span class="ui-maplayer-visible-icon"></span>';
                    }

                    if (legendInfo.legend && legendInfo.legend.length === 1) {
                        html += '<span>';
                        html += '<img  class="ui-map-layer-symbol" src="data:image/png;base64,' + legendInfo.legend[0].imageData + '"/>'
                        html += ' </span>';
                        html += legendInfo.legend[0].label === 'undefined' || legendInfo.legend[0].label === null || legendInfo.legend[0].label.length < 1 ? layerInfos[subLayerId].name : legendInfo.legend[0].label;
                        html += '<br/>';
                    }
                    else if (legendInfo.legend && legendInfo.legend.length > 1) {
                        html += layerInfos[subLayerId].name + '<br/>';
                        $(legendInfo.legend).each(function (k, l) {
                            html += '<span>';
                            html += '<img  class="ui-map-layer-symbol" src="data:image/png;base64,' + l.imageData + '"/>'
                            html += ' </span>';
                            html += l.label === 'undefined' || l.label === null || l.label.length < 1 ? '' : l.label;
                            html += '<br/>';
                        });
                    }

                    html += '</a>';
                    html += '</li>';

                });
                html += '</ul>'
                html += '</li>';
            }
            else {
                legendInfo = getLegendForLayer(layerInfo.id, legend);
                html += '<li class="ui-map-content-menu-item ui-menu-item">';
                html += '<a class="ui-map-content-menu-action ui-corner-all " href="#" id="' + layerInfo.id + '" name="' + root.id + '">';
             

                if ($.inArray(layerInfo.id, root.visibleLayers) !== -1) {
                    html += '<span class="ui-maplayer-visible-icon ui-icon ui-icon-check"></span>';
                }
                else {
                    html += '<span class="ui-maplayer-visible-icon"></span>';
                }
              
 
                if (legendInfo.legend && legendInfo.legend.length === 1) {
                    html += '<span>';
                    html += '<img  class="ui-map-layer-symbol" src="data:image/png;base64,' + legendInfo.legend[0].imageData + '"/>'
                    html += ' </span>';
                    html += legendInfo.legend[0].label === 'undefined' || legendInfo.legend[0].label === null || legendInfo.legend[0].label.length < 1 ? layerInfo.name : legendInfo.legend[0].label;
                    html += '<br/>';
                }
                else if (legendInfo.legend && legendInfo.legend.length > 1) {
                    html += layerInfo.name + '<br/>';
                    $(legendInfo.legend).each(function (k, l) {
                        html += '<span>';
                        html += '<img  class="ui-map-layer-symbol" src="data:image/png;base64,' + l.imageData + '"/>'
                        html += ' </span>';
                        html += l.label === 'undefined' || l.label === null || l.label.length < 1 ? '' : l.label;
                        html += '<br/>';
                    });
                }

                html += '</a>';
                html += '</li>';
 
            }
           
        }
    });
    html += '</ul>'
    html += '</li>';
    html += '</ul>';
  //  console.log(html);
    return  html;
}
function getLegendForLayer(layerId, legend) {
    var result;
    for (var i = 0 ; i < legend.length ; i++) {
        if(layerId == legend[i].layerId) {
            result = legend[i];
            break;
        }
    }
    return result; 
}

 

 