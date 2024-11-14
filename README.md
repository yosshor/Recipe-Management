# Recipe Management System

## Overview

The Recipe Management System is a web application that allows users to manage their recipes. Users can register, log in, and manage their profiles, including uploading avatars. The system supports CRUD operations for recipes, advanced search and filtering options, and various UI/UX features to enhance the user experience.

## Features

### User System

- **User Registration and Authentication**: Users can register and log in to the system.
- **Profile Management**: Users can manage their profiles, including uploading avatars.
- **JWT Authentication**: Secure authentication using JSON Web Tokens (JWT).
- **Secure Password Handling**: Passwords are securely hashed and stored using bcrypt.

### Recipe Management

- **CRUD Operations**: Create, read, update, and delete recipes.
- **Recipe Properties**:
  - Title
  - Ingredients list
  - Step-by-step instructions
  - Cooking time
  - Serving size
  - Category/tags
  - Image upload support
- **Input Validation**: Ensures that all required fields are filled out correctly.
- **Data Persistence**: Recipes are stored in a database.

### Search and Filtering

- **Search by Recipe Name**: Users can search for recipes by name.
- **Search by Ingredients**: Users can search for recipes by ingredients.
- **Category Filtering**: Users can filter recipes by category.
- **Cooking Time Filtering**: Users can filter recipes by cooking time.


### Additional Features

- **UI/UX Features**:
  - Responsive design
  - Image upload or image url
  - Error handling
  - Clean interface design
  - User feedback systems using SweetAlert

- **Recipe Sharing**:
  - Public/Private Recipe Toggle: Users can choose to make their recipes public or private.
  - Public Recipe Browsing: Users can browse public recipes.
  - Like Recipes: Users can like recipes.
  - Comment on Recipes: Users can add comments to recipes.

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/yosshor/Recipe-Management.git 