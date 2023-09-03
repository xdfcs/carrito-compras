// Inicializa la base de datos WebSQL (Obsoleto)
const db = openDatabase('compras', '1.0', 'Base de datos de la pagina de compras', 2 * 1024 * 1024);

// Crear tabla cart si no existe
db.transaction(function (tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS cart (id unique, name, quantity, cost)');
});

// Crear tabla product si no existe
db.transaction(function (tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS product (id unique, name, quantity, cost)');
});

// Añadir un producto al carrito en la base de datos
function addToCart(id, name, cost) {
    db.transaction(function (tx) {
        tx.executeSql('INSERT INTO cart (id, name, quantity, cost) VALUES (?, ?, ?, ?)', [id, name, 1, cost]);
    });
}

// Función para mostrar productos en la cuadrícula
function displayProducts() {
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM product', [], function (tx, results) {
            let len = results.rows.length, i;
            let productGrid = document.querySelector(".product-grid");
            
            for (i = 0; i < len; i++) {
                let product = results.rows.item(i);

                // Crea y añade el producto a la cuadrícula
                let productElement = document.createElement('div');
                productElement.className = 'product-card';
                productElement.id = product.id;
                productElement.draggable = true; // Hacerlo arrastrable
                productElement.innerHTML = `
                    <img src="${product.image}" alt="Imagen del Producto" class="product-image">
                    <h2>${product.name}</h2>
                    <p>${product.brand}</p>
                    <p class="price">$${product.price}</p>
                `;

                productElement.addEventListener('dragstart', handleDragStart, false); // Añadir el evento de arrastrar
                
                productGrid.appendChild(productElement);
            }
        });
    });
}


// Función para manejar el evento dragstart
function handleDragStart(event) {
    const target = event.target;
    console.log(target)
    event.dataTransfer.setData('text/plain', target.id);
}

// Manejar la funcionalidad de arrastrar y soltar
document.addEventListener("DOMContentLoaded", function () {

    // Agregar el evento dragstart a cada producto arrastrable
    const draggableItems = document.querySelectorAll('.product-card');
    draggableItems.forEach(function (item) {
        item.addEventListener('dragstart', handleDragStart, false);
    });

    // Agregar los eventos dragover y drop al carrito de compras
    const cart = document.getElementById('shopping-cart');
    cart.addEventListener('dragover', function (event) {
        event.preventDefault();
    });

    cart.addEventListener('drop', function (event) {
        event.preventDefault();
        const productId = event.dataTransfer.getData('text/plain');

        // Aquí puedes buscar en tu DOM el nombre y el costo del producto usando el productId
        const productName = document.getElementById(productId).querySelector('h2').textContent;
        const productCost = document.getElementById(productId).querySelector('.price').textContent.replace('$', '');

        // Añadir el producto al carrito en la base de datos
        addToCart(productId, productName, productCost);
    });
});

// Invocar la función para llenar la cuadrícula de productos
displayProducts();