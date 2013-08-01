

// doc ready 
$(document).ready(function () {

    // country name list 
    $('.ui-country-name').append('<option value="-1" selected >Type or select country name from list below</option>');

    $.ajax({
        url: oViewModel['sApiURI'] + oViewModel['sCountrytListAction'],
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            $(data['$values']).each(function (index, record) {
                $('.ui-country-name').append('<option value="' + record['GeoNameId'] + '" selected >' + record['CountryName'] + '</option>');
            });
        },
        error: function (x, y, z) {
            console.log(x + y + z);
        }
    });

    $(".ui-country-name").combobox({
        selected: function (event, ui) {
            $.publish(_oEvents.onCountryNameChange, {
                text: ui.item.text,
                value: parseInt(ui.item.value)
            });
        }
    });

 

    $('.ui-map-query-option :button').click(function (evt) {
        var activate = false;
        $('.ui-map-use-instruction').hide();
        $.publish(_oEvents.onQuerySpatialSelectActivate, {
            action: activate
        });

        $.publish(_oEvents.onIdentifyTaskActivate, {
            action: activate
        });
       
        switch (parseInt($(this).attr('value'))) {
            case 1:
                $.publish(_oEvents.onQuerySpatialSelectActivate, {
                    action: true
                });
                break;
            case 2:
                $.publish(_oEvents.onIdentifyTaskActivate, {
                    action: true
                });
                $('html').animate({ scrollTop: 1000 }, 'slow');
                $('.ui-map-use-instruction').show();
                break;
            default:

        }

    });

    $('.ui-mapview-reset').click(function () {
        $.publish(_oEvents.onCountryNameChange, {
            text: '',
            value: -1
        });
    });
});

// activate/deactivate spatial selection 
$.subscribe(_oEvents.onQuerySpatialSelectActivate, function (topic, data) {
    console.log('analyis onQuerySpatialSelectActivate ');

    if (data.action) {
        console.log('analyis up query is on  ');
        //  oViewModel['bSpatialSelectActivated'] = true;
        esri.bundle.toolbars.draw.addPoint = 'Click on map to select a country';
        oViewModel['oDrawingToolbar'] = new esri.toolbars.Draw(oViewModel['oMapView'], oViewModel['oDrawingToolbarOptions']);

        oViewModel['oDrawingCompleteListener'] = dojo.connect(oViewModel['oDrawingToolbar'], 'onDrawComplete', function (shape) {
            oViewModel.oMapView.graphics.clear();
            oViewModel.oMapView.graphics.add(new esri.Graphic(shape.geometry, oViewModel['oSymbols'].oSelectedMarkerSymbol));
            $.publish(_oEvents.onDrawingComplete, {
                geometry: shape.geometry,
                geography: shape.geographicGeometry,
                geographic: esri.geometry.webMercatorToGeographic(shape.geometry)
            });
        });

        oViewModel['oDrawingToolbar'].activate(esri.toolbars.Draw.POINT);
    }
    else {
        console.log('analyis up query is off  ');
        //  oViewModel['bSpatialSelectActivated'] = false;
      //  esri.bundle.toolbars.draw.addPoint = 'Click to add a point';

        if (oViewModel['oDrawingCompleteListener']) {
            dojo.disconnect(oViewModel['onDrawingCompleteListener']);
            oViewModel['oDrawingCompleteListener'] = null;
        }

        if (oViewModel['oDrawingToolbar']) {
            oViewModel['oDrawingToolbar'].deactivate();
            oViewModel['oDrawingToolbar'] = null;

        }
    }
});

