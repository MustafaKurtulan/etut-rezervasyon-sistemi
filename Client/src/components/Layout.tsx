import { Outlet } from "react-router";
import { Container, CssBaseline } from "@mui/material";
import Header from "./Header";

export default function Layout() {
  return (
    <>
      <CssBaseline />
      <Header />
      <Container>
        <Outlet />
      </Container>
    </>
  );
}
