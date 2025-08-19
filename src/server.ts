import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import dotenv from "dotenv";
import { Readable } from "stream";

dotenv.config();

const app = express();
const port = 4000;
const PLACEHOLDER_IMG =
  process.env.PLACEHOLDER_IMG || "http://localhost:3000/placeholder.png"; // 임시, 실제론 안들어가있음

app.use(cors());

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME || "clone_coding_dummy",
  waitForConnections: true, // default가 true긴 함
  connectionLimit: 10, // 이거도 default가 10이긴 함
});

// /일때가 필요할것인가?
app.get("/", async (req, res) => {
  const [rows] = await pool.query("SELECT NOW()");
  res.json(rows);
});

//

function isImageContent(content: any) {
  return !!content && content.toLowerCase().startsWith("image/");
} // 아마 string이 맞겠지?

app.get("/api/img", async (req, res) => {
  const u = req.query.u as string | undefined;
  if (!u) return res.status(400).json({ ok: false, error: "NO_URL" });

  try {
    // URL 형식 검증
    new URL(u);
  } catch {
    return res.redirect(307, PLACEHOLDER_IMG);
  }

  try {
    const upstream = await fetch(u, {
      headers: {
        Accept: "image/avif,image/webp,image/*,*/*;q=0.8",
        "Accept-Language": "ko-KR,ko;q=0.9,en;q=0.8",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome Safari",
        Referer: "https://www.kyobobook.co.kr/",
        "Cache-Control": "no-cache",
      },
      redirect: "follow",
      cache: "no-store",
    });

    if (!upstream.ok) {
      return res.redirect(307, PLACEHOLDER_IMG);
    }

    const content = upstream.headers.get("content-type");
    if (!isImageContent(content)) {
      return res.redirect(307, PLACEHOLDER_IMG);
    }

    // 스트리밍 전달
    res.setHeader("Content-Type", content!);
    // 캐시 정책(원하면 조정)
    res.setHeader(
      "Cache-Control",
      "public, max-age=86400, s-maxage=86400, stale-while-revalidate=86400"
    );

    if (upstream.body) {
      // Node.js ReadableStream으로 변환
      const nodeStream = Readable.fromWeb(upstream.body as any);
      nodeStream.pipe(res);
    } else {
      return res.redirect(307, PLACEHOLDER_IMG);
    }
  } catch (e) {
    console.error("[/api/img] error:", e);
    return res.redirect(307, PLACEHOLDER_IMG);
  }
});

app.get("/search", async (req, res) => {
  try {
    // 여기서 이제 쿼리문으로 뭐가 올수있는지 정해놔야함
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.len as string) || 20;
    const keyword = req.query.keyword || "";
    const offset = (page - 1) * limit;
    //console.log("잘뜸", keyword);

    const [rows] = await pool.query(
      "SELECT * FROM new_view WHERE display_title LIKE ? LIMIT ? OFFSET ?",
      [`%${keyword}%`, limit, offset]
    );

    const [countResult] = await pool.query(
      "SELECT COUNT(*) as count FROM new_view WHERE display_title LIKE ?",
      [`%${keyword}%`]
    );
    const totalCount = (countResult as any)[0].count;
    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      books: rows,
      currentPage: page,
      totalPages: totalPages,
      totalCount: totalCount,
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