// get country profile by lat and lng 
$.subscribe(_oEvents.onDrawingComplete, function (topic, data) {
    console.log('analyis onDrawingComplete');
    var uri = null;
    var tolerance = null;
    var coordinateSystemId = null;
    if (data && data.geographic) {
        tolerance = (data.tolerance === 'undefined' || data.tolerance === null ? 0.1 : data.tolerance);
        coordinateSystemId = (data.coordinateSystemId === 'undefined' || data.coordinateSystemId === null ? 4326 : data.coordinateSystemId);
        query = '?latitude=' + data.geographic.y + '&longitude=' + data.geographic.x;// + '&coordinateSystemId=' + coordinateSystemId + '&tolerance=' + tolerance;
        //query = '/' + data.geographic.y + '/' + data.geographic.x;// + '/' + coordinateSystemId + '/' + tolerance;
        uri = oViewModel['sApiURI'] + 'api/country/FindByLocation' + query;
    }
    $.publish(_oEvents.onCountryProfileUpdate, {
        uri: uri
    });
});
// get country profile by country code 
$.subscribe(_oEvents.onCountryNameChange, function (topic, data) {
    console.log('get country profile by country code');
    var uri = null;
    if (data.value !== "-1" && parseInt(data.value) !== -1) {
        uri = oViewModel['sApiURI'] + 'api/country/find/' + data.value
    }
    $.publish(_oEvents.onCountryProfileUpdate, {
        uri: uri
    });
});

// update country profile 
$.subscribe(_oEvents.onCountryProfileUpdate, function (topic, data) {
    console.log('update country profile ');
    oViewModel['oMapView'].graphics.clear();
    $('.ui-info-messge').html('');
    $('.ui-info-messge').html('SIGMA does not have any records for the selected country name or geographic location. Please make another choice.');

    // reset menu 
    if ($('.ui-map-content-menu').length > 0) {
        $('.ui-map-content-menu').remove();
    }

    // hide identify mode and turn off 
    $('.ui-identify-button-option').hide();

    // reset map service 
    console.log('Reset map service' + oViewModel['oCountryProfile'].sOpsMapLayerId);
    if (oViewModel['oCountryProfile'].sOpsMapLayerId) {
        $.publish(_oEvents.onMapViewRemoveMapLayers, {
            layerIds: [oViewModel['oCountryProfile'].sOpsMapLayerId]
        });
        oViewModel['oCountryProfile'].sOpsMapLayerId = null;
    }

    console.log('reset wizard controls/forms/tables ');

    $.each(oViewModel['oTables'], function (key, value) {
        if (value) {
            value.fnClearTable();
            value.fnAddData([]);
        }
        oViewModel.oTables[key] = null;
    });

    $('.ui-country-vaccine-schedule-table-container').empty();
    $('.ui-country-demographic-table-container').empty();

    // clear old profile data 
    oViewModel['oCountryProfile'] = {
        sDate: null,
        sOpsMapLayerId: null,
        iSelectedAdmin1GeoNameId: null,
        oSummary: {},
        oGeoNames: {},
    };

    if (data && data.uri) {
        $.ajax({
            url: data.uri,
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                oViewModel['oCountryProfile'] = {
                    oSummary: data
                };
                $.publish(_oEvents.onMapViewUpdateExtent, {
                    north: oViewModel['oCountryProfile'].oSummary.North,
                    south: oViewModel['oCountryProfile'].oSummary.South,
                    east: oViewModel['oCountryProfile'].oSummary.East,
                    west: oViewModel['oCountryProfile'].oSummary.West
                });
                $.publish(_oEvents.onMapViewReposition);
                $.publish(_oEvents.onCountryNameChangeComplete, {});
                $.publish(_oEvents.onAnalysisUpdateDemandForcastResults, {});
            },
            error: function (x, y, z) {
                console.log(x + y + z);
            }
        });
    }
    else {
        // $.publish(_oEvents.onCountryNameChangeComplete, {});
        $.publish(_oEvents.onMapViewUpdateExtent, {
            north: oViewModel['oFullGeographicExtent'].dNorth,
            south: oViewModel['oFullGeographicExtent'].dSouth,
            east: oViewModel['oFullGeographicExtent'].dEast,
            west: oViewModel['oFullGeographicExtent'].dWest
        });
        $.publish(_oEvents.onMapViewReposition);
    }

});

