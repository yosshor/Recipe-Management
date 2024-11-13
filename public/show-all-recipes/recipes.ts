interface User {
  fullName: string;
  profilePicture: string;
  _id: string;
}

interface Recipe {
  _id: string;
  title: string;
  description: string;
  ingredients: string;
  instructions: string;
  cookingTime: number;
  servingSize: number;
  category: string;
  image: string;
  likes: string[];
  comments: {
    userId: { fullName: string };
    content: string;
    createdAt: string;
  }[];
  user: User;
}

async function fetchRecipes() {
  try {
    const response = await fetch("/api/recipe/get-all");
    const recipes = await response.json();
    if (recipes.length === 0) {
      return noRecipesFound();
    }
    displayRecipes(recipes);
    return;
  } catch (error) {
    console.error("Error fetching recipes:", error);
  }
}

function noRecipesFound() {
  console.log("No recipes found");
  const recipesList = document.getElementById("recipes-list")!;
  const content = document.getElementById("content")!;
  recipesList.style.backgroundColor = "white";
  content.style.backgroundColor = "white";
  recipesList.innerHTML = "";
  const recipeCard = document.createElement("div");
  recipeCard.className = "no-recipes";
  const noRecipes = document.createElement("h2");
  noRecipes.textContent = "No recipes found";
  recipeCard.appendChild(noRecipes);
  recipesList.appendChild(recipeCard);
  return;
}

