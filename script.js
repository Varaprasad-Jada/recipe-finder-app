// TheMealDB API base URL - No API Key needed for basic search/lookup
const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1/';
const ICON_BASE_URL = 'https://www.themealdb.com/images/ingredients/'; // Example icon base URL for ingredients

// --- Get DOM elements ---
const recipeInput = document.getElementById('recipeInput');
const searchBtn = document.getElementById('searchBtn');
const categoryButtonsContainer = document.getElementById('categoryButtons');
const resultsTitle = document.getElementById('resultsTitle');
const recipeGrid = document.getElementById('recipeGrid');
const loadingIndicator = document.querySelector('.loading-indicator');
const errorMessage = document.querySelector('.error-message');

// Modal Elements
const recipeModal = document.getElementById('recipeModal');
const closeButton = document.querySelector('.close-button');
const modalRecipeTitle = document.getElementById('modalRecipeTitle');
const modalRecipeImage = document.getElementById('modalRecipeImage');
const modalIngredientsList = document.getElementById('modalIngredientsList');
const modalInstructions = document.getElementById('modalInstructions');
const modalYoutubeLink = document.getElementById('modalYoutubeLink');

// --- Favorites Data (using Local Storage) ---
let favoriteRecipes = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];

/**
 * Saves the current favoriteRecipes array to Local Storage.
 */
function saveFavorites() {
    localStorage.setItem('favoriteRecipes', JSON.stringify(favoriteRecipes));
}

/**
 * Checks if a recipe is currently in the favorites list.
 * @param {string} mealId - The ID of the meal to check.
 * @returns {boolean} True if the meal is a favorite, false otherwise.
 */
function isFavorite(mealId) {
    return favoriteRecipes.some(favMeal => favMeal.idMeal === mealId);
}

/**
 * Adds or removes a recipe from the favorites list.
 * @param {Object} meal - The meal object to add/remove.
 */
function toggleFavorite(meal) {
    if (isFavorite(meal.idMeal)) {
        // Remove from favorites
        favoriteRecipes = favoriteRecipes.filter(favMeal => favMeal.idMeal !== meal.idMeal);
        console.log(`Removed ${meal.strMeal} from favorites.`);
    } else {
        // Add to favorites
        favoriteRecipes.push(meal);
        console.log(`Added ${meal.strMeal} to favorites.`);
    }
    saveFavorites(); // Save changes to local storage
    // Re-render current view if it's the favorites list
    if (resultsTitle.textContent.includes("My Favorites")) {
        displayRecipes(favoriteRecipes);
    }
}

// --- Helper Functions ---

/**
 * Shows a given HTML element.
 * @param {HTMLElement} element - The HTML element to show.
 * @param {string} displayType - The CSS display property value (e.g., 'block', 'flex', 'grid').
 */
function showElement(element, displayType = 'block') {
    element.style.display = displayType;
}

/**
 * Hides a given HTML element.
 * @param {HTMLElement} element - The HTML element to hide.
 */
function hideElement(element) {
    element.style.display = 'none';
}

/**
 * Clears the recipe grid and hides any error messages.
 */
function clearResults() {
    recipeGrid.innerHTML = ''; // Clear all recipe cards
    hideElement(errorMessage); // Hide error message
}

/**
 * Shows the loading indicator.
 */
function showLoading() {
    clearResults(); // Clear results before showing loading
    showElement(loadingIndicator, 'flex'); // Use flex to center the spinner
}

/**
 * Hides the loading indicator.
 */
function hideLoading() {
    hideElement(loadingIndicator);
}

/**
 * Displays an informational or error message to the user.
 * @param {HTMLElement} element - The element to display the message in (e.g., errorMessage).
 * @param {string} message - The message text.
 * @param {string} type - 'error' or 'info' (for styling purposes).
 */
function showMessage(element, message, type = 'error') {
    element.textContent = message;
    // Assign class based on message type for appropriate styling (e.g., red for error)
    element.className = `message ${type}-message`;
    showElement(element, 'flex'); // Use flex to center the message
}

// --- API Interaction Functions ---

/**
 * Fetches recipes from TheMealDB API.
 * @param {string} query - The search term (recipe name or category).
 * @param {'search' | 'category' | 'random'} type - The type of API call.
 * @returns {Array<Object> | null} An array of meal objects or null if none.
 */
