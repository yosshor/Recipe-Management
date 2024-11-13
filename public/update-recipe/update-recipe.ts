
async function addRecipeImage(image: File, title: string,
                              token: string, response: any): Promise<void> {
  const recipeId = response._id;
  const imageFormData = new FormData();
  imageFormData.append("image", image);
  imageFormData.append("recipeId", recipeId);
  console.log(imageFormData);
  const imageResponse = await fetch(`/api/recipe/uploadRecipePicture?recipeId=${recipeId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: imageFormData,
  });
  if (imageResponse.ok) {
    console.log("Image uploaded");
  } else {
    console.error(imageResponse);
  }
}


function getCookie(name): string {
  return document.cookie.split("; ").reduce((r, v) => {
    const parts = v.split("=");
    return parts[0] === name ? decodeURIComponent(parts[1]) : r;
  }, "");
}


function handleLogOut():void {
  document.cookie = "auth=; Max-Age=0; path=/";
  window.location.href = "../login/index.html";
}


document.addEventListener("DOMContentLoaded", () => {
  const fileInputDiv = document.getElementById("file-input") as HTMLDivElement;
  const urlInputDiv = document.getElementById("url-input") as HTMLDivElement;
  const imageOptionRadios = document.querySelectorAll(
    'input[name="imageOption"]'
  );

  imageOptionRadios.forEach((radio:any) => {
    radio.addEventListener("change", (event) => {
      const eventTarget = event.target as HTMLInputElement
      if (eventTarget.value === "file") {
        fileInputDiv.style.display = "block";
        urlInputDiv.style.display = "none";
        const urlInput = document.getElementById("image_url") as HTMLInputElement;
        console.dir(urlInput);
        urlInput.value = "";
      } else {
        fileInputDiv.style.display = "none";
        const fileInput = fileInputDiv.querySelector("input");
        if (fileInput) {
          fileInput.value = "";
        }
        urlInputDiv.style.display = "block";
      }
    });
  });
});


function getRecipeIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("recipeId");
}

const recipeId = getRecipeIdFromUrl();
if (recipeId) {
  fetchAndFillRecipe(recipeId); 
}
else{
  console.error("Recipe ID not found in URL");
}
async function handleSubmitRecipes(event: any): Promise<void> {
  try {
    event.preventDefault();
    const form = event.target;
    const title = form.title.value;
    const instructions = form.instructions.value;
    const ingredients = form.ingredients.value;
    const cookingTime = form.cooking_time.value;
    const servingSize = form.serve_size.value;
    const category = form.category.value;
    const image_url = form.image_url.value;
    const image = form.image.files[0];
    await updateRecipeData(recipeId as string,title,instructions,ingredients,cookingTime,servingSize,category,image_url,image);

  } catch (error) {
    console.error(error);
  }
}

async function fetchAndFillRecipe(recipeId:string): Promise<void> {
  try {

    // Fetch recipe data from server
    const recipeDetails = await fetch(`/api/recipe/get-recipe-details/${recipeId}`, {
      method:"GET",
      headers: {
        "Content-Type": "application/json",
      },});
    const recipe = await recipeDetails.json();

    // Set values in form fields
    (document.getElementById("title") as HTMLInputElement).value = recipe.title;
    (document.getElementById("instructions") as HTMLInputElement).value = recipe.instructions;
    (document.getElementById("ingredients") as HTMLInputElement).value = recipe.ingredients;
    (document.getElementById("cooking_time") as HTMLInputElement).value = recipe.cookingTime;
    (document.getElementById("serve_size") as HTMLInputElement).value = recipe.servingSize;
    (document.getElementById("category") as HTMLInputElement).value = recipe.category;

    // Handle image field
    if (recipe.image) {
      (document.querySelector('input[name="imageOption"][value="url"]') as HTMLInputElement).checked = true;
      (document.getElementById("url-input") as HTMLInputElement).style.display = "block";
      (document.getElementById("file-input")as HTMLInputElement).style.display = "none";
      (document.getElementById("image_url")as HTMLInputElement).value = recipe.image;
    } else {
      (document.querySelector('input[name="imageOption"][value="file"]')as HTMLInputElement).checked = true;
      (document.getElementById("file-input")as HTMLInputElement).style.display = "block";
      (document.getElementById("url-input") as HTMLInputElement).style.display = "none";
    }
  } catch (error) {
    console.error("Error fetching recipe data:", error);
  }
}

async function updateRecipeData(
  recipeId: string,
  title: string,
  instructions: string,
  ingredients: string,
  cookingTime: number,
  servingSize: number,
  category: string,
  imageUrl: string,
  image: File
): Promise<void> {
  try {
    const formData = new FormData();
    formData.append("recipeId", recipeId);
    formData.append("title", title);
    formData.append("instructions", instructions);
    formData.append("ingredients", ingredients);
    formData.append("cookingTime", cookingTime.toString());
    formData.append("servingSize", servingSize.toString());
    formData.append("category", category);
    formData.append("image", imageUrl ?? null);

    const dataStr = JSON.stringify(Object.fromEntries(formData.entries()));
    const token:string = getCookie("auth");
    // console.log(token);
    const response = await fetch("/api/recipe/update-recipe", {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: dataStr,
    });
    if (response.ok) {
      console.log("recipe added");
      if (image) {
        const res = await response.json();
        await addRecipeImage(image, title, token, res);
      }
      window.location.href = "../show-all-recipes/index.html";
    } else {
      alert("Error creating post");
    }
  } catch (error) {
    console.error(error);
  }
}