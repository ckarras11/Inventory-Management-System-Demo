// Initialized in inventory.html onload
function getVehicles(callbackfn) {
    $.ajax({
        method: 'GET',
        url: '/api/vehicle',
        success: (data) => {
            callbackfn(data);
            editVehicle();
            deleteVehicle();
        },
    });
}

// Called initally on inventory.html body load to display all vehicles
function displayVehicle(data) {
    if (data.length === 0 ) {
        $('#results').append('<h2 class="noItems">There are no vehicles, use "Add" to create one</h2>');
    } else {
        for (index in data) {
            renderNewVehicle(data[index]);
        }
    }
}

// Used to render a new vehicle when added
function renderNewVehicle(vehicleData) {
    let vehicleImage;
    if (vehicleData.image === 'truck') {
        vehicleImage = 'https://www.knapheide.com/files/source/knapheide/products/Service-Bodies/Crane-Bodies/6108DLR-38J-Crane-Body-Ram-4500.png';
    } else if (vehicleData.image === 'van') {
        vehicleImage = 'http://st.motortrend.com/uploads/sites/10/2016/10/2017-ram-promaster-2500-high-roof-cargo-van-angular-front.png?interpolation=lanczos-none&fit=around|300:199';
    } else {
        vehicleImage = 'http://wfarm3.dataknet.com/static/resources/icons/set31/b4c44600.png';
    }

    $('#results').append(`<div class="item vehicle" id="${vehicleData.id}">
                            <div class="deleteVehicle">
                                <span class="delete">&times;</span>
                            </div>
                            <div class="picture">
                                <img src="${vehicleImage}">
                            </div>  
                            <div class="name-container">
                                <p>${vehicleData.vehicleName}</p>
                                <span class="edit" data-vehicle="${vehicleData.vehicleName}">&#9998;</span>
                            </div>
                        </div>`);
}

// Selects which vehicle to get inventory on
function selectVehicle() {
    $('#results').on('click', '.vehicle', function () {
        $('.vehicle').addClass('js-hide-display');
        $('#add-item').removeClass('js-hide-display');
        $('#add-vehicle').addClass('js-hide-display');
        $('#item-form #vehicle_id').val($(this).find('p')[0].innerHTML);
        getAndDisplayInventoryItems($(this).find('p')[0].innerHTML);
    });
}

// Handles adding a vehicle and displaying the modal
function addVehicle() {
    $('#add-vehicle').click(() => {
        $('#vehicle-form h2').text('Add Vehicle');
        showVehicleModal();
        isVehicle = true;
        $('#vehicle-form #vehicle-input').val('');
    });
    $('#vehicle-form').submit(formSubmitHandler);

    $('#vehicle-close').click(() => {
        hideVehicleModal();
    });
}
// Deletes Vehicle
function deleteVehicle() {
     $('#results').off('click', '.delete').on('click', '.delete', function (e) {
        e.stopPropagation();
        let currentVehicleId = this.parentNode.parentNode.getAttribute('id');
        if (confirm('Are you sure you want to delete this item?') === true) {
            $.ajax({
                method: 'DELETE',
                url: `/api/vehicle/${currentVehicleId}`,
                success: () => {
                    $(`#${currentVehicleId}`).remove();
                    currentVehicleId = '';
                    removeVehicleAlert();
                },
            });
        }
    });
}

function editVehicle() {
    let currentVehicleId = '';
    // Handles Edit Button
    $('#results').on('click', '.edit', function (e) {
        e.stopPropagation();
        showEditVehicleModal();
        const currentVehicle = $(e.currentTarget).data('vehicle');
        currentVehicleId = this.parentNode.parentNode.getAttribute('id');
        const vehicleModal = $('#addNewVehicle-modal')[0].innerHTML;
        $('#editVehicle-modal').html(vehicleModal);
        $('#vehicle-form h2').text('Edit Vehicle');
        $('#vehicle-form #vehicle-input').val(currentVehicle);
    });
    // Click handler for submit button on form
    $('#editVehicle-modal').off().on('submit', '#vehicle-form', (e) => {
        editSubmitHandler(e, currentVehicleId);
    });
    // Closes edit vehicle modal
    $('#editVehicle-modal').on('click', '#vehicle-close', () => {
        hideEditVehicleModal();
        currentVehicleId = '';
    });
}

function editSubmitHandler(e, currentVehicleId) {
    e.preventDefault();
    const updatedVehicle = {
        id: currentVehicleId,
        image: $(event.target).find('#vehicle-image').val(),
        vehicleName: $(event.target).find('#vehicle-input').val(),
    };
    $.ajax({
        url: `api/vehicle/${currentVehicleId}`,
        method: 'PUT',
        data: updatedVehicle,
        success: () => {
            hideEditVehicleModal();
            $('.vehicle').remove();
            getVehicles(displayVehicle);
            editVehicleAlert();
        },
        error: (error) => {
            if (error.responseJSON.length && error.responseJSON[0].msg) {
                $('#editVehicle-modal').find('#vehicle-form').prepend(`<div class="alert alert-danger">${error.responseJSON[0].msg}</div>`);
                setTimeout(function () { $('.alert').addClass('js-hide-display'); }, 5000);
            }
        },
    });
}
