module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== "GET") return res.status(405).end();

  try {
    // Récupérer tous les produits de la boutique Printful
    const r = await fetch("https://api.printful.com/store/products", {
      headers: { Authorization: `Bearer ${process.env.PRINTFUL_TOKEN}` }
    });
    const data = await r.json();

    // Pour chaque produit, récupérer les détails (photos, variantes, prix)
    const products = await Promise.all(data.result.map(async (p) => {
      const r2 = await fetch(`https://api.printful.com/store/products/${p.id}`, {
        headers: { Authorization: `Bearer ${process.env.PRINTFUL_TOKEN}` }
      });
      const detail = await r2.json();
      const product = detail.result.sync_product;
      const variants = detail.result.sync_variants;

      return {
        id: product.id,
        name: product.name,
        image: product.thumbnail_url,
        variants: variants.map(v => ({
          id: v.id,
          name: v.name,
          size: v.size,
          color: v.color,
          price: v.retail_price,
          currency: v.currency,
        }))
      };
    }));

    res.json({ products });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
