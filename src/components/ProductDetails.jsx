import { useParams , useNavigate } from "react-router";
import { useEffect , useState } from "react";
import{
Container,
Typography,
Card,
CardMedia,
CardContent,
CircularProgress,
Box,
Button,
Chip,
Stack
} from "@mui/material";
import { ShoppingCart , ArrowBack } from "@mui/icons-material";
import api from "../utils/axios";

function ProductDetails()
{
    const { id } = useParams();
    const navigate = useNavigate();
    const [product , setProduct] = useState(null);
    const [loading , setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try{
                const response = await api.get(`/posts/${id}`);

                const mockProduct = {
                    id : response.data.id,
                    title: response.data.title,
                    price: Math.floor(Math.random() * 500) + 20,
                    category: ['Electronics', 'Clothing' , 'Books' , 'Home'][Math.floor(Math.random() * 4)],
                    image : `https://picsum.photos/600/400?random=${response.data.id}`,
                    description: response.data.body,
                };
                setProduct(mockProduct);
            }catch(error){
                console.error("Error fetching product details:" , error);
            } finally{
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id] );

    const addToCart = () => {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const existingItem = cart.find((item) => item.id === product.id);

        if (existingItem){
            existingItem.quantity += 1;
        }else{
            cart.push({...product, quantity: 1});
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        alert("product added to cart..!");
    };

    if (loading){
        return(
            <Box sx={{display: "flex" , justifyContent: "center" , mt: 5}}>
                <CircularProgress/>
            </Box>
        );
    }

    if (!product){
        return(
            <Container>
                <Typography variant="h6" align="center" sx={{mt: 4}}>
                    Product Not Found
                </Typography>
            </Container>
        );
    }

    return(
        <Container sx={{ mt: 4}}>
            <Card>
                <CardMedia
                component={"img"}
                height={"400"}
                image={product.image}
                alt={product.title}
                />
                <CardContent>
                    <Typography variant="h4" gutterBottom>
                        {product.title}
                    </Typography>
                    <Chip label={product.category} sx={{ mb: 2}}/>
                    <Typography variant="h5" color="primary" gutterBottom>
                        ${product.price}
                    </Typography>
                    <Typography variant="body1" sx={{ mb : 3}}>
                        {product.description}
                    </Typography>
                    <Stack direction={"row"} spacing={2}>
                    <Button 
                    variant="contained"
                    startIcon={<ShoppingCart/>}
                    onClick={addToCart}
                    >
                        Add To Cart 
                    </Button>
                    <Button 
                    variant="outlined"
                    startIcon={<ArrowBack/>}
                    onClick={() => navigate("/")}
                    >
                        Back To Products
                    </Button>
                    </Stack>
                </CardContent>
            </Card>
        </Container>
    );
}

export default ProductDetails;