// add dynamic map service for selected country 
$.subscribe(_oEvents.onCountryNameChangeComplete, function (topic, data) {
    console.log('add dynamic map service for selected country ');

    oViewModel['oMapView'].graphics.clear();

    $('.ui-info-messge').html('');
    $('.ui-info-messge').html(oViewModel['oCountryProfile'].oSummary.CountryName + ' SIGMA Databases:</br> [No] Fixed Immunization Locations </br> [No] Outreach Locations </br>  [No] Campaign Locations');
 

    if (oViewModel['oCountryProfile'].oSummary.MapServiceURL) {
        $('.ui-info-messge').html('');
        $('.ui-identify-button-option').show();
        $('.ui-info-messge').append(oViewModel['oCountryProfile'].oSummary.CountryName + ' SIGMA Databases:</br> [Yes] Fixed Immunization Locations </br> [No] Outreach Locations </br>  [No] Campaign Locations');
        oViewModel['oCountryProfile'].sOpsMapLayerId = oViewModel['oCountryProfile'].oSummary.CountryName;//'ops' + oViewModel['oCountryProfile'].oSummary.GeoNameId

        $.publish(_oEvents.onMapViewAddMapLayers, {
            layers: [
                {
                    id: oViewModel['oCountryProfile'].sOpsMapLayerId,
                    url: oViewModel['oCountryProfile'].oSummary.MapServiceURL,
                    type: 'dynamic'
                }
            ]
        });
    }
    else if (oViewModel['oCountryProfile'].oSummary.Shape) {
        // see https://github.com/Esri/Terraformer
        console.log('Parse wkt boundary for ' + oViewModel['oCountryProfile'].oSummary.CountryName);
       // console.log(oViewModel['oCountryProfile'].oSummary.Shape.Geometry.WellKnownText);
        oViewModel.oMapView.graphics.add(new esri.Graphic(esri.geometry.fromJson(Terraformer.ArcGIS.convert(
            Terraformer.WKT.parse(oViewModel['oCountryProfile'].oSummary.Shape.Geometry.WellKnownText))),
            oViewModel['oSymbols'].oSelectedPolygonSymbol));
    }
    else {
        console.log('No boundary/map service for ' + oViewModel['oCountryProfile'].oSummary.CountryName);
    }
});

// update date field 
$.subscribe(_oEvents.onCountryNameChangeComplete, function (topic, data) {
    console.log('update date field  ');

    if ($(".ui-country-name").val() !== oViewModel['oCountryProfile'].oSummary.GeoNameId) {
        $(".ui-country-name").val(oViewModel['oCountryProfile'].oSummary.GeoNameId);
        $(".ui-combobox-input").val($('.ui-country-name option:selected').text())
        $('.ui-country-name option:selected').each(function () {
            console.log($(this).val());
            console.log($(this).text());
        });
    };


    oViewModel['oCountryProfile'].sDate = '';
    var record = oViewModel['oCountryProfile'].oSummary.GeoName.Demograhics['$values'][0]
    if (record && record.Date) {
        oViewModel['oCountryProfile'].sDate = moment(record.Date).format('YYYY');
    }
});

