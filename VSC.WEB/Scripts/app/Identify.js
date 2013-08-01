
$.subscribe(_oEvents.onIdentifyTaskActivate, function (topic, data) {
    console.log('oEvents.onIdentifyTaskActivate' + data.action);

    if (oViewModel['oIdentifyTaskListener']) {
        dojo.disconnect(oViewModel['oIdentifyTaskListener']);
    }

    oViewModel.oMapView.infoWindow.hide();

    if (data.action) {
        oViewModel['oIdentifyTaskListener'] = dojo.connect(oViewModel.oMapView, 'onClick', function (evt) {
            $.publish(_oEvents.onIdentifyTaskExecute, {
                geometry: evt.mapPoint,
                screen: evt.screenPoint,
                event: evt

            });
        });

    }
});


$.subscribe(_oEvents.onIdentifyTaskExecute, function (topic, data) {
    //create identify tasks and setup parameters 
    console.log('_oEvents.onIdentifyTaskExecute');
    var identifyTask = null;

    if (data.geometry && oViewModel['oCountryProfile'].oSummary.MapServiceURL) {

        identifyTask = new esri.tasks.IdentifyTask(oViewModel['oCountryProfile'].oSummary.MapServiceURL);
        identifyParams = new esri.tasks.IdentifyParameters();
        identifyParams.tolerance = oViewModel['iTolerance'];
        identifyParams.returnGeometry = true;
        identifyParams.layerIds = oViewModel['aQueryLayerIds'];
        identifyParams.layerOption = esri.tasks.IdentifyParameters.LAYER_OPTION_VISIBLE;
        identifyParams.width = oViewModel.oMapView.width;
        identifyParams.height = oViewModel.oMapView.height;
        identifyParams.geometry = data.geometry;
        identifyParams.mapExtent = oViewModel.oMapView.extent;


        identifyTask.execute(identifyParams, function (identifyResults) {

            $.publish(_oEvents.onIdentifyTaskExecuteComplete, {
                geometry: data.geometry,
                screen: data.screen,
                results: identifyResults
            });

        });

    }
});


$.subscribe(_oEvents.onIdentifyTaskExecuteComplete, function (topic, data) {
    console.log('_oEvents.onIdentifyTaskExecuteComplete');
    // console.log(data);

    var features = [];
    var feature = null;
    var template = null;

    var fixedImmunizationLocationTemplate = '<div><strong>Name:</strong>  ${NAME} <br/>  ';
    fixedImmunizationLocationTemplate += '<strong>Function:</strong>  ${FUNCTION} <br/> ';
    fixedImmunizationLocationTemplate += '<strong>Category: </strong> ${CATEGORY} <br/> ';
    fixedImmunizationLocationTemplate += '<strong>Cold Storage: </strong>  ${Cold_Storage_Spec} <br/> ';
    fixedImmunizationLocationTemplate += '<strong>Refrig_Space :</strong> ${Refrig_Space} <br/> ';
    fixedImmunizationLocationTemplate += '<strong> Source : </strong> ${layerName} <br/>';
    fixedImmunizationLocationTemplate += '<a href="http://vsolvit.com/downloads/SIGMA_Fixed_Immunization_Locations.pdf"  target="_blank" class="action">Fixed Immunization Location Data</a><br/></div>';
 
    var administrativeBoundaryTemplate = '<strong>Name: </strong> ${Name} <br/>';
    administrativeBoundaryTemplate += '<strong>Total Population: </strong> ${Total_Pop} <br/>  ';
    administrativeBoundaryTemplate += '<strong>Source : </strong> ${layerName} <br/> ';
    administrativeBoundaryTemplate += '<a href="http://vsolvit.com/downloads/Niger_Vaccine_Demand_by_Administrative_Boundaries.pdf"  target="_blank" class="action">Vaccine Demand by Administrative Boundary</a><br/></div>'
 

    $(data.results).each(function (i, record) {

        // record.displayFieldName; // title 

        feature = record.feature;
        feature.attributes.layerName = record.layerName;
        feature.attributes.layerId = parseInt(record.layerId);

        switch (feature.attributes.layerId) {
            case 1:
                console.log(feature.attributes.layerName);
                template = new esri.InfoTemplate(feature.attributes.layerName, fixedImmunizationLocationTemplate);
                feature.setInfoTemplate(template);
                break;
            case 4:
            case 5:
                console.log(feature.attributes.layerName);
                template = new esri.InfoTemplate(feature.attributes.layerName, administrativeBoundaryTemplate);
                feature.setInfoTemplate(template);
                break;
            default:

        }

        features.push(feature);
        console.log('push feature done');
    });


    oViewModel.oMapView.infoWindow.setFeatures(features);
    console.log('set feaqtures done ');

    oViewModel.oMapView.infoWindow.show(data.geometry);
    console.log('show popup done');
});


