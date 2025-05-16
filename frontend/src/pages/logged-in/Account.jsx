import React from "react";
import { useApi } from "../../hooks/useApi.jsx";
import SideNav from "../../components/SideNav.jsx";
import Button from "../../components/ui/Button.jsx";

function DisplayProfile({user}){
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
            <div className = "flex flex-col justify-center align-center bg-background ">
                <div className="flex justify-start p-6 font-heading">
                    <p>Account</p>
                </div>
                <div className="bg-primary rounded-3xl p-8 gap-2 sm:flex-col ">
                    <div className="flex justify-between">                
                        <div className = "flex flex-col justify-start text-text bg-primary">
                            <div>Name: ${name}</div>
                            <div>Email: ${email}</div>
                            <div>Balance: ${cash}</div>
                        </div>
                        <div className="flex flex-col justify-start text-text ">
                            <div>edit name</div>
                            <div>edit email</div>
                        </div>
                    </div>
                    <div className = "flex justify-between text-text bg-primary sm:flex-col sm:justify-center">
                        <Button className="">Log out all accounts</Button>
                        <Button className="">Delete profile</Button>
                    </div>
                </div>
            </div>
        </>
    )
}


export default DisplayProfile;