// render country demographic table 
$.subscribe(_oEvents.onCountryNameChangeComplete, function (topic, data) {
    console.log('update country summary tabes ');
    console.log('createCountryDemographicsTable');
    var record = oViewModel['oCountryProfile'].oSummary.GeoName.Demograhics['$values'][0]
    var tbl = '<table class="ui-country-demographic-summary ui-summary-table  padding10" style="margin-top: 10px;">';
    tbl += '<caption style="font-size:1.2em;">';
    tbl += oViewModel['oCountryProfile'].sDate + ' ' + oViewModel['oCountryProfile'].oSummary.CountryName + ' Demographics '
    tbl += '</caption>';
    tbl += '<thead>';
    tbl += '<tr>';
    tbl += '<th style="text-align: center;font-weight:bold;">Total Population</th>';
    tbl += '<th style="text-align: center;font-weight:bold;">Births</th>';
    tbl += '<th style="text-align: center;font-weight:bold;">Age 0-11 months</th>';
    tbl += '<th style="text-align: center;font-weight:bold;">Population Under Age 5</th>';
    tbl += '<th style="text-align: center;font-weight:bold;">School Age Childern (ages 5-14)</th>';
    tbl += '<th style="text-align: center;font-weight:bold;">Female Population</th>';
    tbl += '<th style="text-align: center;font-weight:bold;">Birthing Population (ages 15-49)</th>';
    tbl += '<th style="text-align: center;font-weight:bold;">Pregnant Women</th>';
    tbl += '</tr>'
    tbl += '</thead>';
    tbl += '<tbody>';
    if (record) {
        tbl += '<tr>';
        tbl += '<td  >' + _oUtilities.fnAddCommasOrFormatNull(record.TotalPopulation) + '</td>';
        tbl += '<td  >' + _oUtilities.fnAddCommasOrFormatNull(record.Births) + '</td>';
        tbl += '<td  >' + _oUtilities.fnAddCommasOrFormatNull(record.Infant) + '</td>';
        tbl += '<td  >' + _oUtilities.fnAddCommasOrFormatNull(record.Under5) + '</td>';
        tbl += '<td  >' + _oUtilities.fnAddCommasOrFormatNull(record.SchoolAge) + '</td>';
        tbl += '<td >' + _oUtilities.fnAddCommasOrFormatNull(record.Female) + '</td>';
        tbl += '<td  >' + _oUtilities.fnAddCommasOrFormatNull(record.Birthing) + '</td>';
        tbl += '<td  >' + _oUtilities.fnAddCommasOrFormatNull(record.Pregnant) + '</td>';
        tbl += '</tr>'
    }
    tbl += '</tbody>';
    tbl += '</table>';

    $('.ui-country-demographic-table-container').html(tbl);

    oViewModel['oTables'].oDemographicSummaryTable = $('.ui-country-demographic-summary').dataTable(oViewModel['oTableOptions']);

    $.publish(_oEvents.onMapViewReposition);

});

// render vaccine schedule table 
$.subscribe(_oEvents.onCountryNameChangeComplete, function (topic, data) {
    console.log('update country summary tabes ');

    console.log('createCountryVaccineScheduleTable');

    var tbl = '<table class="ui-country-vaccine-schedule-summary ui-summary-table  padding10" style="width: 100%;">';
    tbl += '<caption style="font-size:1.2em;">';
    tbl += oViewModel['oCountryProfile'].sDate + ' ' + oViewModel['oCountryProfile'].oSummary.CountryName + '  Vaccine  Schedule '
    tbl += '</caption>';
    tbl += '<thead>';
    tbl += '<tr>';
    tbl += '<th style="text-align: center;font-weight:bold;">Vaccine Type</th>';
    tbl += '<th style="text-align: center;font-weight:bold;">Abbreviation</th>';
    tbl += '<th style="text-align: center;font-weight:bold;">Presentation</th>';
    tbl += '<th style="text-align: center;font-weight:bold;">Administration Method</th>';
    tbl += '<th style="text-align: center;font-weight:bold;">Dosage/Vial </th>';
    tbl += '<th style="text-align: center;font-weight:bold;">Dosage Total</th>';
    tbl += '<th style="text-align: center;font-weight:bold;">1st Dosage Age</th>';
    tbl += '<th style="text-align: center;font-weight:bold;">2ond Dosage Age  </th>';
    tbl += '<th style="text-align: center;font-weight:bold;">3ard Dosage Age  </th>';
    tbl += '<th style="text-align: center;font-weight:bold;">4th Dosage Age  </th>';
    tbl += '<th style="text-align: center;font-weight:bold;">5th Dosage Age  </th>';
    tbl += '</tr>';
    tbl += '</thead>';
    tbl += '<tbody>';


    if (oViewModel['oCountryProfile'].oSummary.GeoName.Schedules) {
        $(oViewModel['oCountryProfile'].oSummary.GeoName.Schedules['$values']).each(function (index, record) {
            tbl += '<tr>';
            tbl += '<td>' + _oUtilities.fnAddCommasOrFormatNull(record.VaccineName) + '</td>';
            tbl += '<td>' + _oUtilities.fnAddCommasOrFormatNull(record.Abbreviation) + '</td>';
            tbl += '<td>' + _oUtilities.fnAddCommasOrFormatNull(record.VaccinePresentation) + '</td>';
            tbl += '<td>' + _oUtilities.fnAddCommasOrFormatNull(record.AdministrationMethod) + '</td>';
            tbl += '<td>' + _oUtilities.fnAddCommasOrFormatNull(record.DosagePerVial) + '</td>';
            tbl += '<td>' + _oUtilities.fnAddCommasOrFormatNull(record.DosageTotal) + '</td>';
            tbl += '<td>' + _oUtilities.fnAddCommasOrFormatNull(record.Dosage1Age) + '</td>';
            tbl += '<td>' + _oUtilities.fnAddCommasOrFormatNull(record.Dosage2Age) + '</td>';
            tbl += '<td>' + _oUtilities.fnAddCommasOrFormatNull(record.Dosage3Age) + '</td>';
            tbl += '<td>' + _oUtilities.fnAddCommasOrFormatNull(record.Dosage4Age) + '</td>';
            tbl += '<td>' + _oUtilities.fnAddCommasOrFormatNull(record.Dosage5Age) + '</td>';
            tbl += '</tr>';
        });
    }


    $('.ui-country-vaccine-schedule-table-container').html(tbl);

    oViewModel['oTables'].oVaccineScheduleTable = $('.ui-country-vaccine-schedule-summary').dataTable(oViewModel['oTableOptions']);

    $.publish(_oEvents.onMapViewReposition);


});

