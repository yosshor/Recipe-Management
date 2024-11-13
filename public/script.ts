document.addEventListener("DOMContentLoaded", () => {
  const content = document.getElementById("content");
  const postList = document.getElementById("post-list");
  const getPostsButton = document.getElementById("get-posts");
  const createPostButton = document.getElementById("create-post");
  const signInButton = document.getElementById("sign-in");
  const logOutButton = document.getElementById("log-out");
  const showSignInButton = document.getElementById("show-sign-in");
  const showRegisterButton = document.getElementById("show-register");
  const signInForm = document.getElementById("sign-in-form");
  const registerForm = document.getElementById("register-form");
  const registerButton = document.getElementById("register");

  if (!signInButton || !logOutButton || !content) {
    console.error('One or more elements are missing in the DOM');
    return;
  }

  console.log('Elements found:', { signInButton, logOutButton, content });

  showSignInButton.addEventListener('click', () => {
    signInForm.style.display = 'block';
    registerForm.style.display = 'none';
  });

  showRegisterButton.addEventListener('click', () => {
    registerForm.style.display = 'block';
    signInForm.style.display = 'none';
  });

  signInButton.addEventListener('click', async () => {
    console.log('Sign-in button clicked');
    const usernameElement = document.getElementById('sign-in-username') as HTMLInputElement;
    const passwordElement = document.getElementById('sign-in-password') as HTMLInputElement;

    if (!usernameElement || !passwordElement) {
      console.error('Username or password input element not found');
      return;
    }

    const username = usernameElement.value;
    const password = passwordElement.value;

    console.log('Attempting to sign in with:', { username, password });

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    if (response.ok) {
      const token = await response.text();
      document.cookie = `auth=${token}; path=/`;
      console.log('Sign-in successful, token set in cookie');
      signInForm.style.display = 'none';
      logOutButton.style.display = 'inline-block';
      content.style.display = 'block';
    } else {
      console.error('Sign-in failed');
      alert('Sign-in failed');
    }
  });

  logOutButton.addEventListener('click', () => {
    console.log('Log-out button clicked');
    document.cookie = 'auth=; Max-Age=0; path=/';
    signInForm.style.display = 'none';
    registerForm.style.display = 'none';
    showSignInButton.style.display = 'inline-block';
    showRegisterButton.style.display = 'inline-block';
    logOutButton.style.display = 'none';
    content.style.display = 'none';
  });

  registerButton.addEventListener('click', async (event) => {
    event.preventDefault();
    console.log('Register button clicked');
    const usernameElement = document.getElementById('register-username') as HTMLInputElement;
    const emailElement = document.getElementById('register-email') as HTMLInputElement;
    const passwordElement = document.getElementById('register-password') as HTMLInputElement;
    const firstNameElement = document.getElementById('register-firstname') as HTMLInputElement;
    const lastNameElement = document.getElementById('register-lastname') as HTMLInputElement;
    const bioElement = document.getElementById('register-bio') as HTMLInputElement;
    const profilePictureElement = document.getElementById('register-profile-picture') as HTMLInputElement;

    if (!usernameElement || !emailElement || !passwordElement) {
      console.error('Username, email, or password input element not found');
      return;
    }

    const username = usernameElement.value;
    const email = emailElement.value;
    const password = passwordElement.value;
    const firstName = firstNameElement.value;
    const lastName = lastNameElement.value;
    const bio = bioElement.value;
    const profilePicture = profilePictureElement.files ? profilePictureElement.files[0] : null;

    console.log('Attempting to register with:', { username, email, password, firstName, lastName, bio, profilePicture });

    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('bio', bio);
    if (profilePicture) {
      formData.append('profilePicture', profilePicture);
    }

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      alert('Registration successful');
      registerForm.style.display = 'none';
      signInForm.style.display = 'block';
    } else {
      console.error('Registration failed');
      alert('Registration failed');
    }
  });

  const fetchPosts = async () => {
    try {
      const token = getCookie('auth');
      const response = await fetch("/api/posts", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      const posts = await response.json();
      console.log('Fetched posts:', posts);
      if (Array.isArray(posts)) {
        displayPosts(posts);
      } else {
        console.error("Error: Posts response is not an array", posts);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const displayPosts = (posts) => {
    if (postList) {
      postList.innerHTML = "";
    }
    posts.forEach((post) => {
      const postElement = document.createElement("div");
      postElement.classList.add("post");
      postElement.innerHTML = `
          <h3>${post.userId.username}</h3>
          <p>${post.content}</p>
          ${post.image ? `<img src="${post.image}" alt="Post Image">` : ""}
          <div class="actions">
            <button onclick="likePost('${post._id}')">Like</button>
            <button onclick="commentOnPost('${post._id}')">Comment</button>
          </div>
          <div class="comments">
            ${post.comments
              .map(
                (comment) =>
                  `<p>${comment.userId.username}: ${comment.content}</p>`
              )
              .join("")}
          </div>
        `;
      if (postList) {
        postList.appendChild(postElement);
      }
    });
  };

  (window as any).likePost = async (postId) => {
    try {
      const token = getCookie('auth');
      await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      fetchPosts();
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  (window as any).commentOnPost = async (postId) => {
    const comment = prompt("Enter your comment:");
    if (!comment) return;

    try {
      const token = getCookie('auth');
      await fetch(`/api/posts/${postId}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ content: comment }),
      });
      fetchPosts();
    } catch (error) {
      console.error("Error commenting on post:", error);
    }
  };

  if (createPostButton) {
    createPostButton.addEventListener("click", async () => {
      const postContentElement = document.getElementById("post-content");
      if (!postContentElement) {
        console.error("Post content element not found");
        return;
      }
      const content = (postContentElement as HTMLInputElement).value;
      const postImageElement = document.getElementById(
        "post-image"
      ) as HTMLInputElement;
      const image =
        postImageElement && postImageElement.files
          ? postImageElement.files[0]
          : null;

      const formData = new FormData();
      formData.append("content", content);
      if (image) {
        formData.append("image", image);
      }

      try {
        const token = getCookie('auth');
        await fetch("/api/posts", {
          method: "POST",
          headers: {
            Authorization: "Bearer " + token,
          },
          body: formData,
        });
        fetchPosts();
      } catch (error) {
        console.error("Error creating post:", error);
      }
    });
  }
});

function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/';
}

function getCookie(name) {
  return document.cookie.split('; ').reduce((r, v) => {
    const parts = v.split('=');
    return parts[0] === name ? decodeURIComponent(parts[1]) : r;
  }, '');
}