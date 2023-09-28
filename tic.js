document.addEventListener("DOMContentLoaded", () => {
    // API URL
    const apiUrl = "https://api.punkapi.com/v2/beers?page=1&per_page=60";

    // Variables to manage pagination
    const minProductsPerPage = 10; // Minimum products per page
    let currentPage = 1;
    let filteredProducts = [];

    // Get DOM elements
    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-button");
    const resetButton = document.getElementById("reset-button");
    const productContainer = document.getElementById("product-container");
    const pagination = document.getElementById("pagination");
    
    // Function to fetch product data from the API
    async function fetchProducts() {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            filteredProducts = data;
            currentPage = 1;
            displayProducts(currentPage);
            updatePaginationButtons();
        } catch (error) {
            console.error(error);
        }
    }

    // Function to display products on a specific page
    function displayProducts(page) {
        const startIndex = (page - 1) * minProductsPerPage;
        const endIndex = startIndex + minProductsPerPage;
        const productsToDisplay = filteredProducts.slice(startIndex, endIndex);

        // Clear previous products
        productContainer.innerHTML =" ";

        

        // Display products in rows of 4 each
        for (let i = 0; i < productsToDisplay.length; i += 4) {
            const row = document.createElement("div");
            row.className = "product-row";

            const rowProducts = productsToDisplay.slice(i, i + 4);

            rowProducts.forEach(product => {
                const productCard = document.createElement("div");
                productCard.className = "product-card";

                // Display product image
                const productImage = document.createElement("img");
                productImage.src = product.image_url;
                productCard.appendChild(productImage);

                // Display product name
                const productName = document.createElement("p");
                productName.textContent = product.name;
                productCard.appendChild(productName);

                row.appendChild(productCard);
            });

            productContainer.appendChild(row);
        }

        if(productsToDisplay.length==0)
        {
            productContainer.innerHTML="This product is not available please search another one 😊😊";  
        }
    }

    

    // Function to update pagination buttons
    function updatePaginationButtons() {
        const totalPages = Math.ceil(filteredProducts.length / minProductsPerPage);
        pagination.innerHTML = "";

        for (let i = 1; i <= totalPages; i++) {
            const pageItem = document.createElement("li");
            pageItem.textContent = i;
            pageItem.addEventListener("click", () => {
                currentPage = i;
                displayProducts(currentPage);
            });
            pagination.appendChild(pageItem);
        }
    }

    // Event listener for search button click
    searchButton.addEventListener("click", () => {
        const searchTerm = searchInput.value.toLowerCase();
        filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(searchTerm)
        );
        currentPage = 1;
        displayProducts(currentPage);
        updatePaginationButtons();
    });

    // Event listener for reset button click
    resetButton.addEventListener("click", () => {
        searchInput.value = "";
        fetchProducts(); // Refetch the original data from the API
    });

    // Initial display
    fetchProducts();
});