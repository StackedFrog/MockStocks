import React, { useState } from "react"


function DisplayBalance({cash}){
    return(
        <>
            <div className = "text-background bg-primary p-2 rounded-lg text-center">
                <span>Balance: {cash} USD</span>
            </div>
        </>
    )
}

export default DisplayBalance
