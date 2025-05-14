import React, { useEffect } from "react";
import { useApi } from "../api_wrapper.jsx";

function DashboardPage () {
        useEffect(() => {
                try {
                        const fetchTrending = async () => {
                                // const response = await fetch("https://query1.finance.yahoo.com/v1/finance/trending/US");
                                // const data = await response.json();
                                const data = {
                                        "symbol": "NRG",
                                        "range": "2d",
                                        "quotes": [
                                                {
                                                        "timestamp": 1746797400,
                                                        "open": 120.25,
                                                        "high": 120.7249984741211,
                                                        "low": 118.0,
                                                        "volume": 546261,
                                                        "close": 118.18000030517578,
                                                        "adjclose": 0.0
                                                },
                                                {
                                                        "timestamp": 1746801000,
                                                        "open": 118.20999908447266,
                                                        "high": 118.66000366210938,
                                                        "low": 117.43499755859376,
                                                        "volume": 482605,
                                                        "close": 118.48999786376952,
                                                        "adjclose": 0.0
                                                },
                                                {
                                                        "timestamp": 1746804600,
                                                        "open": 118.4800033569336,
                                                        "high": 119.05999755859376,
                                                        "low": 118.33000183105467,
                                                        "volume": 263507,
                                                        "close": 118.5199966430664,
                                                        "adjclose": 0.0
                                                },
                                                {
                                                        "timestamp": 1746808200,
                                                        "open": 118.54000091552734,
                                                        "high": 118.95999908447266,
                                                        "low": 118.29000091552734,
                                                        "volume": 253660,
                                                        "close": 118.62550354003906,
                                                        "adjclose": 0.0
                                                },
                                                {
                                                        "timestamp": 1746811800,
                                                        "open": 118.5999984741211,
                                                        "high": 119.06999969482422,
                                                        "low": 118.11009979248048,
                                                        "volume": 252552,
                                                        "close": 118.33000183105467,
                                                        "adjclose": 0.0
                                                },
                                                {
                                                        "timestamp": 1746815400,
                                                        "open": 118.36000061035156,
                                                        "high": 118.93000030517578,
                                                        "low": 118.35700225830078,
                                                        "volume": 376166,
                                                        "close": 118.73999786376952,
                                                        "adjclose": 0.0
                                                },
                                                {
                                                        "timestamp": 1746819000,
                                                        "open": 118.7699966430664,
                                                        "high": 119.38999938964844,
                                                        "low": 118.6500015258789,
                                                        "volume": 552769,
                                                        "close": 119.28399658203124,
                                                        "adjclose": 0.0
                                                },
                                                {
                                                        "timestamp": 1747056600,
                                                        "open": 137.0,
                                                        "high": 147.0800018310547,
                                                        "low": 136.9499969482422,
                                                        "volume": 3164171,
                                                        "close": 146.125,
                                                        "adjclose": 0.0
                                                },
                                                {
                                                        "timestamp": 1747060200,
                                                        "open": 146.0800018310547,
                                                        "high": 149.75799560546875,
                                                        "low": 145.02000427246094,
                                                        "volume": 1294260,
                                                        "close": 147.625,
                                                        "adjclose": 0.0
                                                },
                                                {
                                                        "timestamp": 1747063800,
                                                        "open": 147.625,
                                                        "high": 148.5800018310547,
                                                        "low": 146.4199981689453,
                                                        "volume": 1007664,
                                                        "close": 147.84500122070312,
                                                        "adjclose": 0.0
                                                },
                                                {
                                                        "timestamp": 1747067400,
                                                        "open": 147.8000030517578,
                                                        "high": 149.49000549316406,
                                                        "low": 147.71009826660156,
                                                        "volume": 663707,
                                                        "close": 148.60000610351562,
                                                        "adjclose": 0.0
                                                },
                                                {
                                                        "timestamp": 1747071000,
                                                        "open": 148.5399932861328,
                                                        "high": 150.0,
                                                        "low": 148.1999969482422,
                                                        "volume": 661034,
                                                        "close": 149.0800018310547,
                                                        "adjclose": 0.0
                                                },
                                                {
                                                        "timestamp": 1747074600,
                                                        "open": 149.13999938964844,
                                                        "high": 149.64999389648438,
                                                        "low": 147.8000030517578,
                                                        "volume": 1035062,
                                                        "close": 149.32000732421875,
                                                        "adjclose": 0.0
                                                },
                                                {
                                                        "timestamp": 1747078200,
                                                        "open": 149.32000732421875,
                                                        "high": 150.80999755859375,
                                                        "low": 149.1300048828125,
                                                        "volume": 1731850,
                                                        "close": 150.6699981689453,
                                                        "adjclose": 0.0
                                                },
                                                {
                                                        "timestamp": 1747080000,
                                                        "open": 150.61000061035156,
                                                        "high": 150.61000061035156,
                                                        "low": 150.61000061035156,
                                                        "volume": 0,
                                                        "close": 150.61000061035156,
                                                        "adjclose": 0.0
                                                }
                                        ]
                                }
                                console.log(data);
                        }
                        fetchTrending();
                } catch (error){
                        console.error("Could not fetch trending stocks.");
                }
        }, [])

        return (
                <div>
                </div>
        );
}

export default DashboardPage;
