async function handleRegisterSubmit(event: any): Promise<void> {
  try {
    event.preventDefault();
    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;
    const firstName = form.firstName.value;
    const lastName = form.lastName.value;
    const profilePicture = form.profilePicture.files[0];
    console.log(email, password, firstName, lastName, profilePicture);
    await registerUser(email, password, firstName, lastName, profilePicture);
  } catch (error) {
    console.error(error);
  }
}

async function registerUser(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  profilePicture: any
): Promise<void> {
  try {
    console.log(email, password, firstName, lastName, profilePicture);

    const data = {
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
      profilePicture: profilePicture ?? null,
    };
    console.log(data);

    const response: any = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      console.log("Registration successful");

      // Upload profile picture
      const pictureFormData = new FormData();
      pictureFormData.append("profilePicture", profilePicture);

      const uploadResponse = await fetch("/api/users/uploadProfilePicture", {
        method: "POST",
        body: pictureFormData,
      });

      if (uploadResponse.ok) {
        console.log("Registration and profile picture upload successful");
        const { token } = await response.json();
        console.log(token);
        document.cookie = `auth=${token}; path=/`;
        window.location.href = "../recipe/index.html";
      } else {
        alert("Failed to upload profile picture");
      }
    } else {
      console.error("User already exists, please try again");
    }
  } catch (error) {
    console.error(error);
  }
}
