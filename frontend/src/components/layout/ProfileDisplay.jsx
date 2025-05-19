import React, { useState } from "react"


function DisplayName({name}){
	return(
		<>
			<div className="text-background bg-primary p-2 rounded-lg text-center">
				<div>Welcome, {name}</div>
			</div>
		</>
	)
}

export default DisplayName