// update demand forcast analyis results 
$.subscribe(_oEvents.onAnalysisUpdateDemandForcastResults, function (topic, data) {
    console.log('update date field  ');
    $.ajax({
        url: oViewModel['sApiURI'] + 'api/country/admin/' + oViewModel['oCountryProfile'].oSummary.CountryCode + '/1',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            oViewModel['oGeoNames'] = {}
            oViewModel['oGeoNames'] = data['$values'];
            $('.ui-admin1-name').empty();

            $('.ui-admin1-name').append('<option value="' + oViewModel['oCountryProfile'].oSummary.GeoNameId + '">' + oViewModel['oCountryProfile'].oSummary.CountryName + '</option>');
            $(oViewModel['oGeoNames']).each(function (i, r) {
                $('.ui-admin1-name').append('<option value="' + r['GeoNameId'] + '">' + r['Name'] + '</option>');
            });
            $('.ui-admin1-name').combobox({

                selected: function (event, ui) {
                    $(".ui-admin1-name ").val($(".ui-admin1-name ").val());

                    if (ui.item.value && ui.item.text && parseInt(ui.item.value) > -1) {
                        console.log(ui.item.text);
                        oViewModel['oCountryProfile'].iSelectedAdmin1GeoNameId = ui.item.value;
                        //ShowStep5Results();

                        $.publish(_oEvents.onAnalysisShowDemandForcastResultsDetail, { refreshTableDataOnly: false });
                    }
                    else {
                        console.log('nothing selected');
                    }
                }
            });
            //showStep4Results();

            $.publish(_oEvents.onAnalysisShowDemandForcastResultsSummary, { refreshTableDataOnly: false });
            //ShowStep5Results();
            $.publish(_oEvents.onAnalysisShowDemandForcastResultsDetail, { refreshTableDataOnly: false });
        },
        error: function (x, y, z) {
            console.log(x + y + z);
        }
    });

});

