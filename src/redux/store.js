import { configureStore } from "@reduxjs/toolkit"
import companySlice from "./companySlice";
export const store = configureStore({
    reducer:{
        company:companySlice
    }
});