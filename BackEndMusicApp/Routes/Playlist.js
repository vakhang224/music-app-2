const express = require("express");
const db = require("../Config/database");
const router = express.Router();
const varifyToken = require("../MiddleWare/varifyToken");
const verifyToken = require("../MiddleWare/varifyToken");
const GenerateID = require("../Utils/generateID");
const changeText = require("../Utils/chageText")

router.get("/", async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM public."PLAYLISTS" `);
    if (result.rows.length == 0) {
      res.status(404).json({ message: "Không có dữ liệu" });
    }
    res.json({ data: result.rows });
  } catch (err) {
    console.error(err);
  }
});

router.get("/:id/tracks", verifyToken, async (req, res) => {
  const playlistId = req.params.id;

  try {
    const result = await db.query(
      `
SELECT t."Track_ID",t."URL_Song",tp."Data_current"
      FROM public."TRACKS" t
      JOIN public."TRACKS_PLAYLIST" tp ON tp."Track_ID" = t."Track_ID"
	  JOIN public."PLAYLISTS" ON "PLAYLISTS"."Playlist_ID" = tp."Playlist_ID"
	  WHERE "PLAYLISTS"."Playlist_ID" = $1
      `,
      [playlistId]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Không có bài hát nào trong playlist này." });
    }

    return res.status(200).json({ data: result.rows });
  } catch (err) {
    console.error("Error fetching tracks in playlist:", err);
    return res.status(500).json({ message: "Lỗi máy chủ." });
  }
});

router.post("/:id/tracks", verifyToken, async (req, res) => {
  const playlistId = req.params.id;
  const tracks = req.body.tracks;
  console.log(tracks[0].id)
  try {
    const { rows: existingTracks } = await db.query('SELECT "Track_ID" FROM "TRACKS"');
    const existingTrackIds = existingTracks.map((track) => track.Track_ID);
    for (const track of tracks) {
      if (!existingTrackIds.includes(track.id)) {
        await db.query(
          'INSERT INTO "TRACKS" ("Track_ID", "URL_Song") VALUES ($1, $2)',
          [track.id, `/Song/${track.id}.mp3`]
        );
      }
    }

    const { rows: existingPlaylistTracks } = await db.query(
      'SELECT "Track_ID" FROM "TRACKS_PLAYLIST" WHERE "Playlist_ID" = $1',
      [playlistId]
    );

    const existingTrackInPlaylist = existingPlaylistTracks.map((item) => item.Track_ID);
    for (const track of tracks) {
      if (!existingTrackInPlaylist.includes(track.id)) {
        await db.query(
          'INSERT INTO "TRACKS_PLAYLIST" ("Playlist_ID", "Playlist_Track_ID", "Track_ID","Data_current") VALUES ($1, $2, $3,$4)',
          [playlistId, GenerateID(), track.id,new Date().toISOString()]
        );
      }
    }

    res.status(200).json({ message: "Thêm track vào playlist thành công." });

  } catch (error) {
    console.error("Lỗi khi thêm track:", error);
    res.status(500).json({ message: "Lỗi server khi thêm track vào playlist." });
  }
});


router.get("/:id", verifyToken, async (req, res) => {
  const id = req.params.id;
  const userID = req.user.userID;
  console.log(userID);
  try {
    const result = await db.query(
      `SELECT * FROM public."PLAYLISTS" WHERE "Playlist_ID" = $1 AND "Owner_ID"= $2`,
      [id, userID]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Playlist không tồn tại." });
    }

    res.status(200).json({ playlist: result.rows[0] });
  } catch (err) {
    console.error("Lỗi khi lấy chi tiết playlist:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
});

router.post("/", varifyToken, (req, res) => {
  res.json("create artist");
});

router.put("/:id", varifyToken, (req, res) => {
  res.json("edit artist");
});

router.delete("/:id", varifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    console.log("DELETE /playlists/:id called with", req.params.id);
    await db.query(
      `DELETE FROM public."TRACKS_PLAYLIST" WHERE "Playlist_ID" = $1`,
      [id]
    );

    const deletePlaylist = await db.query(
      `DELETE FROM public."PLAYLISTS" WHERE "Playlist_ID" = $1 RETURNING *`,
      [id]
    );

    if (deletePlaylist.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Playlist không tồn tại hoặc đã bị xoá." });
    }

    return res
      .status(200)
      .json({ message: "Playlist đã được xoá thành công." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Lỗi máy chủ." });
  }
});

router.delete("/:id/tracks", verifyToken, async (req, res) => {
  const playListID = req.params.id;
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: "No track IDs provided." });
  }

  try {
    for (const trackID of ids) {
      const result = await db.query(
        'DELETE FROM public."TRACKS_PLAYLIST" WHERE "Track_ID" = $1 AND "Playlist_ID" = $2',
        [trackID, playListID]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ message: `Failed to delete track ID: ${trackID}` });
      }
    }

    res.status(200).json({ message: "Tracks deleted successfully." });
  } catch (err) {
    console.error("Error deleting tracks:", err);
    res.status(500).json({ message: "Internal server error." });
  }
});


module.exports = router;
