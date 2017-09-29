console.log('its working');

const MOCK_INVENTORY = {
    inventory: [
        {
            id: "111111",
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
            quantityOnHand: 10,
            reorderPoint: 5
        },
        {
            id: "666666",
            item: "AFC 710",
            partNumber: "afc710",
            listPrice: 30,
            quantityOnHand: 10,
            reorderPoint: 4
        }
    ]
}

function getInventoryItems(callbackfn) {
    setTimeout(function () { callbackfn(MOCK_INVENTORY) }, 100);
}

function displayInventoryItems(data) {
    for (index in data.inventory){
        $('#results').append(`<div class="item">
                                    <div class="picture>
                                    </div>
                                    <div class="itemName">
                                        <p>${data.inventory[index].item}</p>
                                    </div>
                                    <div class="quantity">
                                        <p>$${data.inventory[index].listPrice}</p>
                                    </div> 
                                    <div class="quantity">
                                        <p>${data.inventory[index].quantityOnHand}</p>
                                    </div> 
                                <div>`)
    }
}

function getAndDisplayInventoryItems() {
    getInventoryItems(displayInventoryItems)
}

/*$(function() {
    getAndDisplayInventoryItems()
})*/

$('li').on('click', function() {
    console.log(this)
    getAndDisplayInventoryItems()
})
