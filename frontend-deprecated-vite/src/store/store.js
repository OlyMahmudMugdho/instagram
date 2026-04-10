import { configureStore } from "@reduxjs/toolkit";
import LoginReducer from "../components/forms/LoginSlice";

export const store = configureStore({
    reducer : {
        login : LoginReducer
    },
})