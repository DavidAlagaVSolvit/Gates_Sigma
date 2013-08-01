// demo code only.
// Reference
// http://www.html5rocks.com/features/file
// http://www.html5rocks.com/tutorials/dnd/basics/
// https://developer.mozilla.org/En/DragDrop/Drag_Operations
// http://help.arcgis.com/en/webapi/javascript/arcgis/jssamples/#sample/exp_dragdrop
// http://www.html5rocks.com/tutorials/file/dndfiles/
// https://developer.mozilla.org/en/Using_files_from_web_applications
var _oShareView = _oShareView || {

    fnStart: function () {
        console.log('start shareview');
        $(document).ready(function () {
            _oShareView.fnStartFileSharing();
            _oShareView.fnCreateResultsTable();
        });

    },

    fnCreateResultsTable: function () {
        oViewModel.sDataTableDiv = 'uiDataTable'
        $('#' + oViewModel.sDataTableDiv).dataTable(
               {
                   bLengthChange: false,
                   bPaginate: false,
                   bFilter: false,
                   bSort: false,
                   bInfo: false,
                   bAutoWidth: true,
                   bDestroy: true,
                   bSearchable: false,
                   aoColumnDefs: [{
                       aTargets: [0],
                       sWidth: "1em",
                       mRender: function (data, type, full) {
                           console.log(data + ' ' + type + ' ' + full);
                           var lbl = null;

                           if (data == true) {
                               lbl = '<input class="ui-checkbox-show" id="' + full[1] + '" type="checkbox" checked="checked"  class="padding5" value="' + full[1] + '"  />  ';
                           }
                           else {
                               lbl = '<input id="' + full[1] + '" type="checkbox"   class="padding5" value="' + full[1] + '"  /> ';
                           }
                           return lbl;
                       }
                   }]
               }
           );
        $('.ui-results-datatable').hide();
        $('.ui-data-upload-container').hide();
    },

    fnStartFileSharing: function () {

        //$('#uploadForm').change(function (evt) {
        //    evt.preventDefault();
        //    console.log("uploadForm");
        //    console.log(this.files);
        //    _oShareView.fnUploadFile(this.files);

        //});
        if ($('#uploadForm').length > 0) {
            dojo.connect(dojo.byId("uploadForm").data, "onchange", function (evt) {
                evt.preventDefault();

                _oShareView.fnUploadFile(this.files);
            });
        }



        if ((window.File || window.FileReader) && Modernizr.draganddrop) {

            //Let's verify that we have proper browser support, before
            //moving ahead. You can also use a library like Modernizr
            //to detect browser cappabilities:
            //http://www.modernizr.com/
            //if (!window.File || !window.FileReader) {
            //    alert('no file type');
            //    alert(window);
            //    return;
            //}
            // Reference
            // http://www.html5rocks.com/features/file
            // http://www.html5rocks.com/tutorials/dnd/basics/
            // https://developer.mozilla.org/En/DragDrop/Drag_Operations
            dojo.connect(dojo.byId(oViewModel.sMapViewDiv), "dragenter", function (evt) {
                // If we don't prevent default behavior here, browsers will
                // perform the default action for the file being dropped i.e,
                // point the page to the file.
                evt.preventDefault();
            });

            dojo.connect(dojo.byId(oViewModel.sMapViewDiv), "dragover", function (evt) {
                evt.preventDefault();
            });

            dojo.connect(dojo.byId(oViewModel.sMapViewDiv), "drop", _oShareView.fnHandleDrop);
        }

    },

    fnHandleDrop: function (evt) {
        console.log("Drop: ", evt);
        console.log(evt);
        evt.preventDefault();
        // Reference
        // http://www.html5rocks.com/tutorials/file/dndfiles/
        // https://developer.mozilla.org/en/Using_files_from_web_applications
        var dataTransfer = evt.dataTransfer,
          files = dataTransfer.files,
          types = dataTransfer.types;

        // File drop?
        if (files && files.length === 1) {
            console.log("[ FILES ]");
            var file = files[0]; // that's right I'm only reading one file
            console.log("type = ", file.type);
            if (file.type.indexOf("image/") !== -1) {
                //  handleImage(file, evt.layerX, evt.layerY);
            } else if (file.name.indexOf(".csv") !== -1) {
                _oShareView.fnHandleCsv(file);

            }
        }

            // Textual drop?
        else if (types) {
            console.log("[ TYPES ]");
            console.log("  Length = ", types.length);
            dojo.forEach(types, function (type) {
                if (type) {
                    console.log("  Type: ", type, ", Data: ", dataTransfer.getData(type));
                }
            });

            // We're looking for URLs only.
            var url;
            dojo.some(types, function (type) {
                if (type.indexOf("text/uri-list") !== -1) {
                    url = dataTransfer.getData("text/uri-list");
                    return true;
                } else if (type.indexOf("text/x-moz-url") !== -1) {
                    url = dataTransfer.getData("text/plain");
                    return true;
                } else if (type.indexOf("text/plain") !== -1) {
                    url = dataTransfer.getData("text/plain");
                    url = url.replace(/^\s+|\s+$/g, "");
                    if (url.indexOf("http") === 0) {
                        return true;
                    }
                }
                return false;
            });

            if (url) {
                url = url.replace(/^\s+|\s+$/g, "");
                // Check if this URL is a google search result.
                // If so, parse it and extract the actual URL
                // to the search result
                if (url.indexOf("www.google.com/url") !== -1) {
                    var obj = esri.urlToObject(url);
                    if (obj && obj.query && obj.query.url) {
                        url = obj.query.url;
                    }
                }

                //if (url.match(/MapServer\/?$/i)) {
                //    // ArcGIS Server Map Service?
                //    handleMapServer(url);
                //} else if (url.match(/(Map|Feature)Server\/\d+\/?$/i)) {
                //    // ArcGIS Server Map/Feature Service Layer?
                //    handleFeatureLayer(url);
                //} else if (url.match(/ImageServer\/?$/i)) {
                //    // ArcGIS Server Image Service?
                //    handleImageService(url);
                //}
            }
        }
    },


    //File upload for older browsers
    fnUploadFile: function (files) {
        if (files && files.length === 1) {
            console.log("handle files");
            _oShareView.fnHandleCsv(files[0]);
        } else {
            dojo.byId("status").innerHTML = "Uploading..." + _oApp.getAbsolutePath() + "Upload.ashx";
            var requestHandle = esri.request({
                url: _oApp.getAbsolutePath() + "Upload.ashx",// servicesbeta.esri.com/demos/csv/reflect.ashx",
                form: dojo.byId("uploadForm"),
                load: _oShareView.fnRequestSucceeded,
                error: _oShareView.fnRequestFailed
            });
        }
    },

    fnRequestSucceeded: function (response) {
        dojo.byId("status").innerHTML = "";
        _oShareView.fnHandleCsv(response);
    },

    fnRequestFailed: function (error) {
        dojo.byId("status").innerHTML = 'Unable to upload';
        console.log(dojo.toJson(error));

    },

    fnHandleCsv: function (file) {
        console.log(file);
        console.log("Processing CSV: " + file + ", file name = " + file.name + ",  file type = " + file.type + ", file size = " + file.size);
        if (file.data) {
            console.log("Processing CSV: found file.data");
            var decoded = _oUtilities.fnBytesToString(dojox.encoding.base64.decode(file.data));
            _oShareView.fnProcessCsvData(decoded, file.fileName);
        } else {
            var reader = new FileReader();
            reader.onload = function () {
                console.log("Finished reading CSV data");
                _oShareView.fnProcessCsvData(reader.result, file.name);
            };
            reader.readAsText(file);
        }
    },

    fnProcessCsvData: function (data, fileName) {
        console.log("fnProcessCsvData:  data " + + ", " + fileName);

        var newLineIdx = data.indexOf("\n");
        var firstLine = dojo.trim(data.substr(0, newLineIdx)); //remove extra whitespace, not sure if I need to do this since I threw out space delimiters
        var separator = _oUtilities.fnGetSeparator(firstLine);
        var csvStore = new dojox.data.CsvStore({
            data: data,
            separator: separator
        });

        csvStore.fetch({
            onComplete: function (items, request) {
                var objectId = 0;
                var featureCollection = _oShareView.fnGenerateFeatureCollectionTemplateCsv(csvStore, items);
                var popupInfo = _oShareView.fnGenerateDefaultPopupInfo(featureCollection);
                var infoTemplate = new esri.InfoTemplate(_oShareView.fnBuildInfoTemplate(popupInfo));
                var latField, longField;
                var fieldNames = csvStore.getAttributes(items[0]);
                var latFieldStrings = ["lat", "latitude", "latitute", "y", "ycenter"];
                var longFieldStrings = ["lon", "long", "longitude", "x", "xcenter", "lng"];

                dojo.forEach(fieldNames, function (fieldName) {
                    var matchId;
                    matchId = dojo.indexOf(latFieldStrings, fieldName.toLowerCase());
                    if (matchId !== -1) {
                        latField = fieldName;
                    }

                    matchId = dojo.indexOf(longFieldStrings, fieldName.toLowerCase());
                    if (matchId !== -1) {
                        longField = fieldName;
                    }
                });

                // Add records in this CSV store as graphics
                dojo.forEach(items, function (item, index) {
                    var attrs = csvStore.getAttributes(item),
                      attributes = {};
                    // Read all the attributes for  this record/item
                    dojo.forEach(attrs, function (attr) {
                        var value = Number(csvStore.getValue(item, attr));
                        if (isNaN(value)) {
                            attributes[attr] = csvStore.getValue(item, attr);
                        } else {
                            attributes[attr] = value;
                        }
                    });

                    attributes["__OBJECTID"] = objectId;
                    objectId++;

                    var latitude = parseFloat(attributes[latField]);
                    var longitude = parseFloat(attributes[longField]);

                    if (isNaN(latitude) || isNaN(longitude)) {
                        return;
                    }

                    var geometry = esri.geometry.geographicToWebMercator(new esri.geometry.Point(longitude, latitude));
                    var feature = {
                        "geometry": geometry.toJson(),
                        "attributes": attributes
                    };
                   // var graphic = new esri.Graphic(geometry, oViewModel['oSymbols'].oSelectedMarkerSymbol);
                    //graphic.attributes = attributes;

                    //featureCollection.featureSet.features.push(graphic);
                    featureCollection.featureSet.features.push(feature);
                });
                oViewModel['oFixedImmunizationLocationFeatureCollection'] = featureCollection;

                oViewModel['oShapeEditingFeatureLayer'] = new esri.layers.FeatureLayer(oViewModel['oFixedImmunizationLocationFeatureCollection'], {
                    id: oViewModel['oShapeEditingFeatureLayerId'],
                    mode: esri.layers.FeatureLayer.MODE_SNAPSHOT
                });
                //var featureLayer = new esri.layers.FeatureLayer(featureCollection, {
                //    infoTemplate: infoTemplate,
                //    id: fileName
                //});
                oViewModel['oShapeEditingFeatureLayer'].__popupInfo = popupInfo;
                oViewModel.oMapView.addLayer(oViewModel['oShapeEditingFeatureLayer']);
                _oShareView.fnZoomToData(oViewModel['oShapeEditingFeatureLayer']);
               // _oShareView.fnAddToTable(fileName, featureLayer);
            },
            onError: function (error) {
                console.error("Error fetching items from CSV store: ", error);
            }
        });
    },

    fnAddToTable: function (name, featureLayer) {
        console.log(' fnAddToTable ' + name)
        $('#' + oViewModel.sDataTableDiv).dataTable().fnAddData([true, name]);
        if (name) {
            $('.ui-results-datatable').show();
            $('.ui-data-upload-container').show();

        }
        $('.ui-checkbox-show').on("click", function (e) {
            console.log('.ui-checkbox-show');
            var l = oViewModel.oMapView.getLayer($(this).val());
            l.hide();
            if ($(this).is(':checked')) {
                l.show();
            }
        });

    },

    fnGenerateFeatureCollectionTemplateCsv: function (store, items) {
        //create a feature collection for the input csv file
        var featureCollection = {
            "layerDefinition": null,
            "featureSet": {
                "features": [],
                "geometryType": "esriGeometryPoint"
            }
        };
        featureCollection.layerDefinition = {
            "geometryType": "esriGeometryPoint",
            "objectIdField": "__OBJECTID",
            "type": "Feature Layer",
            "typeIdField": "",
            "drawingInfo": {
                "renderer": {
                    "type": "simple",
                    "symbol": {
                        "type": "esriSMS",
                        "style": "esriSMSSquare",
                        "color": [76, 115, 0, 255],
                        "size": 8,
                        "angle": 0,
                        "xoffset": 0,
                        "yoffset": 0,
                        "outline":
                         {
                             "color": [152, 230, 0, 255],
                             "width": 1
                         }
                    }
                }
            },
            "fields": [{
                "name": "__OBJECTID",
                "alias": "__OBJECTID",
                "type": "esriFieldTypeOID",
                "editable": false,
                "domain": null
            }],
            "types": [],
            "capabilities": "Query"
        };

        var fields = store.getAttributes(items[0]);
        dojo.forEach(fields, function (field) {
            var value = store.getValue(items[0], field);
            var parsedValue = Number(value);
            if (isNaN(parsedValue)) { //check first value and see if it is a number
                featureCollection.layerDefinition.fields.push({
                    "name": field,
                    "alias": field,
                    "type": "esriFieldTypeString",
                    "editable": true,
                    "domain": null
                });
            } else {
                featureCollection.layerDefinition.fields.push({
                    "name": field,
                    "alias": field,
                    "type": "esriFieldTypeDouble",
                    "editable": true,
                    "domain": null
                });
            }
        });
        return featureCollection;
    },

    fnGenerateDefaultPopupInfo: function (featureCollection) {
        var fields = featureCollection.layerDefinition.fields;
        var decimal = {
            'esriFieldTypeDouble': 1,
            'esriFieldTypeSingle': 1
        };
        var integer = {
            'esriFieldTypeInteger': 1,
            'esriFieldTypeSmallInteger': 1
        };
        var dt = {
            'esriFieldTypeDate': 1
        };
        var displayField = null;
        var fieldInfos = dojo.map(fields, dojo.hitch(this, function (item, index) {
            if (item.name.toUpperCase() === "NAME") {
                displayField = item.name;
            }
            var visible = (item.type !== "esriFieldTypeOID" && item.type !== "esriFieldTypeGlobalID" && item.type !== "esriFieldTypeGeometry");
            var format = null;
            if (visible) {
                var f = item.name.toLowerCase();
                var hideFieldsStr = ",stretched value,fnode_,tnode_,lpoly_,rpoly_,poly_,subclass,subclass_,rings_ok,rings_nok,";
                if (hideFieldsStr.indexOf("," + f + ",") > -1 || f.indexOf("area") > -1 || f.indexOf("length") > -1 || f.indexOf("shape") > -1 || f.indexOf("perimeter") > -1 || f.indexOf("objectid") > -1 || f.indexOf("_") == f.length - 1 || f.indexOf("_i") == f.length - 2) {
                    visible = false;
                }
                if (item.type in integer) {
                    format = {
                        places: 0,
                        digitSeparator: true
                    };
                } else if (item.type in decimal) {
                    format = {
                        places: 2,
                        digitSeparator: true
                    };
                } else if (item.type in dt) {
                    format = {
                        dateFormat: 'shortDateShortTime'
                    };
                }
            }

            return dojo.mixin({}, {
                fieldName: item.name,
                label: item.alias,
                isEditable: false,
                tooltip: "",
                visible: visible,
                format: format,
                stringFieldOption: 'textbox'
            });
        }));

        var popupInfo = {
            title: displayField ? '{' + displayField + '}' : '',
            fieldInfos: fieldInfos,
            description: null,
            showAttachments: false,
            mediaInfos: []
        };
        return popupInfo;
    },

    fnBuildInfoTemplate: function (popupInfo) {
        var json = {
            content: "<table>"
        };

        dojo.forEach(popupInfo.fieldInfos, function (field) {
            if (field.visible) {
                json.content += "<tr><td valign='top'>" + field.label + ": <\/td><td valign='top'>${" + field.fieldName + "}<\/td><\/tr>";
            }
        });
        json.content += "<\/table>";
        return json;
    },





    fnClearAll: function () {
        oViewModel.oMapView.graphics.clear();
        var layerIds = map.graphicsLayerIds.slice(0);
        layerIds = layerIds.concat(map.layerIds.slice(1));

        dojo.forEach(layerIds, function (layerId) {
            oViewModel.oMapView.removeLayer(map.getLayer(layerId));
        });
    },



    fnZoomToData: function (featureLayer) {
        // Zoom to the collective extent of the data
        var multipoint = new esri.geometry.Multipoint(oViewModel.oMapView.spatialReference);
        dojo.forEach(featureLayer.graphics, function (graphic) {
            var geometry = graphic.geometry;
            if (geometry) {
                multipoint.addPoint({
                    x: geometry.x,
                    y: geometry.y
                });
            }
        });

        if (multipoint.points.length > 0) {
            oViewModel.oMapView.setExtent(multipoint.getExtent().expand(1.25), true);
        }
    }
}
