const express = require("express");
const cors = require("cors");
const path = require("path");

const userRouter = require("./Routes/Users");
const trackRouter = require("./Routes/Tracks");
const artistRouter = require("./Routes/Artists");
const albums = require("./Routes/Albums");
const search = require("./Routes/Search");
const Library = require("./Routes/Library");
const AccountRouter = require("./Routes/Account");
const playlist = require("./Routes/Playlist");
const config = require("./Config/index");

const app = express();
const port = config.port;
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use("/songs", express.static(path.join(__dirname, "Song")));

app.get("/", (req, res) => {
  res.json({ name: "Hello" });
});

app.use("/users", userRouter);
app.use("/tracks", trackRouter);
app.use("/artists", artistRouter);
app.use("/albums", albums);
app.use("/search", search);
app.use("/library", Library);
app.use("/account", AccountRouter);
app.use("/playlist", playlist);

const fs = require("fs");

app.get("/api/song/:id", (req, res) => {
  const id = req.params.id;
  const requestedSongPath = path.join(__dirname, "Song", `${id}.mp3`);
  const defaultSongPath = path.join(__dirname, "Song", "default.mp3");

  fs.access(requestedSongPath, fs.constants.F_OK, (err) => {
    const songToSend = err ? defaultSongPath : requestedSongPath;
    res.sendFile(songToSend);
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