async function fetchRecipes(query, type = 'search') {
    showLoading(); // Show loading indicator while fetching

    let url;
    if (type === 'search') {
        url = `${API_BASE_URL}search.php?s=${query}`; // Search by meal name
    } else if (type === 'category') {
        url = `${API_BASE_URL}filter.php?c=${query}`; // Filter by category
    } else if (type === 'random') {
        url = `${API_BASE_URL}random.php`; // Get a random meal
    } else {
        console.error("Invalid fetch type:", type);
        hideLoading();
        showMessage(errorMessage, 'An internal error occurred. Please try again.');
        return null;
    }

    try {
        const response = await fetch(url);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('No recipes found for this query.');
            } else {
                throw new Error(`Network response was not ok, status: ${response.status}`);
            }
        }
        const data = await response.json();
        hideLoading(); // Hide loading indicator once data is received
        return data.meals; // The API returns 'meals' array, or null if no results
    } catch (error) {
        console.error("Error fetching recipes:", error);
        hideLoading();
        showMessage(errorMessage, `Error: ${error.message}. Please try checking your internet connection.`);
        return null;
    }
}

/**
 * Fetches detailed information for a specific meal by its ID.
 * @param {string} id - The ID of the meal.
 * @returns {Object | null} A meal object with full details or null if not found/error.
 */
async function fetchRecipeDetails(id) {
    try {
        const response = await fetch(`${API_BASE_URL}lookup.php?i=${id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.meals ? data.meals[0] : null; // Return the first (and only) meal object
    } catch (error) {
        console.error("Error fetching recipe details:", error);
        return null;
    }
}

// --- Rendering Functions ---

/**
 * Displays an array of meal objects as recipe cards in the grid.
 * @param {Array<Object> | null} meals - An array of meal objects.
 */
function displayRecipes(meals) {
    clearResults(); // Clear any existing recipes

    if (!meals || meals.length === 0) {
        showMessage(errorMessage, 'No recipes found for your search. Try a different term or category!');
        return;
    }

    hideElement(errorMessage); // Ensure error message is hidden if results are found

    meals.forEach(meal => {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card');
        recipeCard.dataset.id = meal.idMeal; // Store meal ID for later detail lookup

        // Random rating (TheMealDB doesn't provide ratings)
        const rating = (Math.random() * (5 - 3) + 3).toFixed(1); // Random rating between 3.0 and 5.0

        // Determine if the recipe is already a favorite to set the heart icon
        const heartIconClass = isFavorite(meal.idMeal) ? 'fas fa-heart' : 'far fa-heart';
        const favBtnActiveClass = isFavorite(meal.idMeal) ? 'active' : '';

        recipeCard.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <div class="recipe-info">
                <h3>${meal.strMeal}</h3>
                <div class="recipe-meta">
                    <div class="rating">
                        <i class="fas fa-star"></i>
                        <span>${rating}</span>
                    </div>
                    <button class="fav-btn ${favBtnActiveClass}" data-meal-id="${meal.idMeal}" data-meal-name="${meal.strMeal}" data-meal-thumb="${meal.strMealThumb}">
                        <i class="${heartIconClass}"></i>
                    </button>
                </div>
            </div>
        `;
        recipeGrid.appendChild(recipeCard);
    });
}

/**
 * Opens and populates the recipe details modal with information from a meal object.
 * @param {Object} meal - The meal object with full recipe details.
 */
function openRecipeModal(meal) {
    if (!meal) {
        alert("Could not load recipe details."); // Use alert for simplicity, could be a custom modal
        return;
    }

    modalRecipeTitle.textContent = meal.strMeal;
    modalRecipeImage.src = meal.strMealThumb;
    modalRecipeImage.alt = meal.strMeal;
    modalInstructions.textContent = meal.strInstructions; // Instructions text

    // Clear previous ingredients
    modalIngredientsList.innerHTML = '';
    // Loop through ingredients (TheMealDB provides strIngredient1 to strIngredient20)
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        // Only add if ingredient exists and is not just whitespace
        if (ingredient && ingredient.trim() !== '') {
            const listItem = document.createElement('li');
            listItem.textContent = `${measure ? measure.trim() + ' ' : ''}${ingredient.trim()}`;
            modalIngredientsList.appendChild(listItem);
        }
    }

    // Show/hide YouTube link based on availability
    if (meal.strYoutube) {
        modalYoutubeLink.href = meal.strYoutube;
        showElement(modalYoutubeLink, 'inline-block'); // Display as inline-block for button-like appearance
    } else {
        hideElement(modalYoutubeLink);
    }

    showElement(recipeModal, 'flex'); // Show the modal (using flex to center it)
}

// --- Event Handlers ---

