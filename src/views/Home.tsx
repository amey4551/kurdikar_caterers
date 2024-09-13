import React from 'react'
import TodaysOrders from './dashboard/TodaysOrders/TodaysOrders'
import OrderHistory from './dashboard/Orderhistory/Orderhistory'
import Pending from './dashboard/Pending/Pending'

const Home: React.FC = () => {
    return (
        <div className="min-h-screen">
            <div className="flex-1 ">
                <div className="flex gap-4">
                    <div className="w-5/12 ">
                        <TodaysOrders />
                    </div>
                    <div className="w-7/12 ">
                        <Pending />
                    </div>
                </div>
                <div className="my-4">
                    <OrderHistory />
                </div>
            </div>
        </div>
    )
}

export default Home
