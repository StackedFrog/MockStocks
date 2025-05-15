import React from "react";
// import { useApi } from "../api_wrapper.jsx";

function DisplayProfile(){
    // const {apiFetch} = useApi();
    const name = "";
    const email = "";
    const cash = "";

    const handleAccount = async (e) => {
        e.preventDefault();
        try {
            const response = await apiFetch("", {
                method: "GET",
                body: JSON.stringify(name)
            })
            
        } 
        catch (error) {
            
        }
    }

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


export default DisplayProfile;
