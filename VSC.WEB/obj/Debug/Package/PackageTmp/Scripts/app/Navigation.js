$.subscribe(_oEvents.onNavigationMapViewActivated, function (topic, data) {
    if (data.action && oViewModel['oMapView']) { // turn on 
        oViewModel['oMapView'].reposition();
        oViewModel['oMapView'].showZoomSlider();
        oViewModel['oMapView'].enableMapNavigation();
        oViewModel['oMapView'].enableKeyboardNavigation();
        oViewModel['oMapView'].enablePan();
        oViewModel['oMapView'].enableRubberBandZoom();
        oViewModel['oMapView'].enableScrollWheelZoom();
        oViewModel['oMapView'].enableDoubleClickZoom();
        oViewModel['oMapView'].enableClickRecenter();
    }
    else if (oViewModel['oMapView']) { // turn off 
        oViewModel['oMapView'].disableMapNavigation();
        oViewModel['oMapView'].disableKeyboardNavigation();
        oViewModel['oMapView'].disablePan();
        oViewModel['oMapView'].disableRubberBandZoom();
        oViewModel['oMapView'].disableScrollWheelZoom();
        oViewModel['oMapView'].disableDoubleClickZoom();
        oViewModel['oMapView'].disableClickRecenter();
        oViewModel['oMapView'].hideZoomSlider();
    }
});

$.subscribe(_oEvents.onNavigationWizardActivated, function (topic, data) {
    console.log('_oEvents.onNavigationWizardActivated');
    //// update to add/remove event handlers
    //if (data.action) {
    //    // attach click handlers to the nav buttons
    //    $("#wizard-prev").click(function () { PrevStep(); });
    //    $("#wizard-next").click(function () { NextStep(); });
    //    $("#wizard-submit").click(function () { Submit(); });

    //    // display the first step (or the confirmation if returned from server with errors)
    //    DisplayStep();
    //}
});

$.subscribe(_oEvents.onNavigationWizardStepActionComplete, function (topic, data) {
    console.log('_oEvents.onNavigationWizardStepActionComplete');
    if (oViewModel) {
        oViewModel['sCurrentWizardStepId'] = $(".wizard-step:visible").attr('id');

        if ($.inArray(oViewModel['sCurrentWizardStepId'], oViewModel['aNoMapViewWizardStepIds']) === -1) {
            console.log('_oEvents.onNavigationWizardStepActionComplete: show map ');
            $('#' + oViewModel['sMapViewElementId']).show({
                complete: function () {
                    console.log('show map complete');
        
                    if (oViewModel['oCurrentMapViewExtent']) {
                        console.log('setting map view to  oCurrentMapViewExtent');
                        console.log(esri.geometry.webMercatorToGeographic(oViewModel['oCurrentMapViewExtent']));
                        oViewModel.oMapView.setExtent(oViewModel['oCurrentMapViewExtent'], true);
                    }
                    else {
                        $.publish(_oEvents.onCountryNameChange, {
                            text: '',
                            value: -1
                        });
                    }
                    //else {
                    //    console.log('setting map view to   default');
                    //    $.publish(_oEvents.onMapViewUpdateExtent, {
                    //        north: oViewModel['oFullGeographicExtent'].dNorth,
                    //        south: oViewModel['oFullGeographicExtent'].dSouth,
                    //        east: oViewModel['oFullGeographicExtent'].dEast,
                    //        west: oViewModel['oFullGeographicExtent'].dWest
                    //    });
                    //}

                  $.publish(_oEvents.onMapViewReposition);
                }
            }
            );
            $('.ui-info-messge').show();


 
        }
        else {
            console.log('_oEvents.onNavigationWizardStepActionComplete: hide map ');
            $('#' + oViewModel['sMapViewElementId']).hide();
            $('.ui-info-messge').hide();
        }

    }
});

$.subscribe(_oEvents.onNavigationWizardDisplayStep, function (topic, data) {
    console.log('Navigation: onNavigationWizardDisplayStep');
    var selectedStep = null;
    var firstInputError = $("input.input-validation-error:first"); // check for any invalid input fields
    if (firstInputError.length) {
        selectedStep = $(".wizard-confirmation");
        if (selectedStep && selectedStep.length) { // the confirmation step should be initialized and selected if it exists
            // UpdateConfirmation();
        }
        else {
            selectedStep = firstInputError.closest(".wizard-step"); // the first step with invalid fields should be displayed
        }
    }
    if (!selectedStep || !selectedStep.length) {
        selectedStep = $(".wizard-step:first"); // display first step if no step has invalid fields
    }

    $(".wizard-step:visible").hide(); // hide the step that currently is visible
    selectedStep.fadeIn(); // fade in the step that should become visible

    // enable/disable the prev/next/submit buttons
    if (selectedStep.prev().hasClass("wizard-step")) {
        $("#wizard-prev").show();
    }
    else {
        $("#wizard-prev").hide();
    }
    if (selectedStep.next().hasClass("wizard-step")) {
        $("#wizard-submit").hide();
        $("#wizard-next").show();
    }
    else {
        $("#wizard-next").hide();
        $("#wizard-submit").show();
    }

    $.publish(_oEvents.onNavigationWizardStepActionComplete);


});

$.subscribe(_oEvents.onNavigationWizardPreviousStep, function (topic, data) {
    console.log('Navigation: onNavigationWizardPreviousStep');
    oViewModel['oCurretWizardStepElement'] = $(".wizard-step:visible"); // get current step

    if (oViewModel['oCurretWizardStepElement'].prev().hasClass("wizard-step")) { // is there a previous step?

        oViewModel['oCurretWizardStepElement'].hide().prev().fadeIn();  // hide current step and display previous step

        $("#wizard-submit").hide(); // disable wizard-submit button
        $("#wizard-next").show(); // enable wizard-next button

        if (!oViewModel['oCurretWizardStepElement'].prev().prev().hasClass("wizard-step")) { // disable wizard-prev button?
            $("#wizard-prev").hide();
        }
    }

    $.publish(_oEvents.onNavigationWizardStepActionComplete);

});

$.subscribe(_oEvents.onNavigationWizardNextStep, function (topic, data) {
    console.log('Navigation: onNavigationWizardNextStep');

    oViewModel['oCurretWizardStepElement'] = $(".wizard-step:visible"); // get current step

    if (oViewModel['oCurretWizardStepElement'].next().hasClass("wizard-step")) { // is there a next step?

        oViewModel['oCurretWizardStepElement'].hide().next().fadeIn();  // hide current step and display next step

        $("#wizard-prev").show(); // enable wizard-prev button

        if (!oViewModel['oCurretWizardStepElement'].next().next().hasClass("wizard-step")) { // disable wizard-next button and enable wizard-submit?
            $("#wizard-next").hide();
            $("#wizard-submit").show();
        }
    }
    $.publish(_oEvents.onNavigationWizardStepActionComplete);
});

$(document).ready(function () {
    $("#wizard-prev").click(function () { $.publish(_oEvents.onNavigationWizardPreviousStep, {}); });
    $("#wizard-next").click(function () { $.publish(_oEvents.onNavigationWizardNextStep, {}); });
    $.publish(_oEvents.onNavigationWizardDisplayStep, {});
});