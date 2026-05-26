export default async function handler(req, res) {
  try {
    const response = await fetch(
      'https://api.printful.com/store/products',
      {
        headers: {
          Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}`,
        },
      }
    );

    const data = await response.json();

    console.log(data);

    if (!data.result) {
      return res.status(500).json({
        error: 'Aucun produit trouvé',
      });
    }

    const formattedProducts = data.result.map((product) => ({
      id: product.id,
      name: product.name,
      image: product.thumbnail_url,

      variants: product.sync_variants.map((variant) => ({
        id: variant.id,
        price: variant.retail_price,
        size:
          variant.size ||
          variant.name ||
          'Unique',
      })),
    }));

    res.status(200).json({
      products: formattedProducts,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
}
