import React, { useState } from "react"
import { useApi } from "./../api_wrapper"


function DisplayName(){
    const {apiFetch} = useApi()
    const name = ""
    const email = ""
    const cash = ""


    const handleProfile = async (e) =>{
        e.preventDefault()
        try{
            const response = await apiFetch("",{
                method: "GET",
                body: JSON.stringify(name, email, cash)
            })
            if (response.ok){
                const data = await response.json();
                console.log(data)
            }
            else{
                console.error(err)
                alert("Something went wrong.")
            }
        }
        catch(err){
            console.error(err)
            alert("Something went wrong.")
        }
    }
    return(
        <>
            <div>
                <div>
                    <div>Name: ${name}</div>
                    <div>Email: ${email}</div>
                    <div>Balance: ${cash}</div>
                </div>
                <div>
                    <div>Delete account</div>
                    <div>Log Out</div>
                </div>
            </div>
        </>
    )
}

export default DisplayName