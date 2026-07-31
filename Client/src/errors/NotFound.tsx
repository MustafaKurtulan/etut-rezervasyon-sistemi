import { Box, Button, Card, Container, Divider, Typography } from "@mui/material";
import { NavLink } from "react-router";

export default function NotFound()
{
    return (
            <Box
      sx={{
        minHeight: "calc(100vh - 0px)", // Navbar yüksekliğini çıkar
        height: "100vh",
        width: "100vw",
        position: "absolute",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        left: 0,
        flexDirection: "column",
        WebkitJustifyContent: "center",
        backgroundImage: "url('/images/bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
        <Container
        component={Card}
        sx={{
            p: 4,
            borderRadius: 3, 
            maxWidth: 500,
            textAlign: "center",
            backgroundColor: "rgba(255,255,255,0.2)",
            backdropFilter: "blur(8px)", 
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)", 
            color: "#fff",
            }}
        >
        <Typography 
        variant="h1"
        fontWeight={900}
        sx={{ fontSize: { xs: "5rem", md: "8rem" }, lineHeight: 1 }}
        >
        404
        </Typography>
        <Typography variant="h5" gutterBottom>
        Sayfa Bulunamadı
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}> Aradığınız sayfa mevcut değil veya taşınmış olabilir. </Typography>
            <Divider sx={{ borderColor: "rgba(255,255,255,0.4)", mb: 3 }} />
            <Button variant="contained" color="primary" component={NavLink} to="/Login" sx={{ mt: 1 }}>Continue Logging</Button>
        </Container>  
        </Box>
        
    );
}