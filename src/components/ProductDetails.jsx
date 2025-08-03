import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { Container, Typography, Card, CardMedia, CardContent, Button, Chip } from "@mui/material";
import { ShoppingCart } from "@mui/icons-material";
import api from "../utils/axios";

export default function ProductDetails() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const response = await api.get(`/posts/${productId}`);
      const p = response.data;
      const single = {
        id: p.id,
        title: p.title,
        price: Math.floor(Math.random() * 500) + 20,
        category: ["Electronics", "Clothing", "Books", "Home"][Math.floor(Math.random() * 4)],
        image: `https://picsum.photos/500/300?random=${p.id}`,
        description: p.body
      };
      setProduct(single);
    };
    fetchProduct();
  }, [productId]);

  if (!product) return <Typography align="center" sx={{ mt: 5 }}>Loading...</Typography>;

  return (
    <Container sx={{ mt: 4 }}>
      <Card>
        <CardMedia
          component="img"
          height="300"
          image={product.image}
          alt={product.title}
        />
        <CardContent>
          <Typography variant="h4" gutterBottom>{product.title}</Typography>
          <Chip label={product.category} sx={{ mb: 2 }} />
          <Typography variant="body1" sx={{ mb: 2 }}>{product.description}</Typography>
          <Typography variant="h5" color="primary" sx={{ mb: 2 }}>${product.price}</Typography>
          <Button
            variant="contained"
            startIcon={<ShoppingCart />}
            onClick={() => {
              const cart = JSON.parse(localStorage.getItem('cart') || '[]');
              const existing = cart.find(item => item.id === product.id);
              if (existing) {
                existing.quantity += 1;
              } else {
                cart.push({ ...product, quantity: 1 });
              }
              localStorage.setItem('cart', JSON.stringify(cart));
            }}
          >
            Add to Cart
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
}
