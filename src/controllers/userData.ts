import { getUserIdAndData } from "./uploadPictureController";

export default async function getUserData(req: any, res: any): Promise<void> {
  try {
    const { userId, userData } = getUserIdAndData(req);
    res.status(200).json({ userId: userId, userData: userData });
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
}
