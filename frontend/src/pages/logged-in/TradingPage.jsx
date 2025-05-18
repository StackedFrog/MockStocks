import React from 'react';
import TradeForm from '../../components/trading/TradeForm.jsx';

function TradingPage({userInfo, fetchUserInfo, hiddenChart}) {
	return (
		<div className="bg-background min-h-screen w-full">
			<h1 className="text-secondary text-3xl font-heading my-4">Trading Overview</h1>
			<TradeForm userInfo={userInfo} fetchUserInfo={fetchUserInfo} hiddenChart={hiddenChart} />
		</div>
	);
}

export default TradingPage;
