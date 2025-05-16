import React from "react";
import { useApi } from "../../hooks/useApi.jsx";
import Button from "../../components/ui/Button.jsx";
import DisplayBalance from "../../components/layout/DisplayBalance.jsx";
import DisplayName from "../../components/layout/ProfileDisplay.jsx";
import { BiSolidEditAlt } from "react-icons/bi";
import { useState } from "react";
import LogoutEveryWhere from "../../components/auth/LogoutEveryWhere.jsx"
// import { LogoutEveryWhere } from "../../components/auth/LogoutEveryWhere.jsx"

function DisplayProfile({user}){
    console.log();
    
    const {apiFetch} = useApi();
    let [name, setName] = useState(user.username) ?? "";
    const cash = user.balance ?? "";
    const [isEdit, setEdit] = useState(false);

    const editClick = () => {
        setEdit(true)
    }
    const save = (e) => {
        e.preventDefault();
        setEdit(false)
    }

    const handleAccount = async (e) =>{
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
            <div className = "flex flex-col justify-center align-center bg-background ">
                <div className="flex justify-end-safe gap-2">
                    <DisplayBalance></DisplayBalance>
                    <DisplayName></DisplayName>
                </div>
                <div className="flex justify-start p-4 font-heading">
                    <h2>Account</h2>
                </div>
                <div className="bg-primary rounded-lg p-8 sm:flex-col ">
                    <div className="flex justify-between">                
                        <div className = "flex flex-col justify-start text-background bg-primary">
                            <form onSubmit={save}><div>Name: {isEdit ? (<input className="underline" type = "text" onChange={(e) => setName(e.target.value)}value = {name}></input>): (<span>{name}</span>)}</div></form>
                            <div>Balance: {cash}</div>
                        </div>
                        <div className="flex flex-col justify-start text-text gap-1">
                            <BiSolidEditAlt onClick={editClick}
                            style={{
                                color: "#0b0d0b",
                                height: "1.2em",
                                width: "1.2em"
                            }}/>
                        </div>
                    </div>
                </div>
                <div className = "flex flex-col py-3 bg-background">
                        <LogoutEveryWhere/>
                        <Button className="bg-accent2"text = "Delete account"></Button>
                </div>
            </div>
        </>
    )
}



export default DisplayProfile;
