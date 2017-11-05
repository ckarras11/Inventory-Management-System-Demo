// Gets all items below reorder point and displays them as a <ol>
function reorderReport(data) {
    const itemsToReorder = [];
    for (index in data) {
        if (data[index].quantityOnHand < data[index].reorderPoint) {
            itemsToReorder.push(data[index]);
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
    } else if (itemA < itemB) {
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