// update demand forcast summary table data
$.subscribe(_oEvents.onAnalysisShowDemandForcastResultsSummaryData, function (topic, data) {
    console.log('showing step 4 data');
    oViewModel['oTables'].oPopulationCoverageTable.fnClearTable();
    var rowToAdd = [];
    var dataColumnNumber = 1;
    var prefix = oViewModel.aRowValuePrefix[dataColumnNumber];
    oViewModel['oTables'].oPopulationCoverageTable.fnAddData([]);
    $(oViewModel['TableRowDefs']).each(function (i, rowLabel) {
        rowToAdd.push(rowLabel['label']);
        $(oViewModel['oGeoNames']).each(function (index, record) {
            var demadForcastRecord = getDemandForcastRecordByRadius(record.DemandForcasts['$values'], record['SelectedDemandForcastCatachmentSize']);
            if (demadForcastRecord) {
                var fieldName = (oViewModel.aRowValuePrefix[dataColumnNumber] === rowLabel['field'] ? prefix : oViewModel.aRowValuePrefix[dataColumnNumber] + rowLabel['field']);
                var recordValue = Math.round(demadForcastRecord[fieldName] * record['SelectedDemandForcastCoveragePercent']);
                rowToAdd.push(_oUtilities.fnAddCommasOrFormatNull(recordValue));
            }
            else {
                rowToAdd.push(_oUtilities.fnAddCommasOrFormatNull(null));
            }
        });
        oViewModel['oTables'].oPopulationCoverageTable.fnAddData(rowToAdd);
        rowToAdd = [];
    });
    $.publish(_oEvents.onMapViewReposition);
});

$.subscribe(_oEvents.onAnalysisShowDemandForcastResultsSummary, function (topic, data) {
    var selControl1 = null;
    var selControl2 = null;
    var hdr1 = '<tr><th  style="text-align: center;font-weight:bold;">&nbsp</th>';
    var hdr2 = '<tr><th  style="text-align: center;font-weight:bold;">Immunization Location Catchment Area Radius</th>';
    var hdr3 = '<tr><th  style="text-align: center;font-weight:bold;">Expected Percent Coverage within Each Catchment Area</th>';
    var name = null;
    var geoId = null;

    if (data.refreshTableDataOnly) {
       // showStep4DemandForcastTableData();
        $.publish(_oEvents.onAnalysisShowDemandForcastResultsSummaryData, {});
    }
    else {
        $(oViewModel['oGeoNames']).each(function (index, record) {
            name = record['Name'];
            geoId = record['GeoNameId'];
            selControl1 = '<select id="Radius' + geoId + '"  name="' + name + '"  title="' + name + '" class="ui-demand-forcast-radius-param "    GeoNameId="' + geoId + '"> <option value="1.0" >1km</option><option value="5.0" >5km</option> <option value="10.0" >10km</option> </select>';
            selControl2 = '<select id="Percent' + geoId + '" name="' + name + '"  title="' + name + '" class="ui-demand-forcast-percent-param  "  GeoNameId="' + geoId + '"> <option value="1.0" >100%</option><option value="0.75" >75%</option><option value="0.50">50% </option><option value="0.25" >25% </option></select>';

            hdr1 += '<th style="text-align: center;font-weight:bold;">' + record['Name'] + '</th>';
            hdr2 += '<th style="text-align: center;font-weight:bold;"> ' + selControl1 + '</th>';
            hdr3 += '<th style="text-align: center;font-weight:bold;"> ' + selControl2 + '</th>';


        });
        hdr1 += '</tr>';
        hdr2 += '</tr>';
        hdr3 += '</tr>';


        var aTable = '<table class="ui-country-catchment-summary-table ui-summary-table  padding10" style="margin-top: 10px;">';
        aTable += '<caption style="font-size:1.2em;">';
        aTable += oViewModel['oCountryProfile'].sDate + ' ' + oViewModel['oCountryProfile'].oSummary.CountryName + ' Population Covered in Catchments';
        aTable += '</caption>';

        aTable += '<thead>';
        aTable += hdr1 + hdr2 + hdr3;
        aTable += '</thead>';
        aTable += '<tfoot  style="font-size:.750em;">   <tr><td colspan="' + $(oViewModel['oGeoNames']).length + '"></td></tr></tfoot>';
        aTable += '<tbody></tbody></table>';


        $('.ui-country-catchment-summary-table-container').empty();
        $('.ui-country-catchment-summary-table-container').html(aTable);
        oViewModel['oTables'].oPopulationCoverageTable = null;
        oViewModel['oTables'].oPopulationCoverageTable = $('.ui-country-catchment-summary-table').dataTable(oViewModel['oTableOptions']);

        $.publish(_oEvents.onAnalysisShowDemandForcastResultsSummaryData, {});

        aTable = null;

        $('.ui-admin1-analyis-controls-table').dataTable(oViewModel['oTableOptions']);

        $('.ui-demand-forcast-radius-param').combobox({
            selected: function (event, ui) {
                var val = ui.item.value;
                var geoNameId = $(this).attr('GeoNameId');
                console.log(ui.item.value)
                console.log(geoNameId);
                $(oViewModel['oGeoNames']).each(function (index, record) {
                    if (parseInt(record['GeoNameId']) === parseInt(geoNameId)) {
                        console.log('found');
                        record['SelectedDemandForcastCatachmentSize'] = val;
                        console.log(record);
                        return;
                    }
                });
                $.publish(_oEvents.onAnalysisShowDemandForcastResultsSummary, { refreshTableDataOnly: true });
                //showStep4Results(true);
            }
        });

        $('.ui-demand-forcast-percent-param').combobox({
            selected: function (event, ui) {
                var val = ui.item.value;
                var geoNameId = $(this).attr('GeoNameId');
                console.log(ui.item.value)
                console.log(geoNameId);
                $(oViewModel['oGeoNames']).each(function (index, record) {
                    if (parseInt(record['GeoNameId']) === parseInt(geoNameId)) {
                        console.log('found');
                        record['SelectedDemandForcastCoveragePercent'] = val;
                        console.log(record);
                        return;
                    }
                });
                $.publish(_oEvents.onAnalysisShowDemandForcastResultsSummary, { refreshTableDataOnly: true });
                //showStep4Results(true);
            }
        });
    }
});
 