async function displayRecipes(recipes: Recipe[]) {
  const user = await fetch("/api/users/getUserData", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const {userId, userData} = await user.json();
  const recipesList = document.getElementById("recipes-list")!;
  
  getSelectCategoriesRecipe();

  recipesList.innerHTML = "";

  recipes.forEach((recipe) => {
    const recipeCard = document.createElement("div");
    recipeCard.className = "recipe-card";

    // User information
    const userSection = document.createElement("div");
    userSection.className = "user-section";

    const userImage = document.createElement("img");
    userImage.src = `../${recipe.user.profilePicture}`;
    userImage.alt = `${recipe.user.fullName}'s profile picture`;
    userSection.appendChild(userImage);

    const userName = document.createElement("p");
    userName.textContent = recipe.user.fullName;
    userSection.appendChild(userName);

    recipeCard.appendChild(userSection);

    // Recipe details
    const titleSection = document.createElement("div");
    titleSection.className = "recipe-title";
    const recipeTitle = document.createElement("h2");
    recipeTitle.textContent = recipe.title;
    titleSection.appendChild(recipeTitle);
    recipeCard.appendChild(titleSection);

    const recipeImgCard = document.createElement("div");
    recipeImgCard.className = "recipe-image";
    const recipeImage = document.createElement("img");
    recipeImage.src = recipe.image.includes("uploads\\recipes")
      ? `../${recipe.image}`
      : recipe.image;
    recipeImage.alt = `${recipe.title}'s recipe picture`;
    recipeImgCard.appendChild(recipeImage);
    recipeCard.appendChild(recipeImgCard);

    const recipeIngredients = document.createElement("p");
    recipeIngredients.textContent = `Ingredients: ${recipe.ingredients}`;
    recipeCard.appendChild(recipeIngredients);

    const recipeInstructions = document.createElement("p");
    recipeInstructions.textContent = `Instructions: ${recipe.instructions}`;
    recipeCard.appendChild(recipeInstructions);

    const recipeCookingTime = document.createElement("p");
    recipeCookingTime.className = "recipe-time";
    recipeCookingTime.textContent = `Cooking Time: ${recipe.cookingTime} minutes`;
    recipeCard.appendChild(recipeCookingTime);

    const recipeServingSize = document.createElement("p");
    recipeServingSize.className = "recipe-serving";
    recipeServingSize.textContent = `Serving Size: ${recipe.servingSize}`;
    recipeCard.appendChild(recipeServingSize);

    const recipeCategory = document.createElement("p");
    recipeCategory.className = "recipe-category";
    recipeCategory.textContent = `Category: ${recipe.category}`;
    recipeCard.appendChild(recipeCategory);

    const likeButton = document.createElement("button");
    likeButton.textContent = `Like (${recipe.likes.length})`;
    likeButton.onclick = () => likeRecipe(recipe._id);
    recipeCard.appendChild(likeButton);

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-recipe";
    deleteButton.style.backgroundColor = "red";
    deleteButton.style.margin = "10px";
    deleteButton.textContent = `Delete Recipe`;
    deleteButton.onclick = () => deleteRecipe(recipe._id);
    recipeCard.appendChild(deleteButton);

    if(recipe.user._id === userId) {
    const updateButton = document.createElement("button");
    updateButton.className = "update-recipe";
    updateButton.style.backgroundColor = "yellow";
    updateButton.style.color = "black";
    updateButton.style.margin = "5px";
    updateButton.style.border = "1px solid black";
    updateButton.textContent = `Update Recipe`;
    updateButton.onclick = () => updateRecipe(recipe._id);
    recipeCard.appendChild(updateButton);
    }
    const commentSection = document.createElement("div");
    commentSection.className = "comment-section";

    const commentInput = document.createElement("input");
    commentInput.type = "text";
    commentInput.placeholder = "Add a comment";
    commentSection.appendChild(commentInput);

    const commentButton = document.createElement("button");
    commentButton.textContent = "Add Comment";
    commentButton.onclick = () => addComment(recipe._id, commentInput.value);
    commentSection.appendChild(commentButton);

    const commentsList = document.createElement("ul");
    recipe.comments.forEach((comment) => {
      const commentItem = document.createElement("li");
      const commentText = document.createElement("span");
      commentItem.textContent = `${comment.userId.fullName}: ${comment.content} `;

      const commentDate = document.createElement("span");
      commentDate.className = "comment-date";
      commentDate.textContent = `${comment.createdAt.split("T")[0]} ${
        comment.createdAt.split("T")[1].split(".")[0]
      }`;

      commentItem.appendChild(commentDate);
      commentItem.appendChild(commentText);
      commentsList.appendChild(commentItem);
    });
    commentSection.appendChild(commentsList);

    recipeCard.appendChild(commentSection);

    recipesList.appendChild(recipeCard);
  });
}

async function deleteRecipe(recipeId: string): Promise<void> {
  try {
    // Show confirmation dialog
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this recipe!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    // Check if the user confirmed the deletion
    if (result.isConfirmed) {
      // Send the DELETE request
      const response = await fetch(`/api/recipe/${recipeId}/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Handle the response
      if (response.ok) {
        Swal.fire("Deleted!", "Your recipe has been deleted.", "success");
        fetchRecipes(); // Refresh the list after deletion
      } else if (response.status === 404) {
        console.error("Error deleting recipe => Recipe not found");
        Swal.fire(
          "Error",
          "There was an error deleting the recipe. Recipe not found",
          "error"
        );
      } else if (response.status === 401) {
        console.error("Error deleting recipe => Unauthorized");
        Swal.fire(
          "Error",
          "There was an error deleting the recipe. Unauthorized",
          "error"
        );
      }
    } else {
      // User canceled deletion
      Swal.fire("Cancelled", "Your recipe is safe!", "info");
    }
  } catch (error) {
    console.error("Error deleting recipe", error);
    Swal.fire("Error", "There was an error deleting the recipe.", "error");
  }
}

async function likeRecipe(recipeId: string) {
  try {
    const response = await fetch(`/api/recipe/${recipeId}/like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      fetchRecipes();
    } else {
      console.error("Error liking recipe");
    }
  } catch (error) {
    console.error("Error liking recipe:", error);
  }
}

async function addComment(recipeId: string, comment: string) {
  try {
    const response = await fetch(`/api/recipe/${recipeId}/comment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: comment }),
    });
    if (response.ok) {
      fetchRecipes();
    } else {
      console.error("Error adding comment");
    }
  } catch (error) {
    console.error("Error adding comment:", error);
  }
}

// document.addEventListener('DOMContentLoaded', fetchRecipes);
function handleLogOut() {
  document.cookie = "auth=; Max-Age=0; path=/";
  window.location.href = "../login/index.html";
}

function searchRecipes() {
  const searchInput = document.getElementById(
    "search-input"
  ) as HTMLInputElement;
  const searchValue = searchInput.value;
  if (searchValue === "") {
    fetchRecipes();
    return;
  }
  fetch(`/api/recipe/search?query=${searchValue}`)
    .then((response) => response.json())
    .then((recipes) => {
      displayRecipes(recipes);
    })
    .catch((error) => console.error("Error searching recipes", error));
}

function searchRecipesIngredients() {
  const searchInput = document.getElementById(
    "search-ingredients-input"
  ) as HTMLInputElement;
  const searchValue = searchInput.value;
  if (searchValue === "") {
    fetchRecipes();
    return;
  }
  fetch(`/api/recipe/searchIngredients?query=${searchValue}`)
    .then((response) => response.json())
    .then((recipes) => {
      displayRecipes(recipes);
    })
    .catch((error) => console.error("Error searching recipes", error));
}


function searchRecipesCategory(){
  try {
    const searchInput = document.getElementById("select-category") as HTMLSelectElement;
    
    const searchValue = searchInput.value;
    if (searchValue === "") {
      fetchRecipes();
      return;
    }
    
    fetch(`/api/recipe/searchCategory?query=${searchValue}`)
      .then((response) => response.json())
      .then((recipes) => {
        displayRecipes(recipes);
      })
      .catch((error) => console.error("Error searching recipes", error));

  } catch (error) {
    console.error("Error searching recipes", error);
    
  }
}


async function updateRecipe(recipeId: string) {
  await handleUpdateRecipe(recipeId);

}


async function handleUpdateRecipe(recipeId: string) {
  try {
    window.location.href = `../update-recipe/index.html?recipeId=${recipeId}`;
  } catch (error) {
    console.error("Error updating recipe:", error);
  }
}


async function getSelectCategoriesRecipe(){
  try {
    const selectCategories = document.getElementById("select-category") as HTMLSelectElement;
    selectCategories.innerHTML = "<option value=''>Select Category</option>";
    const request = await fetch("/api/recipe/get-all");
    const recipes = await request.json();

    const categories = new Set<string>();
    recipes.forEach((recipe) => categories.add(recipe.category));  
  
    categories.forEach(category => {
      if(category === "") return;
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      selectCategories.appendChild(option);
    });

  } catch (error) {
    console.error("Error getting categories", error);
  }
}