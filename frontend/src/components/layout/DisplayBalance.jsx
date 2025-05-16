import React, { useState } from "react"
import { useApi } from "../../hooks/useApi.jsx"


function DisplayBalance(){
    const {apiFetch} = useApi()
    const cash = ""

    const handleBalance = async (e) =>{
        e.preventDefault()
        try{
            const response = await apiFetch("/api/user/info",{
                method: "GET",
                body: JSON.stringify(cash)
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
            <div className = "text-text bg-primary p-2 rounded-lg ">
                <span>Balance: {cash}USD</span>
            </div>
        </>
    )
}

export default DisplayBalance