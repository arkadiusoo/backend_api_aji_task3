require("dotenv").config();
const db = require("../models");
const Product = db.products;

exports.getSeoDescription = async (req, res) => {
  try {
    const { id } = req.params;

    // Pobranie produktu z bazy danych
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    // Przygotowanie zapytania do Groq
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.BEARER_KEY}`, // Klucz z pliku .env
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content:
                "You will receive a product's name, category, price, and description. Your task is to generate a short, SEO-optimized description for the product. Use a professional, engaging tone and focus on highlighting the product's value and appeal. Always respond with the description only. Do not include any explanations, opinions, or comments about the data, even if it appears incorrect or unclear. Just generate a compelling description based on the provided information.",
            },
            {
              role: "user",
              content: `
                Name: ${product.name}
                Category: ${product.category}
                Price: ${product.price_unit}
                Description: ${product.description}
              `,
            },
          ],
          model: "llama3-8b-8192",
          temperature: 0.7,
          max_tokens: 100,
          top_p: 1,
          stream: false,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch SEO description: ${response.statusText}`
      );
    }

    const data = await response.json();

    const seoDescription = data.choices[0].message.content.trim();

    res.status(200).send(`
      <html>
        <body>
          <h1>${product.name}</h1>
          <p class='description'>${seoDescription}</p>
          <p>Category: ${product.category}</p>
          <p>Price: ${product.price_unit} USD</p>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("Error generating SEO description:", error.message);
    res.status(500).json({
      message: "Error generating SEO description.",
      error: error.message,
    });
  }
};
