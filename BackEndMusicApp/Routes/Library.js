const express = require("express");
const router = express.Router();
const db = require("../Config/database");
const GenerateID = require("../Utils/generateID");
const verifyToken = require("../MiddleWare/varifyToken");

async function CheckID(id) {
  const result = await db.query(
    `SELECT * FROM public."PLAYLISTS" WHERE Playlist_ID = $1`,
    [id]
  );
  return result.rows.length > 0;
}

router.get("/", verifyToken, async (req, res) => {
  const userID = req.user.userID;
  try {
    const playlistResult = await db.query(
      `SELECT * FROM "LIBRARY" 
       JOIN "PLAYLISTS" ON "LIBRARY"."Library_ID" = "PLAYLISTS"."Libary_ID" 
       WHERE "LIBRARY"."Owner_ID" = $1`,
      [userID]
    );

    const artistResult = await db.query(
      `SELECT * FROM "LIBRARY" 
       JOIN "LIBRARY_ARTIST" ON "LIBRARY_ARTIST"."Library_ID" = "LIBRARY"."Library_ID"
       WHERE "LIBRARY"."Owner_ID" = $1`,
      [userID]
    );

    const playlist = playlistResult.rows || [];
    const artist = artistResult.rows || [];

    return res.json({ artist: artist, playlist: playlist });
  } catch (err) {
    console.error("Lỗi khi lấy thư viện:", err);
    return res.status(500).json({ message: "Lỗi máy chủ" });
  }
});

router.post("/addArtist", verifyToken, async (req, res) => {
  const { Artist_IDs } = req.body;
  try {
    const libraryResult = await db.query(
      `SELECT * FROM public."LIBRARY" WHERE "Owner_ID" = $1`,
      [req.user.userID]
    );
    const libraryID = libraryResult.rows[0].Library_ID;
    const insertPromises = Artist_IDs.map(async (artistID) => {
      const result = await db.query(
        `INSERT INTO public."LIBRARY_ARTIST"(
          "Artist_ID", "Library_ID", "Library_Artist_ID","Date_current")
          VALUES ($1, $2, $3,$4);`,
        [artistID, libraryID, GenerateID(),new Date().toISOString()]
      );

      if (result.rowCount === 0) {
        throw new Error("Thêm thất bại cho artist: " + artistID);
      }
    });

    await Promise.all(insertPromises);

    return res.status(201).json({ message: "Thêm thành công" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Lỗi máy chủ", error: err.message });
  }
});

router.post("/addPlaylist", verifyToken, async (req, res) => {
  try {
    const { Name_PlayList } = req.body;
    const userID = req.user.userID;

    const libraryResult = await db.query(
      `SELECT * FROM public."LIBRARY" WHERE "Owner_ID" = $1`,
      [userID]
    );
    if (libraryResult.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy thư viện của người dùng" });
    }

    const libraryID = libraryResult.rows[0].Library_ID;
    let Playlist_ID = GenerateID();
    let checkResult = await db.query(
      `SELECT * FROM public."PLAYLISTS" WHERE "Playlist_ID" = $1`,
      [Playlist_ID]
    );

    while (checkResult.rows.length > 0) {
      Playlist_ID = GenerateID();
      checkResult = await db.query(
        `SELECT * FROM public."PLAYLISTS" WHERE "Playlist_ID" = $1`,
        [Playlist_ID]
      );
    }

    const insertResult = await db.query(
      `INSERT INTO public."PLAYLISTS"(
	"Playlist_ID", "Name_Playlist", "Owner_ID", "Libary_ID","Date_current")
	VALUES ($1, $2, $3, $4,$5);`,
      [Playlist_ID, Name_PlayList, userID, libraryID,new Date().toISOString()]
    );

    if (insertResult.rowCount === 0) {
      return res.status(400).json({ message: "Thêm thất bại" });
    }

    return res
      .status(201)
      .json({ message: "Thêm playlist thành công", Playlist_ID });
  } catch (err) {
    console.error("Lỗi khi thêm playlist:", err);
    return res.status(500).json({ message: "Lỗi máy chủ" });
  }
});

router.delete("/artist/:id",verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const userID = req.user.userID;

    console.log(Date.now())
    console.log(userID)
    console.log(id)
    const libraryResult = await db.query(
      `SELECT * FROM public."LIBRARY" WHERE "Owner_ID" = $1`,
      [userID]
    );

    if (libraryResult.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy thư viện của người dùng" });
    }

    const libraryID = libraryResult.rows[0].Library_ID;

    const deleteResult = await db.query(
      `DELETE FROM public."LIBRARY_ARTIST"
       WHERE "Library_ID" = $1 AND "Artist_ID" = $2`,
      [libraryID, id]
    );

    if (deleteResult.rowCount === 0) {
      return res
        .status(404)
        .json({ message: "Nghệ sĩ không tồn tại trong thư viện hoặc đã bị xoá." });
    }

    return res.status(200).json({ message: "Nghệ sĩ đã được xoá khỏi thư viện thành công." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Lỗi máy chủ." });
  }
});


module.exports = router;
