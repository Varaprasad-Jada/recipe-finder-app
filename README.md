# Recipe Finder App

A responsive web application to discover recipes by name, ingredient, or category. The app features a modern UI inspired by mobile app designs, including a clean search bar, category filters, dynamic recipe cards, and a detailed recipe modal. Powered by TheMealDB API.

## ✨ Features

* **Recipe Search:** Find recipes by typing a recipe name or ingredient into the search bar.
* **Category Filters:** Browse recipes by popular categories (e.g., Indian, Mexican, Chinese, Japanese, Italian, Thai).
* **Dynamic Recipe Cards:** Displays recipe images, titles, and a placeholder rating for a visually engaging list.
* **Recipe Details Modal:** Click on any recipe card to view detailed instructions, ingredients list, and a link to a YouTube tutorial (if available).
* **Responsive Design:** Optimized for seamless viewing and interaction across desktop, tablet, and mobile devices, adapting its layout dynamically.
* **Loading & Error Handling:** Provides user feedback with loading spinners and informative error messages.
* **"Trending Recipes" Section:** Displays a selection of popular recipes on initial load (currently defaults to Indian recipes for demonstration).
* **Interactive UI:** Hover effects, active states for buttons, and a smooth modal animation.
* **Favorite Button Placeholder:** Each card has a heart icon (front-end only) that can be extended with local storage for actual favoriting.

## 🚀 Technologies Used

* **HTML5:** Structured the web page content semantically.
* **CSS3:** Styled the application, implementing the visual design from the reference image, responsive layouts with `flexbox` and `grid`, and `@media` queries for different screen sizes.
* **JavaScript (ES6+):** Handled API requests using `fetch()`, parsed JSON responses, dynamically updated the DOM, managed app state, and implemented modal functionality.
* **TheMealDB API:** The public API used for fetching recipe data. **No API key is required for basic search and lookup functionality.**
* **Font Awesome:** Utilized for various icons (search, categories, home, cart, favorite, user, stars, heart, loading, error, etc.).
* **Google Fonts (Montserrat):** For modern and legible typography throughout the application.

## 📦 How to Use/Run

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/Varaprasad-Jada/recipe-finder-app.git](https://github.com/Varaprasad-Jada/recipe-finder-app.git)
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd recipe-finder-app
    ```
3.  **Open `index.html`:** Simply open the `index.html` file in your preferred web browser (e.g., Chrome, Firefox, Edge).
4.  **Start Searching:**
    * The app will automatically display "Trending Recipes" (defaults to Indian recipes) on load.
    * Use the search bar to find recipes by name (e.g., "Burger", "Chicken") or ingredients (e.g., "egg", "rice").
    * Click on category buttons to filter recipes.
    * Click on a recipe card to view detailed instructions in a modal.

## 🌐 Live Demo

You can see a live demo of the Recipe Finder App here:
[https://Varaprasad-Jada.github.io/recipe-finder-app/](https://Varaprasad-Jada.github.io/recipe-finder-app/)
*(Remember to replace `Varaprasad-Jada` and `recipe-finder-app` with your actual GitHub username and repository name after deployment.)*

## 📸 Screenshots

## 📝 Future Enhancements (Ideas for further development)

* **Favorite Recipes:** Implement full favorite functionality using Local Storage to save and retrieve liked recipes.
* **Ingredient Search Enhancement:** Allow searching by multiple ingredients.
* **Meal Planner:** Integrate a simple meal planning feature where users can add recipes to a weekly plan.
* **Shopping List:** Generate a shopping list based on ingredients from selected recipes.
* **User Accounts:** (More advanced) Implement simple user authentication to save preferences.
* **Dynamic Backgrounds:** Change background color/image based on time of day or selected category.
* **Accessibility Improvements:** Enhance keyboard navigation and screen reader support.

---

Feel free to explore, fork, and contribute!