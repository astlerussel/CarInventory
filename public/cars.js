import app from "./F7App.js";
const $$ = Dom7;

$$("#tab2").on("tab:show", () => {
    const sUser = firebase.auth().currentUser.uid;
    firebase.database().ref("cars/" + sUser).on("value", (snapshot) => {
        const cars = snapshot.val();
        $$("#carList").html("");
        if (cars) {
            Object.keys(cars).forEach((key) => {
                const car = cars[key];

                // Check if the car has a 'datePurchased' attribute to add strike-through
                const isBought = car.datePurchased ? true : false;

                $$("#carList").append(`
                    <div class="card">
                        <div class="card-header">${isBought? `<del> ${car.name}</del>` : `${car.name}`}</div>
                        <div class="card-content">
                            <img src="${car.imageUrl}" alt="${car.name}" style="width:100%; margin-bottom: 10px;" />
                            
                            <p>${isBought ? `<del><strong>Model</strong>: ${car.model}</del>` : `<strong>Model</strong>: ${car.model}`}</p>
                            <p>${isBought ? `<del><strong>Year</strong>: ${car.year}</del>` : `<strong>Year</strong>: ${car.year}`}</p>
                            
                            <p>${isBought ? `<del><strong>Price</strong>: $${car.price}</del>` : `<strong>Price</strong>: $${car.price}`}</p>
                            
                            <p>
                                ${
                                    isBought
                                        ? `<del>Bought on ${new Date(car.datePurchased).toLocaleDateString()}</del>`
                                        : ""
                                }
                            </p>
                            
                            <div class="card-footer">
                                <button class="button color-green" onclick="markAsBought('${key}')">I Bought This</button>
                                <button class="button color-red" onclick="deleteCar('${key}')">I Don't Need This</button>
                            </div>
                        </div>
                    </div>
                `);
            });
        } else {
            $$("#carList").html("<p>No cars found. Add your first car!</p>");
        }
    });
});


function displayError(fieldId, message) {
    const errorElement = document.getElementById(fieldId + "Error");
    if (errorElement) {
        errorElement.innerText = message;
    }
}

function clearErrors() {
    document.querySelectorAll(".error-message").forEach((el) => {
        el.innerText = "";
    });
}

function isValidUrl(url) {
    const pattern = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,6}(\/[^\s]*)?$/i;
    return pattern.test(url);
}


$$(".my-sheet").on("submit", async (evt) => {
    evt.preventDefault();

    clearErrors();

    const carData = app.form.convertToData("#addCar");
    let hasError = false;

    if (!carData.name || carData.name.trim() === "") {
        displayError("carName", "Car name is required.");
        hasError = true;
    }
    if (!carData.model || carData.model.trim() === "") {
        displayError("carModel", "Car model is required.");
        hasError = true;
    }
    if (!carData.year || isNaN(carData.year) || carData.year < 1886) {
        displayError("carYear", "Enter a valid year (1886 or later).");
        hasError = true;
    }else if(carData.year > new Date().getFullYear()) {
        displayError("carYear", "Enter a valid year (Year cannot be greater than "+new Date().getFullYear()+ " ).");
        hasError = true;
    }
    if (!carData.price || isNaN(carData.price) || carData.price <= 0 || !/^\d+(\.\d+)?$/.test(carData.price)) {
        displayError("carPrice", "Enter a valid price greater than 0 (decimals allowed).");
        hasError = true;
    }
    if (!carData.carImage || !isValidUrl(carData.carImage)) {
        displayError("carImage", "Enter a valid image URL.");
        hasError = true;
    }

    if (hasError) return;

    try {
        const sUser = firebase.auth().currentUser.uid;
        const newCarRef = firebase.database().ref("cars/" + sUser).push();
        await newCarRef.set({
            name: carData.name,
            model: carData.model,
            year: carData.year,
            price: carData.price,
            imageUrl: carData.carImage,
        });

        alert("Car added successfully!");
        app.sheet.close(".my-sheet", true);
        document.getElementById("addCar").reset();
    } catch (error) {
        console.error("Error adding car:", error);
        alert("Failed to add car. Please try again.");
    }
});


// Mark a car as bought
window.markAsBought = (carId) => {
    const userId = firebase.auth().currentUser.uid;
    const datePurchased = new Date().toISOString();
    firebase.database().ref(`cars/${userId}/${carId}`).update({ datePurchased });
};

// Delete a car
window.deleteCar = (carId) => {
    const userId = firebase.auth().currentUser.uid;
    firebase.database().ref(`cars/${userId}/${carId}`).remove();
};
