import React from "react";
import { createRoot } from 'react-dom/client'
import './index.css'
import "bootstrap/dist/css/bootstrap.css"
import "bootstrap/dist/js/bootstrap.js"
import { RouterProvider } from "react-router-dom";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {router} from "./router";

import {GoogleOAuthProvider} from "@react-oauth/google";
import {Provider} from "react-redux";
import {setupStore} from "./store";
import {ThemeProvider} from "./context/ThemeContext.tsx";
const CLIENT_ID = "481318276094-0j5bdn18h264hdpsuk36qqoqje510lre.apps.googleusercontent.com";


const queryClient = new QueryClient();
const store = setupStore();

createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ThemeProvider>
                <Provider store={store}>
                    <GoogleOAuthProvider clientId={CLIENT_ID}>
                        <QueryClientProvider client={queryClient}>
                            <RouterProvider router={router} />
                        </QueryClientProvider>
                    </GoogleOAuthProvider>
                </Provider>
        </ThemeProvider>
    </React.StrictMode>
)
