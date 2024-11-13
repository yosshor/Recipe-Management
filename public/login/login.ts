
async function handleSubmit(event: any): Promise<void> {
  try {
    event.preventDefault();
    const form = event.target;
    const username = form.username.value;
    const email = form.email.value;
    const password = form.password.value;
    console.log(username, email, password);
    await login(username, email, password);
  } catch (error) {
    console.error(error);
  }
}

async function login(username: string, email:string, password: string): Promise<any | null> {
  try {
    console.log(JSON.stringify({ username:username, email:email, password:password }))
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username:username, email:email, password:password }),
    });
    if (response.ok) {
      const { token } = await response.json();
      console.log(token);
      document.cookie = `auth=${token}; path=/`;
      window.location.href = "../show-all-recipes/index.html";
    } else {
      console.log(response);
      alert("Sign-in failed");
    }
  } catch (error) {
    console.error(error);
  }
}


