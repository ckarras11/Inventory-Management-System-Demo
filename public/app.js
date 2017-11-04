let isVehicle = true;

// Gets all inventory item from the database
function getInventoryItems(callbackfn, vehicle) {
    $.ajax({
        method: 'GET',
        url: '/api/inventory',
        success: (data) => {
            callbackfn(data, vehicle);
            selectItem();
        },
    });
}

// Displays inventory for chosen vehicle
function displayInventoryItems(data, vehicle) {
    const inventory = [];
    for (index in data) {
        if (data[index].vehicle_id === vehicle) {
            inventory.push(data[index]);
        }
    }
    if (inventory.length === 0) {
        // alert('ohhh nooo');
        $('#results').append('<h2 class="noItems">No items for current vehicle, use "add item" to create one</h2>');
    } else {
        inventory.forEach((item) => {
            renderNewItem(item);
        });
    }
}

// Gets inventory items and displays inventory for a specific vehicle
function getAndDisplayInventoryItems(vehicle) {
    getInventoryItems(displayInventoryItems, vehicle);
}

// Used to render a new item when added
function renderNewItem(itemData) {
    /*     <div class="picture">
                <img src="" alt="">
            </div> */
/*             <div class="iteminfo">
            <p> ${itemData.vehicle_id} </p>
        </div>  */
    $('#results').append(`<div class="item jsEdit" id="${itemData.id}">
                            <div class="iteminfo">
                                <p class="name">${itemData.item}</p>
                            </div>
                            <div class="iteminfo">
                                <p class="price">$${itemData.listPrice}</p>
                            </div>
                            <div class="iteminfo">
                                <p class="quantity">Quantity: ${itemData.quantityOnHand}</p>
                            </div> 
                        </div>`);
}

// Initialized in inventory.html onload
function getVehicles(callbackfn) {
    $.ajax({
        method: 'GET',
        url: '/api/vehicle',
        success: (data) => {
            callbackfn(data);
            editVehicle();
        },
    });
}

// Called initally on inventory.html body load to display all vehicles
function displayVehicle(data) {
    for (index in data) {
        renderNewVehicle(data[index]);
    }
}

// Used to render a new vehicle when added
function renderNewVehicle(vehicleData) {
    let vehicleImage
    if (vehicleData.image === 'truck') {
        vehicleImage = './images/truck_icon.png';
    } else if (vehicleData.image === 'van') {
        vehicleImage = './images/van_icon.png';
    } else {
        vehicleImage = './images/building_icon.png';
    }

 
    $('#results').append(`<div class="item vehicle" id="${vehicleData.id}">
                            <div class="picture">
                                <img src="${vehicleImage}">
                            </div>  
                            <p>${vehicleData.vehicleName}</p>
                            <div class="edit-vehicle">
                                <span class="delete">&times;</span>
                                <span class="edit" data-vehicle="${vehicleData.vehicleName}">&#9998;</span>
                            </div>
                        </div>`);
}

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

function itemErrorAlert() {
    $('#item-form').prepend(`<div class="alert alert-danger">test</div>`);
    // setTimeout(function () { $('.alert').addClass('js-hide-display'); }, 2000);
}

// Submit handler for add item/vehicle form modal
function formSubmitHandler(e) {
    e.preventDefault();
    const form = $(this);
    const formData = new FormData(this);
    console.log(formData);

    const keys = Array.from(formData.keys());
    const data = keys.map(key => `${key}=${encodeURIComponent(formData.get(key))}`).join('&');

    if (isVehicle) {
        $.ajax({
            method: 'POST',
            url: '/api/vehicle',
            data,
            success: (data) => {
                console.log(data);
                hideVehicleModal();
                renderNewVehicle(data);
                addVehicleAlert();
            },
            error: (error) => {
                if (error.responseText) {
                    vehicleErrorAlert(error.responseText);
                }
            },
        });
    } else {
        $.ajax({
            method: 'POST',
            url: '/api/inventory',
            data,
            success: (data) => {
                $('.noItems').addClass('js-hide-display');
                hideItemModal();
                renderNewItem(data);
                isVehicle = true;
                addItemAlert();
            },
        });
    }
}

