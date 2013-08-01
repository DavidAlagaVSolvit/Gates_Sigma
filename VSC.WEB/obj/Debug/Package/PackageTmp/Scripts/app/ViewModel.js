// demo code only.
// for toc http://23.23.225.115/ArcGIS/rest/services/Gates/Kenya/MapServer/layers
//         http://23.23.225.115/ArcGIS/rest/services/Gates/GatesData/MapServer/layers

jQuery.support.cors = true;

// place holder for ui control classs ids 
var oUI = oUI || {};

// curret client view state 
var oViewModel = oViewModel || {};
oViewModel['sCurrentWizardStepId'] = 'uiWizardStep0';
oViewModel['oCurretWizardStepElement'] = null;
oViewModel['aNoMapViewWizardStepIds'] = ['uiWizardStep0'];

oViewModel['sLoadingMessage'] = 'Loading update. Please wait...';
oViewModel['sApiURI'] = _oApp.fnGetAbsolutePath();
oViewModel['sCountrytListAction'] = 'api/country/profiles';
//oViewModel['sFindCountryAction'] = 'api/country/profiles';
//oViewModel['sFindCountryByLocationAction'] = 'api/country/profiles';
oViewModel['dExtentOffset'] = 0.50;

oViewModel['oFullGeographicExtent'] = {
    dNorth: 45.00,
    dSouth: -45.00,
    dEast: 95.00,
    dWest: -95.00
};

oViewModel['oCurrentMapViewExtent'] = null;

oViewModel['sBaseMapServiceName'] = 'osm';//'streets';// 'hybrid';//'osm';

oViewModel['bSpatialSelectActivated'] = true;

oViewModel['oTableOptions'] = {
    sDom: 'T<"clear">lfrtip',
    //oTableTools: {
    //    //aButtons: ['csv' ],
    //    sSwfPath: '../../swf/copy_csv_xls_pdf.swf' 
    //},
    bDestroy: true,
    bLengthChange: false,
    bPaginate: false,
    bFilter: false,
    bSort: false,
    bInfo: false,
    bAutoWidth: true,
    bDestroy: true,
    bSearchable: false,
    oLanguage: {
        sEmptyTable: 'No records exist for your selected country. '
    }
};

oViewModel['oCountryProfile'] = {
    sDate: null,
    sOpsMapLayerId: null,
    iSelectedAdmin1GeoNameId: null,
    oSummary: {},
    oGeoNames: {},
};


oViewModel['aRowValuePrefix'] = ['TotalPopulation', 'PopulationCoveredInCatachment', 'PopuationNotCoveredInCatchment', 'PopulationOutsideOfCatachment'];
oViewModel['aAdjustableRowValuesPrefix']=['PopulationCoveredInCatachment', 'PopuationNotCoveredInCatchment']
oViewModel['TableRowDefs'] = [
        {
            label: 'Popuation',
            field: ''  //  leave blank
        },
         {
             label: 'Age 0-11 months',
             field: 'Infant'
         },
         {
             label: 'Population Under Age 5',
             field: 'Under5'
         },
         {
             label: 'School Age Childern (ages 5-14)',
             field: 'SchoolAge'
         },
         {
             label: 'Female Population',
             field: 'Female'
         },
         {
             label: 'Births',
             field: 'Births'
         },
         {
             label: 'Birthing Population (ages 15-49)',
             field: 'Birthing'
         },
         {
             label: 'Pregnant Women',
             field: 'Pregnant'
         }
];

oViewModel['oTables'] = {
    oDemographicSummaryTable: null,
    oVaccineScheduleTable: null,
    oPopulationCoverageTable: null,
    oAdmin1PopulationCoverageTable: null
}

oViewModel['oGeometryService'] = null;
oViewModel['oMapView'] = null;
oViewModel['sMapViewElementId'] = 'uiMapView';
oViewModel['oInitialExtent'] = null;
oViewModel['oDrawingToolbar'] = null;

oViewModel['oDrawingToolbarOptions'] = {
    drawTime: 75,
    showTooltips: false,
    tolerance: 8,
    tooltipOffset: 15
}


oViewModel['oDrawingCompleteListener'] = null;


oViewModel['oEditToolbar'] = null;
oViewModel['oEditMapViewListener'] = null;
oViewModel['oSelectedFeature'] = null;
oViewModel['bIsEditing'] = false;
oViewModel['oShapeEditingFeatureLayer'] = null;
oViewModel['oShapeEditingFeatureLayerId'] = 'DemoShapeEditorFeatureLayer';

oViewModel['oFixedImmunizationLocationFeatureCollection'] = {
    layerDefinition: {
        "geometryType": "esriGeometryPoint",
        "fields": [{}]
    },
    featureSet: null
}

oViewModel['oMapContextMenu'] = null;


oViewModel['oIdentifyTaskListener'] = null;
oViewModel['aQueryLayerIds'] = [1,4];
oViewModel['iTolerance'] = 3;


