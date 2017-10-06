console.log('its working');

const MOCK_INVENTORY = {
    inventory: [
        {
            id: "111111",
            image: "https://i5.walmartimages.com/asr/9a4a04d7-3059-49b1-a4fa-f5d78f43ebf2_1.c8301f7929be8b305ae0804e5ac298b0.jpeg?odnHeight=450&odnWidth=450&odnBg=FFFFFF",
            item: "Rotella 15w40",
            partNumber: "oil",
            listPrice: 25.99,
            quantityOnHand: 24,
            reorderPoint: 6,
            inventory_id: "vehicle1"

        },
        {
            id: "111111",
            image: "https://i5.walmartimages.com/asr/9a4a04d7-3059-49b1-a4fa-f5d78f43ebf2_1.c8301f7929be8b305ae0804e5ac298b0.jpeg?odnHeight=450&odnWidth=450&odnBg=FFFFFF",
            item: "Rotella 15w40",
            partNumber: "oil",
            listPrice: 25.99,
            quantityOnHand: 12,
            reorderPoint: 6,
            inventory_id: "vehicle2"

        },
        {
            id: "222222",
            item: "Shell ELC",
            partNumber: "coolant",
            listPrice: 36.49,
            quantityOnHand: 12,
            reorderPoint: 6
        },
        {
            id: "333333",
            item: "Racor 900 Service Kit",
            partNumber: "900kit",
            listPrice: 47.99,
            quantityOnHand: 6,
            reorderPoint: 2
        },
        {
            id: "444444",
            item: "Racor 500 Service Kit",
            partNumber: "500kit",
            listPrice: 54.99,
            quantityOnHand: 4,
            reorderPoint: 2
        },
        {
            id: "555555",
            item: "Oil Sample Kit",
            partNumber: "oilkit",
            listPrice: 50,
            quantityOnHand: 3,
            reorderPoint: 5
        },
        {
            id: "666666",
            item: "AFC 710",
            partNumber: "afc710",
            listPrice: 30,
            quantityOnHand: 2,
            reorderPoint: 4
        }
    ]
};

$(function handleStart(document) {
    selectVehicle();
    runReport();
    addItem();
    addVehicle();
//    editItem();
});

function getInventoryItems(callbackfn) {
    setTimeout(function () { callbackfn(MOCK_INVENTORY) }, 100);
};

function displayInventoryItems(data) {
    for (index in data.inventory) {
        $('#results').append(`<div class="item" id="item">
                                    <div class="picture">
                                        <img src="${data.inventory[index].image}" alt="">
                                    </div>
                                    <div class="iteminfo">
                                        <p id="name">${data.inventory[index].item}</p>
                                    </div>
                                    <div class="iteminfo">
                                        <p id="price">$${data.inventory[index].listPrice}</p>
                                    </div> 
                                    <div class="iteminfo">
                                        <p id="quantity">Quantity: ${data.inventory[index].quantityOnHand}</p>
                                    </div> 
                                <div>`);
    };
};

function getAndDisplayInventoryItems() {
    getInventoryItems(displayInventoryItems);
};

/*$(function() {
    getAndDisplayInventoryItems()
})*/

//Selects which vehicle to get inventory on
function selectVehicle() {
    $('#results').on('click', '.vehicle', function () {
        console.log(this);
        $('.vehicle').addClass('js-hide-display');
        $('#add-item').removeClass('js-hide-display');
        $('#add-vehicle').addClass('js-hide-display');
        getAndDisplayInventoryItems();
    });
};

//Gets all items below reorder point and displays them as a <ul>

function reorderReport(data) {
    for (index in data.inventory) {
        if (data.inventory[index].quantityOnHand < data.inventory[index].reorderPoint) {
            $('#reorder-list').append(`<li>${data.inventory[index].item} Quantity: ${data.inventory[index].quantityOnHand}, Reorder Point: ${data.inventory[index].reorderPoint}</li>`);
        };
    };
};

//Event handler for report selection
function runReport() {
    $('#reorder').click(function () {
        $('.report').addClass('js-hide-display');
        getInventoryItems(reorderReport);
    });
};

function addVehicle() {
    let modal = document.getElementById('addNewVehicle-modal');

    $('#add-vehicle').click(function () {
        modal.style.display = "block";
    });

    $('#vehicle-form').on('click', '#submit', function (event) {
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
        }
        else {
            alert('Please enter a vehicle name');
        };
        $('#vehicle-input').val('');
    });

    $('#vehicle-close').click(function () {
        modal.style.display = 'none';
    });
};


function addItem() {
    let modal = document.getElementById('addNewItem-modal');
    $('#add-item').click(function () {    
        modal.style.display = "block";
    });

    $('#item-form').on('click', '#submit', function (event) {
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

    $('#item-close').click(function () {
        modal.style.display = 'none';
    });   
};

/*function editItem () {
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
};*/

