module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();
  const { name, email, address, items } = req.body;
  try {
    const response = await fetch("https://api.printful.com/orders", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.PRINTFUL_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipient: {
          name,
          email,
          address1: address.line1,
          city: address.city,
          country_code: address.country,
          zip: address.zip,
        },
        items: items.map(i => ({
          sync_variant_id: i.printfulVariantId,
          quantity: i.qty,
        })),
      }),
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
