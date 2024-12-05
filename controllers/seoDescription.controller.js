const db = require("../models");
const fetch = require("node-fetch");
const Product = db.products;

exports.getSeoDescription = async (req, res) => {
  try {
    const { id } = req.params;

    // get product
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    // request to Groq
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.BEARER_KEY}`,
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content:
                "You will receive a product's name, category, price, and description. Generate a short, SEO-optimized description for the product. Use a professional and engaging tone. Respond with the description only, without any additional information or explanations.",
            },
            {
              role: "user",
              content: `
                Name: ${product.name}
                Category: ${product.category}
                Price: ${product.price_unit} USD
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

    const data = await response.json();

    const seoDescription = data.choices[0].message.content.trim();

    res.status(200).send(`
      <html>
        <body>
          <h1>${product.name}</h1>
          <p>${seoDescription}</p>
          <p>Category: ${product.category}</p>
          <p>Price: ${product.price_unit} USD</p>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("Error generating SEO description:", error.message);
    res
      .status(500)
      .json({
        message: "Error generating SEO description.",
        error: error.message,
      });
  }
};
