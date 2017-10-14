let isVehicle = true;

// Gets all inventory item from the database
function getInventoryItems(callbackfn, vehicle) {
    $.ajax({
        method: 'GET',
        url: '/api/inventory',
        success: (data) => {
            console.log(data);
            callbackfn(data, vehicle);
            editItem(data);
        },
    });
}

// Initialized in inventory.html onload
function getVehicles(callbackfn) {
    $.ajax({
        method: 'GET',
        url: '/api/vehicle',
        success: (data) => {
            console.log(data);
            callbackfn(data);
        },
    });
}

// Used to render a new vehicle when added
function renderNewVehicle(vehicleData) {
    $('#results').append(`<div class="item vehicle">
                            <p id="${vehicleData.vehicleName}">${vehicleData.vehicleName}</p>
                        </div>`);
}

// Used to render a new item when added
function renderNewItem(itemData) {
    $('#results').append(`<div class="item" id="item">
                            <div class="picture">
                                <img src="" alt="">
                            </div>
                            <div class="iteminfo">
                                <p id="name">${itemData.item}</p>
                            </div>
                            <div class="iteminfo">
                                <p id="price">$${itemData.listPrice}</p>
                            </div> 
                            <div class="iteminfo">
                                <p id="quantity">Quantity: ${itemData.quantityOnHand}</p>
                                <p> ${itemData.vehicle_id} </p>
                            </div> 
                        <div>`);
}

// Submit handler for add item/vehicle form modal
function formSubmitHandler(e) {
    e.preventDefault();
    const form = $(this);
    const url = form.attr('action');
    const formData = new FormData(this);

    const keys = Array.from(formData.keys());
    const data = keys.map(key => `${key}=${encodeURIComponent(formData.get(key))}`).join('&');

    if (isVehicle) {
        $.ajax({
            method: 'POST',
            url,
            data,
            success: (data) => {
                console.log(data);
                hideVehicleModal();
                renderNewVehicle(data);
            },
        });
    }
    else {
        $.ajax({
            method: 'POST',
            url,
            data,
            success: (data) => {
                console.log(data);
                hideItemModal();
                renderNewItem(data);
                isVehicle = true;
            },
        });
    }
}

// Displays inventory for chosen vehicle
function displayInventoryItems(data, vehicle) {
    console.log(vehicle);
    const inventory = [];
    for (index in data) {
        if (data[index].vehicle_id === vehicle) {
            inventory.push(data[index]);
        }
    }
    console.log(inventory.length);
    if (inventory.length === 0) {
        // alert('ohhh nooo');
        $('#results').append('<h2>No items for current vehicle, use "add item" to create one</h2>')
    }
    else {
        inventory.forEach((item) => {
            $('#results').append(`<div class="item" id="item">
                                    <div class="picture">
                                        <img src="" alt="">
                                    </div>
                                    <div class="iteminfo">
                                        <p id="name">${item.item}</p>
                                    </div>
                                    <div class="iteminfo">
                                        <p id="price">$${item.listPrice}</p>
                                    </div> 
                                    <div class="iteminfo">
                                        <p id="quantity">Quantity: ${item.quantityOnHand}</p>
                                        <p> ${item.vehicle_id} </p>
                                    </div> 
                                <div>`);
        });
    }
}

// Called initally on inventory.html body load to display all vehicles
function displayVehicle(data) {
    for (index in data) {
        renderNewVehicle(data[index]);
    }
}

// Gets inventory items and displays inventory for a specific vehicle
function getAndDisplayInventoryItems(vehicle) {
    getInventoryItems(displayInventoryItems, vehicle);
}

// Selects which vehicle to get inventory on
// Pass param for vehicle_id for get request????
function selectVehicle() {
    $('#results').on('click', '.vehicle', function () {
        console.log($(this).find('p').attr('id'));
        $('.vehicle').addClass('js-hide-display');
        $('#add-item').removeClass('js-hide-display');
        $('#add-vehicle').addClass('js-hide-display');
        getAndDisplayInventoryItems($(this).find('p').attr('id'));
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
    console.log(itemsToReorder);
    itemsToReorder.sort(sortItem);
    if (itemsToReorder.length === 0) {
        $('#reorder-list').append('No Items Below Reorder Point');
    }
    else {
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

// Handles adding a vehicle and displaying the modal
function addVehicle() {
    $('#add-vehicle').click(() => {
        let modal = document.getElementById('addNewVehicle-modal');
        modal.style.display = 'block';
        isVehicle = true;
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

function editItem(data) {
    let modal = document.getElementById('editItem-modal');
    $('#results').on('click', '#item', function () {
        console.log(this);
        /*  $('#editItem-modal').append(`
             <div class="modal-content">
                 <span class="close" id="editItem-close">&times;</span>
                 <form action="" method="">
                     <fieldset class="item-form" id="item-form">
                         <legend>Edit Item</legend>
                         <label for="item-image">Image</label>
                         <input type="file" name="item-image" id="item-image">
                         <label for="item-name">Item Name</label>
                         <input type="text" value="${$(this).find('#name')[0].innerHTML}" id="item-input" class="item-input" required>
                         <label for="part-number">Part Number</label>
                         <input type="text" placeholder="SLL-12345" id="partnumber-input" class="item-input" required>
                         <label for="list-price">List Price</label>
                         <input type="number" value="${$(this).find('#price')[0].innerHTML}" id="price-input" class="item-input" required>
                         <label for="quantity">Quantity On Hand</label>
                         <input type="number" value="${$(this).find('#quantity')[0].innerHTML}" id="quantity-input" class="item-input" required>
                         <label for="reorder-point">Minimum Amount</label>
                         <input type="number" placeholder="6" id="reorder-input" class="item-input" required>
                         <input type="submit" value="Submit" id="submit">
                     </fieldset>
                 </form>
             </div>`);
         modal.style.display = "block"; */
    });
    /*   $('#editItem-modal').on('click', '#editItem-close', function () {
          modal.style.display = 'none';
          $('#editItem-modal').empty();
      }); */
}

$((document) => {
    selectVehicle();
    runReport();
    addItem();
    addVehicle();
});
