// Inicializa la base de datos WebSQL (Obsoleto)
const db = openDatabase('carrito-compras', '1.0', 'Base de datos del carrito de compras', 2 * 1024 * 1024);

// Obtén los productos del carrito desde la base de datos
function getCartItems() {
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM cart', [], function (tx, results) {
            let len = results.rows.length, i;
            let totalCost = 0;
            let productList = document.getElementById("product-list");

            for (i = 0; i < len; i++) {
                let item = results.rows.item(i);
                let itemCost = item.quantity * item.cost;
                totalCost += itemCost;

                // Añadir a la lista del DOM
                let productElement = `
                    <div class="cart-item">
                        <img src="${item.id}.jpg" alt="Imagen del Producto">
                        <h2>${item.name}</h2>
                        <p>Cantidad: ${item.quantity}</p>
                        <p>Costo total: $${itemCost}</p>
                    </div>
                `;
                productList.innerHTML += productElement;
            }

            // Actualizar el costo total del carrito
            document.getElementById("total-cost").innerText = totalCost;
        });
    });
}

// Obtén la ubicación del usuario
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        document.getElementById("geo-location").innerHTML = "La geolocalización no es compatible con este navegador.";
    }
}

// Muestra la ubicación del usuario
function showPosition(position) {
    document.getElementById("geo-location").innerHTML = "Latitud: " + position.coords.latitude + 
    "<br>Longitud: " + position.coords.longitude;
}

// Inicialización
getCartItems();
getLocation();
