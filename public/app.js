console.log('its working');

const MOCK_INVENTORY = {
    inventory: [
        {
            id: "111111",
            image: "https://i5.walmartimages.com/asr/9a4a04d7-3059-49b1-a4fa-f5d78f43ebf2_1.c8301f7929be8b305ae0804e5ac298b0.jpeg?odnHeight=450&odnWidth=450&odnBg=FFFFFF",
            item: "Rotella 15w40",
            partNumber: "oil",
            listPrice: 25.99,
            quantityOnHand: 12,
            reorderPoint: 6
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

$(function handleStart (document) {
    selectVehicle();
    runReport();
    addItem();
    addVehicle();
});

function getInventoryItems(callbackfn) {
    setTimeout(function () { callbackfn(MOCK_INVENTORY) }, 100);
};

function displayInventoryItems(data) {
    for (index in data.inventory) {
        $('#results').append(`<div class="item">
                                    <div class="picture">
                                        <img src="${data.inventory[index].image}" alt="">
                                    </div>
                                    <div class="iteminfo">
                                        <p>${data.inventory[index].item}</p>
                                    </div>
                                    <div class="iteminfo">
                                        <p>$${data.inventory[index].listPrice}</p>
                                    </div> 
                                    <div class="iteminfo">
                                        <p>Quantity: ${data.inventory[index].quantityOnHand}</p>
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
function selectVehicle () {
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
            $('#reorder-list').append(`<li>${data.inventory[index].item}: ${data.inventory[index].quantityOnHand}</li>`);
        };
    };
};

//Event handler for report selection
function runReport () {
    $('#reorder').click(function () {
        $('.report').addClass('js-hide-display');
        getInventoryItems(reorderReport);
    });
};

function addVehicle () {
    $('#add-vehicle').click(function () {
        $('#results').append(`<div class="item vehicle">
                                <p>Another Vehicle</p>
                            </div>`);
    });
};

function addItem() {
    $('#add-item').click(function () {
        $('#results').append(`<div class="item">
                                <div class="picture">
                                    <img src="" alt="">
                                </div>
                                <div class="iteminfo">
                                    <p>Another Item</p>
                                </div>
                                <div class="iteminfo">
                                    <p>$Price</p>
                                </div> 
                                <div class="iteminfo">
                                    <p>Quantity:</p>
                                </div> 
                            <div>`);
    });
};