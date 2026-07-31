import {  Box, Container, Divider, Typography } from "@mui/material";
import { useLocation } from "react-router";

export default function ServerError()
{
    const { state } = useLocation();

    return (
        <Container>
            <Box
      sx={{
        height: "100vh",
        width: "100vw",
        position: "absolute",
        top: 0,
        left: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        paddingLeft: "40px",
        color: "#fff",
        backgroundImage: "url('/images/bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
            {
                state?.error? (
                    <>
                        <Typography variant="h3" gutterBottom>{ state.error.title } - {state.status}</Typography>
                        <Divider />
                        <Typography variant="body2" >{ state.error.detail || "Unknown Error"}</Typography>
                    </>
                ):
                (
                    <Typography variant="h5">Server Error</Typography>
                )
            }
            </Box>
        </Container>
    );
}