$.subscribe(_oEvents.onAnalysisShowDemandForcastResultsDetailData, function (topic, data) {
    console.log('showing step 5 data');

    var rowToAdd = [];
    var fieldName = null;
    var recordValue = null;
    var demadForcastRecord = null;
    var record = getGeoNameCurrentRecordById();


    oViewModel['oTables'].oAdmin1PopulationCoverageTable.fnClearTable();
    oViewModel['oTables'].oAdmin1PopulationCoverageTable.fnAddData([]);

    if (record) {
        demadForcastRecord = getDemandForcastRecordByRadius(record.DemandForcasts['$values'], record['SelectedDemandForcastCatachmentSize']);

        $(oViewModel['TableRowDefs']).each(function (i, rowLabel) {
            rowToAdd.push(rowLabel['label']);
            $(oViewModel['aRowValuePrefix']).each(function (dataColumnNumber, prefix) {
                if (demadForcastRecord) {
                    fieldName = (prefix === rowLabel['field'] ? prefix : prefix + rowLabel['field']);
                    if($.inArray(prefix,oViewModel['aAdjustableRowValuesPrefix']) === -1 ){
                        recordValue = Math.round(demadForcastRecord[fieldName]);
                    }
                    else {
                        recordValue = Math.round(demadForcastRecord[fieldName] * record['SelectedDemandForcastCoveragePercent']);
                    }
                    rowToAdd.push(_oUtilities.fnAddCommasOrFormatNull(recordValue));
                }
                else {
                    rowToAdd.push(_oUtilities.fnAddCommasOrFormatNull(null));
                }
            });
            oViewModel['oTables'].oAdmin1PopulationCoverageTable.fnAddData(rowToAdd);
            rowToAdd = [];
        });
        $.publish(_oEvents.onMapViewUpdateExtent, {
            north: record['Latitude'] + oViewModel['dExtentOffset'],
            south: record['Latitude'] - oViewModel['dExtentOffset'],
            east: record['Longitude'] + oViewModel['dExtentOffset'],
            west: record['Longitude'] - oViewModel['dExtentOffset']
        });
    }
    $.publish(_oEvents.onMapViewReposition);
});