/**
 * Handles the search action triggered by button click or Enter key.
 */
async function handleSearch() {
    const query = recipeInput.value.trim(); // Get search query and trim whitespace
    if (query) {
        resultsTitle.textContent = `Search Results for "${query}"`;
        // Ensure "My Favorites" button is not active when searching
        document.querySelector('.category-btn[data-category="Favorites"]')?.classList.remove('active');
        const meals = await fetchRecipes(query, 'search');
        displayRecipes(meals);
    } else {
        showMessage(errorMessage, 'Please enter a recipe name or ingredient to search.');
        // If input is empty, revert to loading trending recipes
        loadTrendingRecipes();
    }
}

/**
 * Handles clicks on category buttons to filter recipes or show favorites.
 * @param {Event} event - The click event object.
 */
async function handleCategoryClick(event) {
    const clickedBtn = event.target.closest('.category-btn'); // Find the closest category button
    if (!clickedBtn) return; // If click wasn't on a button, do nothing

    // Remove 'active' class from all category buttons
    document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
    // Add 'active' class to the clicked button
    clickedBtn.classList.add('active');

    const category = clickedBtn.dataset.category; // Get the category from data-category attribute

    if (category === 'Favorites') {
        resultsTitle.textContent = "My Favorite Recipes";
        displayRecipes(favoriteRecipes); // Display favorites from local storage
    } else {
        resultsTitle.textContent = `${category} Recipes`; // Update title
        const meals = await fetchRecipes(category, 'category'); // Fetch by category
        displayRecipes(meals);
    }
}

/**
 * Handles clicks on recipe cards to open the details modal or toggle favorite.
 * Uses event delegation for efficiency.
 * @param {Event} event - The click event object.
 */
async function handleRecipeCardClick(event) {
    const recipeCard = event.target.closest('.recipe-card');
    if (!recipeCard) return;

    // Check if the favorite heart button was clicked
    const favBtn = event.target.closest('.fav-btn');
    if (favBtn) {
        event.stopPropagation(); // Prevent the card click event from firing
        const mealId = favBtn.dataset.mealId;
        const mealName = favBtn.dataset.mealName;
        const mealThumb = favBtn.dataset.mealThumb;

        // Fetch full meal details to save to favorites, as card only has basic info
        const mealDetails = await fetchRecipeDetails(mealId);
        if (mealDetails) {
            toggleFavorite(mealDetails); // Add/remove from favorites
            // Update the heart icon visually immediately
            favBtn.classList.toggle('active', isFavorite(mealId));
            favBtn.querySelector('i').className = isFavorite(mealId) ? 'fas fa-heart' : 'far fa-heart';
        }
        return;
    }

    const mealId = recipeCard.dataset.id; // Get the meal ID from the clicked card
    if (mealId) {
        const mealDetails = await fetchRecipeDetails(mealId); // Fetch full details
        openRecipeModal(mealDetails); // Open modal with details
    }
}

/**
 * Loads and displays initial "Trending Recipes" when the app starts.
 */
async function loadTrendingRecipes() {
    resultsTitle.textContent = "Trending Recipes";
    // Ensure "My Favorites" button is not active initially
    document.querySelector('.category-btn[data-category="Favorites"]')?.classList.remove('active');
    // Set 'Indian' category button as active initially
    document.querySelector('.category-btn[data-category="Indian"]')?.classList.add('active');

    // Fetch recipes from a popular category (e.g., 'Indian') to serve as 'trending'
    const meals = await fetchRecipes('Indian', 'category');
    // Display a limited number of trending recipes (e.g., first 8)
    displayRecipes(meals ? meals.slice(0, 8) : null);
}

// --- Event Listeners Setup ---

// Search button click listener
searchBtn.addEventListener('click', handleSearch);

// Enter key press listener on the input field
recipeInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

// Event delegation for category buttons (listens on parent container)
categoryButtonsContainer.addEventListener('click', handleCategoryClick);

// Event delegation for recipe cards (listens on parent grid)
recipeGrid.addEventListener('click', handleRecipeCardClick);

// Modal Close button
closeButton.addEventListener('click', () => {
    hideElement(recipeModal);
});

// Close modal when clicking outside of the modal content
window.addEventListener('click', (event) => {
    if (event.target === recipeModal) {
        hideElement(recipeModal);
    }
});

// --- Initial App Load ---
// When the DOM is fully loaded, load the initial trending recipes
document.addEventListener('DOMContentLoaded', () => {
    loadTrendingRecipes();
});