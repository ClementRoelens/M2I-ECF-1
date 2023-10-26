import { configureStore } from "@reduxjs/toolkit";
import projectSlice from "../components/projectSlice";

export const store = configureStore({
    reducer : {
        projects : projectSlice
    }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;