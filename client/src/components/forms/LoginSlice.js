import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

export const initialState = {
    username: " ",
    userID: " ",
    userInfo: null,
    refreshToken: "",
    accessToken: "",
    message: "",
    isLoggedIn: false,
    status: " ",
    PROTOCOL: "http://",
    HOST: "localhost:5000",
}


export const LoginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        setLoggedInUsername: (state, action) => {
            state.username = action.payload
            localStorage.setItem('loginState', JSON.stringify(state));
        },
        setLoggedInUserID: (state, action) => {
            state.userID = action.payload;
            localStorage.setItem('loginState', JSON.stringify(state))
            localStorage.setItem('userID', JSON.stringify(state))
        },
        setRefreshToken: (state, action) => {
            state.refreshToken = action.payload
            localStorage.setItem('loginState', JSON.stringify(state));
        },
        setAccessToken: (state, action) => {
            state.accessToken = action.payload
            localStorage.setItem('loginState', JSON.stringify(state));
        },
        setLoggedIn: (state, action) => {
            state.isLoggedIn = action.payload
            localStorage.setItem('loginState', JSON.stringify(state));
        },
        setStatus: (state, action) => {
            state.status = action.payload
            localStorage.setItem('loginState', JSON.stringify(state));
        },
    },



})


export const { setLoggedInUsername, setLoggedInUserID, setRefreshToken, setAccessToken, setLoggedIn, setStatus } = LoginSlice.actions;
export default LoginSlice.reducer