$.subscribe(_oEvents.onAnalysisShowDemandForcastResultsDetail, function (topic, data) {
    console.log('showing step 5 results');

    if (data.refreshTableDataOnly) {
        //showStep5DemandForcastTableData();
        $.publish(_oEvents.onAnalysisShowDemandForcastResultsDetailData,{});
    }
    else {
        var aTable = '<table class="ui-admin1-catchment-coverage-table ui-summary-table  padding10" style="margin-top: 10px;">';
        aTable += '<caption style="font-size:1.2em;">';
        aTable += oViewModel['oCountryProfile'].sDate + ' ' + oViewModel['oCountryProfile'].oSummary.CountryName;
        aTable += '</caption>';

        aTable += '<thead>'
        aTable += '<tr>'
        aTable += '<th  style="text-align: center;font-weight:bold;">' + _oUtilities.fnAddCommasOrFormatNull(null) + '</th>'
        aTable += '<th  style="text-align: center;font-weight:bold;">' + _oUtilities.fnAddCommasOrFormatNull(null) + '</th>'
        aTable += '<th  style="text-align: center;font-weight:bold;" colspan="2">Inside Catchment</th>'

        aTable += '<th  style="text-align: center;font-weight:bold;">' + _oUtilities.fnAddCommasOrFormatNull(null) + ' </th>'
        aTable += '</tr>'
        aTable += '<tr>'
        aTable += '<th  style="text-align: center;font-weight:bold;">Demograhic</th>'
        aTable += '<th  style="text-align: center;font-weight:bold;">Total</th>'
        aTable += '<th  style="text-align: center;font-weight:bold;">Covered</th>'
        aTable += '<th  style="text-align: center;font-weight:bold;">Uncovered</th>'
        aTable += '<th  style="text-align: center;font-weight:bold;">Outside Catchment</th>'
        aTable += '</tr>'
        aTable += '</thead>'

        aTable += '<tbody></tbody></table>';

        $('.ui-admin1-catchment-coverage-table-container').empty();
        $('.ui-admin1-catchment-coverage-table-container').html(aTable);

        oViewModel['oTables'].oAdmin1PopulationCoverageTable = $('.ui-admin1-catchment-coverage-table').dataTable(oViewModel['oTableOptions']);


        $('.ui-admin1-name-catchment-radius').combobox({
            selected: function (event, ui) {
                var val = ui.item.value;
                console.log('.ui-admin1-name-catchment-radius ' + val);
                updateGeoNameRecordAnalyisSettings(val, null);
                $.publish(_oEvents.onAnalysisShowDemandForcastResultsDetail, { refreshTableDataOnly: true });
            }
        });

        $('.ui-admin1-name-catchment-coverage').combobox({
            selected: function (event, ui) {
                var val = ui.item.value;
                console.log('ui-admin1-name-catchment-coverage ' + val);
                updateGeoNameRecordAnalyisSettings(null, val);
                $.publish(_oEvents.onAnalysisShowDemandForcastResultsDetail, { refreshTableDataOnly: true });
            }
        });

        $.publish(_oEvents.onAnalysisShowDemandForcastResultsDetailData, {});
        
    }

});

// move to utils at a later date 
function updateGeoNameRecordAnalyisSettings(catachmentSize, percentcoverage) {
    $(oViewModel.oGeoNames).each(function (i, record) {
        if (record['GeoNameId'] == oViewModel['oCountryProfile'].iSelectedAdmin1GeoNameId) {
            if (catachmentSize) {
                record['SelectedDemandForcastCatachmentSize'] = parseFloat(catachmentSize);
            }
            if (percentcoverage) {
                record['SelectedDemandForcastCoveragePercent'] = parseFloat(percentcoverage);
            }
            return;
        }
    });
}

function getGeoNameCurrentRecordById() {
    var record = null;
    $(oViewModel.oGeoNames).each(function (i, value) {
        if (value['GeoNameId'] == oViewModel['oCountryProfile'].iSelectedAdmin1GeoNameId) {
            record = value;
            return;
        }
    });
    return record;
}

function getDemandForcastRecordByRadius(records, radius) {
    var record = null;
    $(records).each(function (i, value) {
        if (parseInt(value['Radius']) == parseInt(radius)) {
            record = value;
        }
    });
    return record;
}


 