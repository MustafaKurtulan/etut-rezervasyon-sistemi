import { configureStore } from "@reduxjs/toolkit";
import { accountSlice } from "../pages/accountSlice";
import { useDispatch, useSelector } from "react-redux";

export const store = configureStore({
  reducer: {
    account: accountSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();