// Vehicle Alerts
function addVehicleAlert() {
    $('.title').append('<div class="alert alert-success">Vehicle Added Succesfully</div>');
    setTimeout(function () { $('.alert').addClass('js-hide-display'); }, 2000);
}

function removeVehicleAlert() {
    $('.title').append('<div class="alert alert-info">Vehicle Removed Succesfully</div>');
    setTimeout(function () { $('.alert').addClass('js-hide-display'); }, 2000);
}

function editVehicleAlert() {
    $('.title').append('<div class="alert alert-info">Vehicle Updated</div>');
    setTimeout(function () { $('.alert').addClass('js-hide-display'); }, 2000);
}

function vehicleErrorAlert(message) {
    $('#vehicle-form').prepend(`<div class="alert alert-danger">${message}</div>`);
    setTimeout(function () { $('.alert').addClass('js-hide-display'); }, 5000);
}

// Item Alerts
function addItemAlert() {
    $('.title').append('<div class="alert alert-success">Item Added Succesfully</div>');
    setTimeout(function () { $('.alert').addClass('js-hide-display'); }, 2000);
}

function removeItemAlert() {
    $('.title').append('<div class="alert alert-info">Item Removed Succesfully</div>');
    setTimeout(function () { $('.alert').addClass('js-hide-display'); }, 2000);
}

function editItemAlert() {
    $('.title').append('<div class="alert alert-info">Item Updated</div>');
    setTimeout(function () { $('.alert').addClass('js-hide-display'); }, 2000);
}
