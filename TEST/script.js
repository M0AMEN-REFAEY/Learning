document.addEventListener('DOMContentLoaded', () => {
    const productContainer = document.getElementById('product-container');
    const cartItems = document.getElementById('cartItems');
    const totalQuantity = document.getElementById('totalQuantity');
    const totalPrice = document.getElementById('totalPrice');
    const searchInput = document.getElementById('search');
    const categorySelect = document.getElementById('category');
    const minPriceInput = document.getElementById('minPrice');
    const maxPriceInput = document.getElementById('maxPrice');
    const applyFiltersButton = document.getElementById('applyFilters');
    const prevPageButton = document.getElementById('prevPage');
    const nextPageButton = document.getElementById('nextPage');
    const pageNumber = document.getElementById('pageNumber');

    let products = [];
    let filteredProducts = [];
    let cart = [];
    let currentPage = 1;
    const itemsPerPage = 6;

    function fetchProducts() {
        fetch('https://fakestoreapi.com/products')
            .then(response => response.json())
            .then(data => {
                products = data;
                filteredProducts = products;
                populateCategories();
                renderProducts();
            })
            .catch(error => console.error('Error fetching products:', error));
    }

    function populateCategories() {
        const categories = [...new Set(products.map(product => product.category))];
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
    }

    function renderProducts() {
        productContainer.innerHTML = '';
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const productsToRender = filteredProducts.slice(start, end);

        productsToRender.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('product');

            productDiv.innerHTML = `
                <img src="${product.image}" alt="${product.title}">
                <h2>${product.title}</h2>
                <p>${product.description}</p>
                <p class="price">$${product.price}</p>
                <button onclick="addToCart(${product.id})">Add to Cart</button>
            `;

            productContainer.appendChild(productDiv);
        });

        updatePagination();
    }

    function addToCart(id) {
        const product = products.find(product => product.id === id);
        const cartItem = cart.find(item => item.product.id === id);

        if (cartItem) {
            cartItem.quantity++;
        } else {
            cart.push({ product, quantity: 1 });
        }

        updateCart();
    }

    function removeFromCart(id) {
        cart = cart.filter(item => item.product.id !== id);
        updateCart();
    }

    function updateCart() {
        cartItems.innerHTML = '';
        let totalQty = 0;
        let totalPriceValue = 0;

        cart.forEach(item => {
            const cartItem = document.createElement('li');
            cartItem.innerHTML = `
                ${item.product.title} - $${item.product.price} x ${item.quantity} 
                <button onclick="removeFromCart(${item.product.id})">Remove</button>
            `;

            cartItems.appendChild(cartItem);
            totalQty += item.quantity;
            totalPriceValue += item.product.price * item.quantity;
        });

        totalQuantity.textContent = totalQty;
        totalPrice.textContent = totalPriceValue.toFixed(2);
    }

    function filterProducts() {
        const searchQuery = searchInput.value.toLowerCase();
        const selectedCategory = categorySelect.value;
        const minPrice = minPriceInput.value ? parseFloat(minPriceInput.value) : 0;
        const maxPrice = maxPriceInput.value ? parseFloat(maxPriceInput.value) : Infinity;

        filteredProducts = products.filter(product => {
            return (
                product.title.toLowerCase().includes(searchQuery) &&
                (selectedCategory === 'all' || product.category === selectedCategory) &&
                product.price >= minPrice &&
                product.price <= maxPrice
            );
        });

        currentPage = 1;
        renderProducts();
    }

    function updatePagination() {
        pageNumber.textContent = currentPage;
        prevPageButton.disabled = currentPage === 1;
        nextPageButton.disabled = currentPage * itemsPerPage >= filteredProducts.length;
    }

    prevPageButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderProducts();
        }
    });

    nextPageButton.addEventListener('click', () => {
        if (currentPage * itemsPerPage < filteredProducts.length) {
            currentPage++;
            renderProducts();
        }
    });

    applyFiltersButton.addEventListener('click', filterProducts);

    fetchProducts();
});
