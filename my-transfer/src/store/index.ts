import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authSlice from "../services/authSlice.ts";
import {type TypedUseSelectorHook, useDispatch, useSelector} from "react-redux"

const rootReducer = combineReducers({
    auth: authSlice,
});

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(
                //authApi.middleware
            ),
    });
};


export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;