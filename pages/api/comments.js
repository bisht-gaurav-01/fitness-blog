import commentsData from "../../data/comments.json";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function handler(req, res) {
  const { slug } = req.query;
  await wait(600);
  if (!slug || typeof slug !== "string") {
    return res.status(400).json({ error: "Missing slug" });
  }
  const comments = commentsData[slug] || [];
  return res.status(200).json({ comments });
}