// Selects which vehicle to get inventory on
// Pass param for vehicle_id for get request????
function selectVehicle() {
    $('#results').on('click', '.vehicle', function () {
        $('.vehicle').addClass('js-hide-display');
        $('#add-item').removeClass('js-hide-display');
        $('#add-vehicle').addClass('js-hide-display');
        getAndDisplayInventoryItems($(this).find('p')[0].innerHTML);
    });
}

// Gets all items below reorder point and displays them as a <ul>
function reorderReport(data) {
    const itemsToReorder = [];
    for (index in data) {
        if (data[index].quantityOnHand < data[index].reorderPoint) {
            itemsToReorder.push(data[index]);
            // $('#reorder-list').append(`<li>${data[index].item} Quantity: ${data[index].quantityOnHand}, Reorder Point: ${data[index].reorderPoint}</li>`);
        }
    }
    itemsToReorder.sort(sortItem);
    if (itemsToReorder.length === 0) {
        $('#reorder-list').append('<div class="alert alert-info">No Items Below Reorder Point</div>');
    } else {
        itemsToReorder.forEach(item => $('#reorder-list').append(`<li>${item.item} Quantity: ${item.quantityOnHand}, Reorder Point: ${item.reorderPoint} (${item.vehicle_id})</li>`));
    }
}

// Sorts items for reorderReport
function sortItem(a, b) {
    const itemA = a.item.toLowerCase();
    const itemB = b.item.toLowerCase();

    let comparison = 0;
    if (itemA > itemB) {
        comparison = 1;
    }
    else if (itemA < itemB) {
        comparison = -1;
    }
    return comparison;
}

// Event handler for report selection
function runReport() {
    $('#reorder').click(() => {
        $('.report').addClass('js-hide-display');
        getInventoryItems(reorderReport);
    });
}

// Hides vehicle modal on form submit or exit
function hideVehicleModal() {
    let modal = document.getElementById('addNewVehicle-modal');
    modal.style.display = 'none';
}

// Hides item modal on form submit or exit
function hideItemModal() {
    let modal = document.getElementById('addNewItem-modal');
    modal.style.display = 'none';
}

function hideEditVehicleModal() {
    let modal = document.getElementById('editVehicle-modal');
    modal.style.display = 'none';
}
// Handles adding a vehicle and displaying the modal
function addVehicle() {
    $('#add-vehicle').click(() => {
        $('#vehicle-form h2').text('Add Vehicle');
        let modal = document.getElementById('addNewVehicle-modal');
        modal.style.display = 'block';
        isVehicle = true;
        $('#vehicle-form #vehicle-input').val('');
    });
    $('#vehicle-form').submit(formSubmitHandler);

    $('#vehicle-close').click(() => {
        hideVehicleModal();
    });
}

// Handles adding an item and displaying the modal
function addItem() {
    $('#add-item').click(() => {
        let modal = document.getElementById('addNewItem-modal');
        modal.style.display = 'block';
        isVehicle = false;
    });
    $('#item-form').submit(formSubmitHandler);
    $('#item-close').click(() => {
        hideItemModal();
    });
}

// Click handler for selecting an inventory item, sends GET request for id
function selectItem() {
    let currentItemId = '';
    $('#results').on('click', '.jsEdit', function () {
        currentItemId = $(this).attr('id');
        $.ajax({
            method: 'GET',
            url: `/api/inventory/${currentItemId}`,
            success: (data) => {
                editItem(data);
            },
        });
    });
}
function editVehicle() {
    let currentVehicleId = '';
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
    $('#results').on('click', '.edit', function (e) {
        e.stopPropagation();
        const currentVehicle = $(e.currentTarget).data('vehicle');
        console.log(currentVehicle);
        currentVehicleId = this.parentNode.parentNode.getAttribute('id');
        let modal = document.getElementById('editVehicle-modal');
        let vehicleModal = $('#addNewVehicle-modal')[0].innerHTML;
        modal.style.display = 'block';
        $('#editVehicle-modal').html(vehicleModal);
        $('#vehicle-form h2').text('Edit Vehicle');
        $('#vehicle-form #vehicle-input').val(currentVehicle);
    });


    $('#editVehicle-modal').off().on('submit', '#vehicle-form', (e) => {
        e.preventDefault();
        let updatedVehicle = {
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
                currentVehicleId = '';
                editVehicleAlert();
            },
            error: (error) => {
                if (error.responseJSON.length && error.responseJSON[0].msg) {
                    $('#editVehicle-modal').find('#vehicle-form').prepend(`<div class="alert alert-danger">${error.responseJSON[0].msg}</div>`);
                    setTimeout(function () { $('.alert').addClass('js-hide-display'); }, 5000);
                }
                
            },
        });
    });


    $('#editVehicle-modal').on('click', '#vehicle-close', () => {
        hideEditVehicleModal();
        currentVehicleId = '';
    });
}

