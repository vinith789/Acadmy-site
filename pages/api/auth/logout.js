export default function handler(req, res) {
  if (req.method === "POST") {
    // Clear the token cookie
    res.setHeader("Set-Cookie", "token=; HttpOnly; Path=/; Max-Age=0");
    return res.status(200).json({ message: "Logged out" });
  } else {
    return res.status(405).end();
  }
}
