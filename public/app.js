function getInventoryItems(callbackfn) {
    $.ajax({
        method: 'GET',
        url: '/api/inventory',
        success: (data) => {
            console.log(data);
            callbackfn(data);
        },
    });
}

function getVehicle(callbackfn) {
    $.ajax({
        method: 'GET',
        url: '/api/vehicle',
        success: (data) => {
            console.log(data);
            callbackfn(data);
        },
    });
}
function displayInventoryItems(data) {
    for (index in data) {
        $('#results').append(`<div class="item" id="item">
                                    <div class="picture">
                                        <img src="" alt="">
                                    </div>
                                    <div class="iteminfo">
                                        <p id="name">${data[index].item}</p>
                                    </div>
                                    <div class="iteminfo">
                                        <p id="price">$${data[index].listPrice}</p>
                                    </div> 
                                    <div class="iteminfo">
                                        <p id="quantity">Quantity: ${data[index].quantityOnHand}</p>
                                    </div> 
                                <div>`);
    }
}

function displayVehicle(data) {
    for (index in data) {
        $('#results').append(`<div class="item vehicle">
                                <p>${data[index].vehicleName}</p>
                              </div>`);
    }
}
function getAndDisplayInventoryItems() {
    getInventoryItems(displayInventoryItems);
}

// Selects which vehicle to get inventory on
// Pass param for vehicle_id for get request????
function selectVehicle() {
    $('#results').on('click', '.vehicle', function () {
        console.log(this);
        $('.vehicle').addClass('js-hide-display');
        $('#add-item').removeClass('js-hide-display');
        $('#add-vehicle').addClass('js-hide-display');
        getAndDisplayInventoryItems();
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
    if (itemsToReorder.length === 0) {
        $('#reorder-list').append('No Items Below Reorder Point');
    }
    else {
        itemsToReorder.forEach(item => $('#reorder-list').append(`<li>${item.item} Quantity: ${item.quantityOnHand}, Reorder Point: ${item.reorderPoint}</li>`));
    }
}

// Event handler for report selection
function runReport() {
    $('#reorder').click(() => {
        $('.report').addClass('js-hide-display');
        getInventoryItems(reorderReport);
    });
}

function addVehicle() {
    let modal = document.getElementById('addNewVehicle-modal');

    $('#add-vehicle').click(() => {
        modal.style.display = 'block';
    });

    $('#vehicle-form').on('click', '#submit', (event) => {
        event.preventDefault();
        if ($('#vehicle-input').val() !== '') {
            $('#results').append(`<div class="item vehicle">
                                    <div class="picture">
                                        <img src="" alt="">
                                    </div>
                                    <div class="iteminfo">
                                        <p>${$('#vehicle-input').val()}</p>
                                    </div>
                                </div>`);
            modal.style.display = 'none';
        } else {
            alert('Please enter a vehicle name');
        }
        $('#vehicle-input').val('');
    });

    $('#vehicle-close').click(() => {
        modal.style.display = 'none';
    });
}


function addItem() {
    let modal = document.getElementById('addNewItem-modal');
    $('#add-item').click(() => {
        modal.style.display = 'block';
    });

    $('#item-form').on('click', '#submit', (event) => {
        event.preventDefault();
        $('#results').append(`<div class="item" id="item">
                                    <div class="picture">
                                        <img src="" alt="">
                                    </div>
                                    <div class="iteminfo">
                                        <p>${$('#item-input').val()}</p>
                                    </div>
                                    <div class="iteminfo">
                                        <p>$${$('#price-input').val()}</p>
                                    </div> 
                                    <div class="iteminfo">
                                        <p>Quantity: ${$('#quantity-input').val()}</p>
                                    </div> 
                                <div>`);
        modal.style.display = 'none';
        $('#item-input').val('');
        $('#price-input').val('');
        $('#quantity-input').val('');
    });

    $('#item-close').click(() => {
        modal.style.display = 'none';
    });
}

/* function editItem () {
    let modal = document.getElementById('editItem-modal');
    $('#results').on('click', '#item', function () {
        console.log($(this).find('#name')[0].innerHTML);
        $('#editItem-modal').append(`
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
        modal.style.display = "block";
    });
    $('#editItem-modal').on('click', '#editItem-close', function () {
        modal.style.display = 'none';
        $('#editItem-modal').empty();
    });
}; */

$((document) => {
    selectVehicle();
    runReport();
    addItem();
    addVehicle();
    getVehicle(displayVehicle);
    //    editItem();
});
