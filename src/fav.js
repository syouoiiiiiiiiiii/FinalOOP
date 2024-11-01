let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

function displayFavorites() {
    const favoritesList = document.getElementById('favorites-list');
    favoritesList.innerHTML = ''; // Clear any previous favorites

    if (favorites.length === 0) {
        favoritesList.innerHTML = '<p>No favorites found.</p>';
        return;
    }

    favorites.forEach((product, index) => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product-box');
        
        // Generate star rating display based on saved rating
        const starRating = generateStars(product.rating || 0);

        productDiv.innerHTML = `
            <h3>${product.name}</h3>
            <p>Brand: ${product.brand}</p>
            <p>Type: ${product.product_type}</p>
            <p>Price: $${product.price}</p>
            <img class="product-img" src="${product.image_link}" alt="${product.name}">
            <p><a href="${product.product_link}" target="_blank">View Product</a></p>
            <p>Description: ${product.description}</p>
            <p>Rating: ${starRating}</p>
            <div class="comment-section">
                <label for="comment-${index}">Add a Comment:</label>
                <textarea id="comment-${index}" class="product-comment" data-index="${index}">${product.comment || ''}</textarea>
                <button class="save-comment" data-index="${index}">Save Comment</button>
            </div>
            <p id="display-comment-${index}" class="display-comment">${product.comment || 'No comment added.'}</p>
            <button class="remove-from-favorites" data-index="${index}">Remove from Wishlists</button>
        `;
        favoritesList.appendChild(productDiv);
    });

    const removeButtons = document.querySelectorAll('.remove-from-favorites');
    removeButtons.forEach(button => {
        button.addEventListener('click', removeFromFavorites);
    });

    const saveCommentButtons = document.querySelectorAll('.save-comment');
    saveCommentButtons.forEach(button => {
        button.addEventListener('click', saveProductComment);
    });
}

function removeFromFavorites(event) {
    const index = event.target.dataset.index;
    favorites.splice(index, 1);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    displayFavorites();
}

function saveProductComment(event) {
    const index = event.target.dataset.index;
    const commentText = document.getElementById(`comment-${index}`).value;
    favorites[index].comment = commentText;
    localStorage.setItem('favorites', JSON.stringify(favorites));
    
    const displayComment = document.getElementById(`display-comment-${index}`);
    displayComment.textContent = commentText || 'No comment added.';
    alert(`Comment saved for ${favorites[index].name}!`);
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating - fullStars >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    return '★'.repeat(fullStars) + '☆'.repeat(emptyStars);
}

displayFavorites();
