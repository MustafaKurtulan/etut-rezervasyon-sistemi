import { useEffect } from "react";
import { Container, CssBaseline } from "@mui/material";
import { Outlet } from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppDispatch } from "../store/store";
import { getUser } from "../pages/accountSlice";
import Header from "./Header";

export default function App() {

  const dispatch = useAppDispatch();

  const initApp = async () => {
  await dispatch(getUser());
  }

  useEffect(() => {
    initApp();

 }, []);
  
  return (
    <>
      <ToastContainer position="bottom-right" hideProgressBar theme="colored" autoClose={3000}/>
      <CssBaseline />
      <Header />
      <Container>
        <Outlet />
      </Container>
    </>
  );
}