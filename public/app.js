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
        // alert('no items');
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

function displayVehicle(data) {
    for (index in data) {
        $('#results').append(`<div class="item vehicle">
                                <p id="${data[index].vehicleName}">${data[index].vehicleName}</p>
                              </div>`);
    }
}
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

function addVehicle() {
    let modal = document.getElementById('addNewVehicle-modal');

    $('#add-vehicle').click(() => {
        modal.style.display = 'block';
    });

    $('#vehicle-form').on('click', '#submit', (event) => {
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
            event.preventDefault();
        }
        // $('#vehicle-input').val('');
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
        // event.preventDefault();
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
        /* $('#item-input').val('');
        $('#price-input').val('');
        $('#quantity-input').val(''); */
    });

    $('#item-close').click(() => {
        modal.style.display = 'none';
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
