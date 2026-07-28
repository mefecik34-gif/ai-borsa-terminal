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
