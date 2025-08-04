import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  TextField,
  Box,
  Chip,
  Pagination,
  Stack
} from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
//import api from '../utils/axios';
import {productsAPI , cartAPI } from '../services/api'

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(6);
  const [viewMode , setviewMode] = useState("grid");

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchTerm && Array.isArray(products)) {
      const filtered = products.filter(
        (product) =>
          product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(Array.isArray(products) ? products : []);
    }
    setCurrentPage(1);
  }, [searchTerm, products]);

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      const products = response.data.data || [];
      setProducts(products);
      setFilteredProducts(products);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product) => {
    try {
      await cartAPI.add(product.id, 1);
      // Fallback to localStorage for immediate UI updates
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItem = cart.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }

      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Error adding to cart:', error);
      // Fallback to localStorage only
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItem = cart.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }

      localStorage.setItem('cart', JSON.stringify(cart));
    }
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = Array.isArray(filteredProducts)
    ? filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)
    : [];
  const totalPages = Math.ceil(
    (filteredProducts?.length || 0) / productsPerPage
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  if (loading) {
    return <ProductsGridSkeleton count={6} />;
  }

  return (
    <Container maxWidth='lg'>
      <Box sx={{ my: 4 }}>
        <Typography variant='h4' gutterBottom>
          Products ({filteredProducts?.length || 0} items)
        </Typography>

        <TextField
          fullWidth
          label='Search products...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 3 }}
        />

        <ToggleButtonGroup
        value={viewMode}
        exclusive
        onChange={(e,newView) => setviewMode(newView)}
        sx={{ mb: 3}}>
          <ToggleButton value={"grid"}>
            <ViewModule/> Grid
          </ToggleButton>
          <ToggleButton value={"list"}>
            <ViewList/> List
          </ToggleButton>
        </ToggleButtonGroup>

        {viewMode === "grid" ? (
        <Grid container spacing={3}>
          {currentProducts.map((product) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component='img'
                  height='200'
                  image={product.image}
                  alt={product.title}
                />
                
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant='h6' gutterBottom>
                    {product.title.length > 50
                      ? `${product.title.substring(0, 50)}...`
                      : product.title}
                  </Typography>

                  <Chip label={product.category} size='small' sx={{ mb: 1 }} />

                  <Typography
                    variant='body2'
                    color='text.secondary'
                    sx={{ mb: 2 }}
                  >
                    {product.description.length > 100
                      ? `${product.description.substring(0, 100)}...`
                      : product.description}
                  </Typography>

                  <Typography variant='h6' color='primary' sx={{ mb: 2 }}>
                    ${product.price}
                  </Typography>

                  <Button
                    variant='contained'
                    fullWidth
                    startIcon={<ShoppingCart />}
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        ) : (
          <Stack spacing={2}>
            {currentProducts.map((product) => (
              <Card key={product.id} sx={{display: "flex", p: 2}}>
                <Link
                to={`/product/${product.id}`}
                style={{display: "flex" , textDecoration: "none" , color: "inherit" , width: "100%"}}
                >
                <CardMedia
                component={"img"}
                sx={{width: 150, borderRadius: 2, mr: 2}}
                image={product.image}
                alt={product.title}
                />
                <Box sx={{flex : 1}}>
                  <Typography variant="h6">
                    {product.title.length > 50
                    ? `${product.title.substring(0,50)}...` : product.title}
                  </Typography>

                  <Chip label={product.category} size="small" sx={{ mb: 1}}/>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1}}>
                    {product.description.length > 80 ? 
                    `${product.description.substring(0,80)}...` : product.description}
                  </Typography>

                  <Typography variant="h6" color="primary" sx={{ mb: 1}}>
                    ${product.price}
                  </Typography>
                  </Box>
                  </Link>
                  <Box sx={{ display: "flex" , alignItems: "center"}}>
                  <Button
                  variant="contained"
                  startIcon={<ShoppingCart/>}
                  onClick={() => addToCart(product)}>
                    Add To Cart 
                  </Button>
                </Box>
              </Card>
            ))}
          </Stack>
        )}

        {totalPages > 1 && (
          <Stack spacing={2} alignItems='center' sx={{ mt: 4 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color='primary'
              size='large'
              showFirstButton
              showLastButton
            />
            <Typography variant='body2' color='text.secondary'>
              Showing {indexOfFirstProduct + 1}-
              {Math.min(indexOfLastProduct, filteredProducts?.length || 0)} of{' '}
              {filteredProducts?.length || 0} products
            </Typography>
          </Stack>
        )}

        {(filteredProducts?.length || 0) === 0 && (
          <Typography variant='h6' align='center' sx={{ mt: 4 }}>
            No products found
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default Products;
