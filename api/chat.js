export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Sadece POST istekleri kabul edilir."
    });
  }

  try {
    const { message } = req.body || {};

    if (!message) {
      return res.status(400).json({
        error: "message alanı gerekli."
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "GEMINI_API_KEY Vercel Environment Variables içinde bulunamadı."
      });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: message
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error:
          data.error?.message ||
          "Gemini API isteği başarısız oldu."
      });
    }

    const answer =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "AI yanıt oluşturamadı.";

    return res.status(200).json({
      answer: answer,
      reply: answer
    });

  } catch (error) {
    return res.status(500).json({
      error: "Sunucu hatası.",
      details: error.message
    });
  }
}