function editItem(data) {
    let modal = document.getElementById('editItem-modal');
    let currentItemId = data.id;
    let vehicle = data.vehicle_id;
    $('#editItem-modal').html(`
                            <div class="modal-content width-50">
                                <span class="close" id="editItem-close">&times;</span>
                                <div id="modal-form-container"></div>
                                <div class="item-modal">
                                    <h2>${data.item}</h2>
                                    <div class="iteminfo">
                                        <h3>Part Number:</h3>
                                        <p>${data.partNumber}</p>
                                    </div>
                                    <div class="iteminfo">
                                        <h3>List Price:</h3>
                                        <p>$${data.listPrice}</p>
                                    </div>
                                    <div class="iteminfo">
                                        <h3>Quantity on Hand:</h3>
                                        <p>${data.quantityOnHand}</p>
                                    </div>
                                    <div class="iteminfo">
                                        <h3>Minimum Amount:</h3>
                                        <p>${data.reorderPoint}</p>
                                    </div>
                                    <div class="iteminfo">
                                        <h3>Vehicle Id</h3>
                                        <p>${data.vehicle_id}</p>
                                    </div>
                                    <button id="deleteButton">DELETE</button>
                                    <button id="editButton">EDIT</button>
                                </div>

                            </div>`);
    modal.style.display = 'block';

    $('#editItem-modal').off('click', '#deleteButton').on('click', '#deleteButton', function () {
        if (confirm('Are you sure you want to delete this item?') === true) {
            $.ajax({
                method: 'DELETE',
                url: `/api/inventory/${currentItemId}`,
                success: () => {
                    $(`#${currentItemId}`).remove();
                    modal.style.display = 'none';
                    currentItemId = '';
                    removeItemAlert()
                    
                },
            });
        }
        else {
            modal.style.display = 'none';
        }
    });
    $('#editItem-modal').off('click', '#editButton').on('click', '#editButton', function () {
        $('.item-modal').hide();
        let itemForm = $('#item-form')[0].outerHTML;
        $('#modal-form-container').append(itemForm);
        $('#modal-form-container #item-form h2').text('Edit Item');
        $('#modal-form-container #item-input').val(`${data.item}`);
        $('#modal-form-container #partnumber-input').val(`${data.partNumber}`);
        $('#modal-form-container #price-input').val(`${data.listPrice}`);
        $('#modal-form-container #quantity-input').val(`${data.quantityOnHand}`);
        $('#modal-form-container #reorder-input').val(`${data.reorderPoint}`);
        $('#modal-form-container #vehicle_id').val(`${data.vehicle_id}`);
    });

    $('#modal-form-container').on('submit', '#item-form', (e) => {
        e.preventDefault();
        let updatedItem = {
            id: currentItemId,
            image: $(event.target).find('#item-image').val(),
            item: $(event.target).find('#item-input').val(),
            partNumber: $(event.target).find('#partnumber-input').val(),
            listPrice: $(event.target).find('#price-input').val(),
            quantityOnHand: $(event.target).find('#quantity-input').val(),
            reorderPoint: $(event.target).find('#reorder-input').val(),
            vehicle_id: $(event.target).find('#vehicle_id').val(),
        };

        $.ajax({
            method: 'PUT',
            url: `/api/inventory/${currentItemId}`,
            data: updatedItem,
            success: () => {
                modal.style.display = 'none';
                $('.jsEdit').remove();
                getAndDisplayInventoryItems(vehicle);
                editItemAlert()
            },
        });
    });

    $('#editItem-modal').on('click', '#editItem-close', function () {
        modal.style.display = 'none';
        $('#editItem-modal').empty();
    });
}

$((document) => {
    selectVehicle();
    runReport();
    addItem();
    addVehicle();
});
