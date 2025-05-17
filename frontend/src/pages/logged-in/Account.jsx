import React from "react";
import { useApi } from "../../hooks/useApi.jsx";
import Button from "../../components/ui/Button.jsx";
import { BiSolidEditAlt } from "react-icons/bi";
import { useState } from "react";
import LogoutEveryWhere from "../../components/auth/LogoutEveryWhere.jsx"
import Modal from "../../components/ui/Modal.jsx"
import { useNavigate } from 'react-router-dom'


function DisplayProfile({user}){
    const {apiFetch, apiUnAuth} = useApi();
    const navigate = useNavigate()
    let [name, setName] = useState(user.username) ?? "";
    const cash = user.balance ?? "";
    const email = user.email;
    const [isEdit, setEdit] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);


    const deleteAccount = async () => {
        await apiFetch("/api/user/delete_account", {
            method: "DELETE"
        })
        await apiUnAuth("/auth/user/logout_all")
		navigate("/")
        setModalOpen(false)
    }
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

                            // <form onSubmit={save}><div>Name: {isEdit ? (<input className="underline" type = "text" onChange={(e) => setName(e.target.value)}value = {name}></input>): (<span>{name}</span>)}</div></form>
    return(
        <>
                <div className="px-4 py-6 bg-background flex justify-center flex-col">
                    <h2 className="font-heading text-secondary text-3xl mb-6">Account</h2>
                <div className="bg-primary rounded-lg p-4 sm:flex-col lg:w-[20vw]">
                    <div className="flex">                
                        <div className = "flex flex-col text-background bg-primary sm:text-lg font-text">
                            <div className="font-heading text-secondary">Name </div>
                            <div>{name}</div>
                            { email && (<> <div className="font-heading text-secondary">Email </div><div>{email}</div></>)}
                            <div className="font-heading text-secondary">Balance </div>
                            <div>{cash} USD</div>
                            <Button text={"Edit Password"} icon={<BiSolidEditAlt/>} onClick={editClick} className="text-sm lg:w-auto"/>
                        </div>
                    </div>
                </div>
                <div className = "flex flex-col py-3 bg-background">
                        <LogoutEveryWhere/>
                        <Button onClick={()=> setModalOpen(true)}className="bg-accent2"text = "Delete account"></Button>
                </div>

                <Modal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    onConfirm={deleteAccount}
                    title="Are you sure you want to delete your account?"
                    message="Your data will be permenently deleted. This action cannot be undone."/>
            </div>
        </>
    )
}

export default DisplayProfile;
