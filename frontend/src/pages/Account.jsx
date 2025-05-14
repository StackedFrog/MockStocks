import React from "react";
import { useApi } from "../api_wrapper.jsx";

function DisplayProfile(){
    const {apiFetch} = useApi();
    const name = "";
    const email = "";
    const cash = "";

    return(
        <>
            <div>
                <div>Name: ${name}</div>
                <div>Email: ${email}</div>
                <div>Balance: ${cash}</div>
                <div>Log Out</div>
            </div>
        </>
    )
}
