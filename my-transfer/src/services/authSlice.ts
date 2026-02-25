import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import {jwtDecode} from "jwt-decode";
import type {UserTokenInfo} from "../interfaces/UserTokenInfo.ts";

const getUserFromToken = (token: string) : UserTokenInfo | null  => {
    try {
        const decode = jwtDecode<UserTokenInfo>(token);
        return decode ?? null;
    }
    catch (err) {
        console.error("Invalid token", err);
        return null;
    }
}

const token = localStorage.token;
const user = getUserFromToken(token);

const initialState= {
    user: user
};

const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        loginSuccess(state, action: PayloadAction<string>) {
            const authToken = action.payload;
            const user = getUserFromToken(authToken);
            if (user) {
                user.roles = Array.isArray(user.roles) ? user.roles : undefined;
                state.user = user;
                localStorage.token = authToken;
            }
        },
        logout(state) {
            state.user = null;
            localStorage.removeItem("token");
        }
    }
});

export const { loginSuccess, logout } = authSlice.actions;

export default authSlice.reducer;