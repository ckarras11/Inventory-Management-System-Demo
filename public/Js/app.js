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

$((document) => {
    selectVehicle();
    runReport();
    addItem();
    addVehicle();
});
