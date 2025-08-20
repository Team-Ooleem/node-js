import pool from "../config/db.ts";
import { Readable } from "stream";
import type { Request, Response } from "express";

const PLACEHOLDER_IMG =
  process.env.PLACEHOLDER_IMG || "http://localhost:3000/placeholder.png"; // 임시, 실제론 안들어가있음

// /일때가 필요할것인가?
// app.get("/", async (req, res) => {
//   const [rows] = await pool.query("SELECT NOW()");
//   res.json(rows);
// });

//

function isImageContent(content: any) {
  return !!content && content.toLowerCase().startsWith("image/");
} // 아마 string이 맞겠지?

export const getImages = async (req: Request, res: Response) => {
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
};

export const getSearchResults = async (req: Request, res: Response) => {
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
};

export const getAutosearchResults = async (req: Request, res: Response) => {
  try {
    const keyword = req.query.keyword || "";

    const [rows] = await pool.query(
      `SELECT book_id as id, display_title as title, authors as author, cover_image_url as coverImage, list_price as price FROM new_view WHERE display_title LIKE ? LIMIT 10`,
      [`%${keyword}%`]
    );

    res.json({
      books: rows,
      keyword: keyword,
    });
  } catch (error) {
    console.error("Error fetching autocomplete:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const insertCart = async (req: Request, res: Response) => {
  const { bookId, quantity } = req.body;
  console.log(req);
  const userId = parseInt(req.body.userId);
  try {
    await pool.query(
      "INSERT INTO cart (user_id, book_id, quantity) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + ?",
      [userId, bookId, quantity, quantity]
    );
    res.status(201).json({ message: "장바구니에 추가되었습니다." });
  } catch (err) {
    res.status(500).json({ message: "서버 오류" });
  }
};

export const getCartItems = async (req: Request, res: Response) => {
  const userId = req.query.user_id;
  console.log(userId);

  try {
    const [rows] = await pool.query(
      `SELECT 
    c.cart_id,
    c.user_id,
    c.book_id,
    c.quantity,
    c.added_at,
    c.updated_at,
    b.display_title,
    b.subtitle,
    b.list_price,
    b.cover_image_url
FROM cart AS c
JOIN new_view AS b
    ON c.book_id = b.book_id
WHERE c.user_id = ?;`,
      [userId]
    );
    console.log(rows);
    res.json({ carts: rows });
  } catch (err) {
    res.status(500).json({ message: "장바구니 정보를 불러올 수 없습니다." });
  }
};
