import React, { useState } from "react"
import { useApi } from ""


function DisplayProfile(){
    const {apiFetch} = useApi()
    const [name] = useState()

    const handleProfile = async (e) =>{
        e.preventDefault()
        try{
            const response = await apiFetch("",{
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
            <div></div>
        </>
    )
}

export default DisplayProfile