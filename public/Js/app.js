let isVehicle = true;

// Submit handler for add item/vehicle form modal
function formSubmitHandler(e) {
    e.preventDefault();
    const form = $(this);
    const formData = new FormData(this);

    const keys = Array.from(formData.keys());
    const data = keys.map(key => `${key}=${encodeURIComponent(formData.get(key))}`).join('&');

    if (isVehicle) {
        $.ajax({
            method: 'POST',
            url: '/api/vehicle',
            data,
            success: (data) => {
                $('.noItems').addClass('js-hide-display');
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
                clearForm();
                renderNewItem(data);
                isVehicle = true;
                addItemAlert();
            },
        });
    }
}
// Add Vehicle Modal
function showVehicleModal() {
    const modal = document.getElementById('addNewVehicle-modal');
    modal.style.display = 'block';
}

function hideVehicleModal() {
    const modal = document.getElementById('addNewVehicle-modal');
    modal.style.display = 'none';
}

// Add Item modal
function showItemModal() {
    const modal = document.getElementById('addNewItem-modal');
    modal.style.display = 'block';
}

function hideItemModal() {
    const modal = document.getElementById('addNewItem-modal');
    modal.style.display = 'none';
}

// Edit Vehicle Modal
function showEditVehicleModal() {
    const modal = document.getElementById('editVehicle-modal');
    modal.style.display = 'block';
}

function hideEditVehicleModal() {
    const modal = document.getElementById('editVehicle-modal');
    modal.style.display = 'none';
}

// Edit Item Modal
function showEditItemModal() {
    const modal = document.getElementById('editItem-modal');
    modal.style.display = 'block';
}

function hideEditItemModal() {
    const modal = document.getElementById('editItem-modal');
    modal.style.display = 'none';
}

$((document) => {
    selectVehicle();
    runReport();
    addItem();
    addVehicle();
});
