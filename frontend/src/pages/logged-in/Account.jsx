import React from "react";
import { useApi } from "../../hooks/useApi.jsx";
import SideNav from "../../components/SideNav.jsx";

function DisplayProfile(){
    // const {apiFetch} = useApi();
    const name = "";
    const email = "";
    const cash = "";

    const handleAccount = async (e) =>{
        e.preventDefault()
        try{
            const response = await apiFetch("",{
                method: "GET",
                body: JSON.stringify(name, email, balance)
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
            <div className = "min-h-screen bg-primary">
                <SideNav></SideNav>
                
                <div className = "flex flex-col justify-start text-text bg-primary">
                    <div>Name: ${name}</div>
                    <div>Email: ${email}</div>
                    <div>Balance: ${cash}</div>
                </div>
                <div className = "flex justify-between text-text bg-primary sm:flex-col sm:justify-start">
                    <div>Delete account</div>
                    <div>Log Out</div>
                </div>
            </div>
        </>
    )
}


export default DisplayProfile;
