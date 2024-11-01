let allProducts = []; // Global variable

async function fetchProducts() {
    const response = await fetch('http://makeup-api.herokuapp.com/api/v1/products.json');
    allProducts = await response.json(); // Store products
    console.log(allProducts); // Log the fetched products to the console
    populateFilters(allProducts); // Populate filters
    displayProducts(allProducts); // Call the function to display products after fetching
}

function populateFilters(products) {
    const brandSelect = document.getElementById('brand-filter');
    const typeSelect = document.getElementById('type-filter');

    const brands = new Set();
    const types = new Set();

    products.forEach(product => {
        brands.add(product.brand);
        types.add(product.product_type);
    });

    brands.forEach(brand => {
        const option = document.createElement('option');
        option.value = brand;
        option.textContent = brand;
        brandSelect.appendChild(option);
    });

    types.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        typeSelect.appendChild(option);
    });
}

function filterProducts() {
    const brandFilter = document.getElementById('brand-filter');
    const typeFilter = document.getElementById('type-filter');

    const filteredProducts = allProducts.filter(product => {
        const brandMatch = brandFilter.value === '' || product.brand === brandFilter.value;
        const typeMatch = typeFilter.value === '' || product.product_type === typeFilter.value;
        return brandMatch && typeMatch;
    });

    displayProducts(filteredProducts);
}

function displayProducts(products) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; // Clear previous products

    if (products.length === 0) {
        productList.innerHTML = '<p>No products found.</p>'; // Message for no products
        return; // Exit the function if no products
    }

    products.forEach((product, index) => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product-box'; // Add the class here

        // Truncate the description
        const truncatedDescription = product.description
            ? product.description.split('.').slice(0, 2).join('.') + '.'
            : 'No description available.';
        
        // Generate star rating display based on fetched rating
        const starRating = generateStars(product.rating || 0); // Use 0 if rating is undefined

        // Set up product and website links with a conditional check
        const productLinkHTML = product.product_link
            ? `<p><strong>Product Link:</strong> <a href="${product.product_link}" target="_blank">View Product</a></p>`
            : '';

        const websiteLinkHTML = `<p><strong>Website Link:</strong> <a href="http://makeup-api.herokuapp.com/" target="_blank">Makeup API</a></p>`;

        productDiv.innerHTML = `
            <img class="product-img" src="${product.image_link}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p><strong>Brand:</strong> ${product.brand}</p>
            <p><strong>Type:</strong> ${product.product_type}</p>
            <p><strong>Price:</strong> $${product.price}</p>
            <p><strong>Description:</strong> <span class="product-description" id="description-${index}">
                ${truncatedDescription} 
                <span class="dots" id="dots-${index}">...</span>
                <span class="more-text" id="more-${index}" style="display: none;">${product.description}</span>
            </span>
            <a href="javascript:void(0);" class="read-more" onclick="toggleReadMore(${index})" id="readMoreBtn-${index}">Read More</a></p>
            <p><strong>Rating:</strong> ${starRating}</p>
            ${websiteLinkHTML}
            ${productLinkHTML}
            <button class="add-to-favorites" data-product='${JSON.stringify(product)}'>Add to Favorites</button>
        `;
        productList.appendChild(productDiv);
    });

    // Attach event listeners for all "Add to Favorites" buttons
    const favoriteButtons = document.querySelectorAll('.add-to-favorites');
    favoriteButtons.forEach(button => {
        button.addEventListener('click', addToFavorites);
    });
}

function addToFavorites(event) {
    const product = JSON.parse(event.target.getAttribute('data-product'));
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    // Check if the product is already in favorites
    if (!favorites.some(fav => fav.id === product.id)) {
        favorites.push(product); // Add product to favorites
        localStorage.setItem('favorites', JSON.stringify(favorites)); // Save to localStorage
        alert('Product added to favorites!'); // Notify user
    } else {
        alert('Product is already in favorites!'); // Notify user
    }
}

// Function to toggle Read More / Read Less
function toggleReadMore(index) {
    const dots = document.getElementById(`dots-${index}`);
    const moreText = document.getElementById(`more-${index}`);
    const readMoreBtn = document.getElementById(`readMoreBtn-${index}`);

    if (dots.style.display === 'none') {
        dots.style.display = 'inline';
        readMoreBtn.textContent = 'Read More';
        moreText.style.display = 'none';
    } else {
        dots.style.display = 'none';
        readMoreBtn.textContent = 'Read Less';
        moreText.style.display = 'inline';
    }
}

// Function to generate star rating HTML based on the rating number
function generateStars(rating) {
    const fullStars = Math.floor(rating); // Number of full stars
    const halfStar = rating - fullStars >= 0.5 ? 1 : 0; // Determine if there’s a half star
    const emptyStars = 5 - fullStars - halfStar; // Remaining empty stars

    return (
        '★'.repeat(fullStars) + // Full stars
        '☆'.repeat(emptyStars)  // Empty stars
    );
}

document.getElementById('brand-filter').addEventListener('change', filterProducts);
document.getElementById('type-filter').addEventListener('change', filterProducts);

// Fetch products when the page loads
fetchProducts();
