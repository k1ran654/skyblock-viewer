const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(cors());

app.get("/api/uuid/:ign", async (req, res) => {
  try {
    const ign = req.params.ign;
    const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${ign}`);
    if (!response.ok) return res.status(404).json({ error: "Player not found" });
    const data = await response.json();
    res.json(data);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/skyblock/:uuid", async (req, res) => {
  const uuid = req.params.uuid;
  const url = `https://sky.shiiyu.moe/api/v1/profiles/${uuid}`;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9",
        "Referer": "https://sky.shiiyu.moe/"
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch SkyBlock profiles" });
    }

    const data = await response.json();

    console.log("SkyCrypt API response:", JSON.stringify(data, null, 2)); // log prettified JSON to terminal

    if (!data || !data.profiles || data.profiles.length === 0) {
      return res.status(404).json({ error: "No SkyBlock profiles found" });
    }

    res.json(data);
  } catch (err) {
    console.error("🔥 Backend error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});