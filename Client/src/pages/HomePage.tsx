import { Box, Typography } from "@mui/material";

export default function HomePage() {
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        position: "absolute", //normal akıştan çıkar
        top: 0,
        left: 0,
        display: "flex", //esnek kurallarla hizala
        flexDirection: "column",
        justifyContent: "center", //ortalar
        paddingLeft: "40px",
        color: "#fff",
        backgroundImage: "url('/images/bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Typography 
        variant="h2" 
        sx={{ 
          fontWeight: 700,
          fontSize: "48px",
          textShadow: "0px 3px 6px rgba(0,0,0,0.3)"
        }}
      >
        Hoş Geldiniz
      </Typography>

      <Typography 
        variant="h6" 
        sx={{ 
          marginTop: "10px",
          fontWeight: 300,
          opacity: 0.9,
          fontSize: "20px"
        }}
      >
        Welcome
      </Typography>
    </Box>
  );
}