import React, { useState } from "react"
import { useApi } from "../../hooks/useApi.jsx"


function DisplayName(){
    const {apiFetch} = useApi()
    const name = ""


    const handleProfile = async (e) =>{
        e.preventDefault()
        try{
            const response = await apiFetch("/api/user/info",{
                method: "GET",
                body: JSON.stringify(name)
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
            <div className="text-text bg-primary p-2 rounded-lg ">
                    <div>Welcome, Long ass name {name}</div>
            </div>
        </>
    )
}

export default DisplayName