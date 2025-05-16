import React from "react";
import { useApi } from "../../hooks/useApi.jsx";
import SideNav from "../../components/SideNav.jsx";
import Button from "../../components/ui/Button.jsx";
import { FiUser } from "react-icons/fi";
import DisplayBalance from "../../components/layout/DisplayBalance.jsx";
import DisplayName from "../../components/layout/ProfileDisplay.jsx";
import { BiSolidEditAlt } from "react-icons/bi";
import { useState } from "react";

function DisplayProfile({user}){
    const {apiFetch} = useApi();
    const name = user.username ?? "";
    const cash = user.balance ?? "";
    const [isEdit, setEdit] = useState(false);

    const editClick = () => {
        setEdit(true)
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
                        <div className = "flex flex-col justify-start text-text bg-primary">
                            <div>Name: {isEdit ? (<input type = "text" onChange={(e) => setName(e.target.value)} value = {name}></input>): (<span>{name}</span>)}</div>
                            <div>Balance: {cash}</div>
                        </div>
                        <div className="flex flex-col justify-start text-text ">
                            <BiSolidEditAlt onClick={editClick}
                            style={{
                                color: "#eaecea"
                            }}/>
                        </div>
                    </div>
                </div>
                <div className = "flex flex-col py-3 bg-background">
                        <Button className=""text = "Log out all accounts"></Button>
                        <Button className="" text= "Delete profile"></Button>
                </div>
            </div>
        </>
    )
}
function EditName(){
    const [name, setName] = useState("");

    
}
const save = (e) => {
    e.preventDefault();
    setEdit(false)
}


export default DisplayProfile;
