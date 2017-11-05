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

// Handles adding an item and displaying the modal
function addItem() {
    $('#add-item').click(() => {
        showItemModal();
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
                renderItemModal(data);
                editItem(data);
                deleteItem(data);
            },
        });
    });
}
// Displays item modal with all the information from the DB
function renderItemModal(data) {
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
                                        <button id="deleteButton" class="button">DELETE</button>
                                        <button id="editButton" class="button">EDIT</button>
                                    </div>

                                </div>`);
    showEditItemModal();
    $('#editItem-modal').on('click', '#editItem-close', function () {
        hideEditItemModal();
        $('#editItem-modal').empty();
    });
}


function deleteItem(data) {
    $('#editItem-modal').off('click', '#deleteButton').on('click', '#deleteButton', function () {
        if (confirm('Are you sure you want to delete this item?') === true) {
            $.ajax({
                method: 'DELETE',
                url: `/api/inventory/${data.id}`,
                success: () => {
                    $(`#${data.id}`).remove();
                    modal.style.display = 'none';
                    removeItemAlert();
                },
            });
        } else {
            hideEditItemModal();
        }
    });
}
function editItem(data) {
    const currentItemId = data.id;
    const vehicle = data.vehicle_id;

    $('#editItem-modal').off('click', '#editButton').on('click', '#editButton', function () {
        $('.item-modal').hide();
        const itemForm = $('#item-form')[0].outerHTML;
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
        const updatedItem = {
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
                hideEditItemModal();
                $('.jsEdit').remove();
                getAndDisplayInventoryItems(vehicle);
                editItemAlert();
            },
        });
    });
}
