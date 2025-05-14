import React, { useEffect } from "react";
import { useApi } from "../api_wrapper.jsx";

function DashboardPage () {
        const {apiFetch} = useApi();

        useEffect(() => {
                const fetchTrending = async () => {
                        try {
                                const response = await apiFetch("/api/stocks_api/trending") ;
                                const data = await response.json();
                                console.log(data);
                        } catch (error){
                                console.error("Could not fetch trending stocks.", error);
                        }
                }
                fetchTrending();
        }, [])

        return (
                <div>
                </div>
        );
}

export default DashboardPage;
