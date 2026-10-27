// Hàm máy chủ (Vercel Serverless Function). API key chỉ nằm ở biến môi trường, KHÔNG nằm trong trình duyệt.
// Cần đặt biến môi trường: GEMINI_API_KEY  (key từ Google AI Studio; tùy chọn: GEMINI_MODEL)
// Chưa đặt key => trả về { ai:false } và web tự chạy chế độ demo.
// TUYỆT ĐỐI không dán key vào file này hay index.html.

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const HAN_MUC = 15;         // số lượt / phút / mỗi IP (mỗi lần bấm tạo = 3 lượt) (bộ giới hạn đơn giản, chỉ trong bộ nhớ)
const lanGoi = new Map();

function biChan(ip) {
  const now = Date.now();
  const arr = (lanGoi.get(ip) || []).filter((t) => now - t < 60000);
  arr.push(now);
  lanGoi.set(ip, arr);
  if (lanGoi.size > 5000) lanGoi.clear();
  return arr.length > HAN_MUC;
}

const cat = (v, n) => String(v == null ? "" : v).replace(/[<>]/g, "").replace(/\s+/g, " ").trim().slice(0, n);

const PHONG_CACH = {
  thanthien: "thân thiện, gần gũi",
  chuyennghiep: "chuyên nghiệp, lịch sự",
  haihuoc: "hài hước, vui vẻ",
  sangtrong: "sang trọng, tinh tế",
  khuyenmai: "khuyến mãi gấp, tạo cảm giác khẩn trương",
};
const NEN_TANG = { facebook: "Facebook", zalo: "Zalo", tiktok: "TikTok (rất ngắn)", instagram: "Instagram", cho: "chợ online" };

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  const key = process.env.GEMINI_API_KEY;

  if (req.method === "GET") return res.status(200).json({ ai: Boolean(key) });
  if (req.method !== "POST") return res.status(405).json({ ok: false });
  if (!key) return res.status(200).json({ ok: false, demo: true });

  const ip = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "unknown";
  if (biChan(ip)) return res.status(429).json({ ok: false, loi: "Bạn thao tác quá nhanh, thử lại sau 1 phút." });

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  const d = body.data || {};
  const dl = {
    ten: cat(d.ten, 80), sp: cat(d.sp, 300), gia: cat(d.gia, 60),
    uudai: cat(d.uudai, 120), kh: cat(d.kh, 120),
    nentang: NEN_TANG[d.nentang] ? d.nentang : "facebook",
    phongcach: PHONG_CACH[d.phongcach] ? d.phongcach : "thanthien",
  };
  if (!dl.sp) return res.status(400).json({ ok: false, loi: "Thiếu sản phẩm" });

  const prompt =
    "Viết bài quảng cáo bằng tiếng Việt cho cửa hàng nhỏ. Chỉ dùng thông tin dưới đây, KHÔNG bịa thêm giá, ưu đãi, chứng nhận, số liệu hay cam kết. " +
    "Không dùng các từ tuyệt đối như \"số 1\", \"tốt nhất\", \"cam kết 100%\".\n" +
    `Tên cửa hàng: ${dl.ten || "(không có)"}\nSản phẩm/dịch vụ: ${dl.sp}\nGiá: ${dl.gia || "(không có)"}\n` +
    `Ưu đãi: ${dl.uudai || "(không có)"}\nKhách hàng mục tiêu: ${dl.kh || "(không có)"}\n` +
    `Nền tảng: ${NEN_TANG[dl.nentang]}\nPhong cách: ${PHONG_CACH[dl.phongcach]}\nBiến thể số: ${Number(body.variant) || 0} (hãy viết khác các lần trước)\n\n` +
    'Chỉ trả về JSON hợp lệ, không thêm chữ nào khác, dạng: {"tieude":"...","noidung":"...","cta":"...","hashtag":"#A #B #C"}';

  try {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 20000);
    const r = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/" + encodeURIComponent(MODEL) + ":generateContent",
      {
        method: "POST",
        headers: { "content-type": "application/json", "x-goog-api-key": key },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 900, temperature: 0.9, responseMimeType: "application/json" },
        }),
        signal: ctl.signal,
      }
    );
    clearTimeout(timer);
    if (!r.ok) return res.status(502).json({ ok: false });
    const j = await r.json();
    const text = (j.candidates && j.candidates[0] && j.candidates[0].content && j.candidates[0].content.parts &&
      j.candidates[0].content.parts.map((p) => p.text || "").join("")) || "";
    const m = text.match(/\{[\s\S]*\}/);
    if (!m) return res.status(502).json({ ok: false });
    const o = JSON.parse(m[0]);
    return res.status(200).json({
      ok: true,
      result: { tieude: cat(o.tieude, 200), noidung: String(o.noidung || "").slice(0, 3000), cta: cat(o.cta, 300), hashtag: cat(o.hashtag, 300) },
    });
  } catch (e) {
    return res.status(502).json({ ok: false });
  }
};
