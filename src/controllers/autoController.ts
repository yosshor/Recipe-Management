import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt1 from 'jwt-simple';
import jwt from "jsonwebtoken";


const secret = ():string => { return process.env.SECRET as string };



export const register = async (req: any, res: any) => {
  try {
    
    const { username, email, password, firstName, lastName } = req.body;
    const profilePicture = req.file ? req.file.path : null;
    console.log(profilePicture, username, email, password, firstName, lastName);

    const findUser = await User.findOne({ email });
    if (findUser) {
      return res.status(400).send({ error: "User already exists" });
    }

    const user = new User({
      username,
      email,
      password: password,
      firstName,
      lastName,
      profilePicture,
    });


    //jwt
    const payload = {
      userId: user._id,
      email: user.email,
      name: user.firstName + " " + user.lastName, 
      role: "User",
    };

    const payloadJWT = jwt1.encode(payload, secret());
    console.log(payloadJWT);

    await user.save();
    res.cookie("userRecipe",payloadJWT, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 1,
    });

    const token = jwt.sign({ id: user._id }, "your_jwt_secret", {
      expiresIn: "12h",
    });
    console.log("Token generated:", token);
    res.json({ token });

  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export async function login(req: any, res: any): Promise<void> {
  try {
    console.log("Login function called");
    console.log("Request body:", req.body);

    // can read the request cookie
    console.log("Request cookie:", req.cookies);

    const { username, email, password } = req.body;
    console.log("Parsed request body:", { username, email, password });

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      console.log("User not found");
      return res.status(400).json({ error: "User not found" });
    }
    console.log("User found:", user);
    console.log("Input password:", req.body.password);
    console.log("Stored password:", user.password);
    const isMatch = await bcrypt.compare(
      req.body.password,
      user.password.trim()
    );
    console.log("Password match result:", isMatch);

    if (!isMatch) {
      console.log("Invalid credentials");
      return res.status(400).json({ error: "Invalid credentials" });
    }


       //jwt
       const payload = {
        userId: user._id,
        email: user.email,
        name: user.firstName + " " + user.lastName, 
        role: "User",
      };
      const payloadJWT = jwt1.encode(payload, secret());
      console.log(payloadJWT);
  
    res.cookie("userRecipe", payloadJWT, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 1 ,
    });
    const token = jwt.sign({ id: user._id }, "your_jwt_secret", {
      expiresIn: "12h",
    });
    console.log("Token generated:", token);
    res.json({ token });
  } catch (err: any) {
    console.log("Error:", err.message);
    res.status(500).json({ error: err.message });
  }
}
