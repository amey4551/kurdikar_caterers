import React from 'react'
import TodaysOrders from './dashboard/TodaysOrders/TodaysOrders'
import OrderHistory from './dashboard/Orderhistory/Orderhistory'
import Pending from './dashboard/Pending/Pending'
import { Calendar, Card } from '@/components/ui'

const Home: React.FC = () => {
    return (
        <div className="min-h-screen">
            <div className=" grid grid-cols-4 gap-4">
                    <div className="col-span-2">
                        <TodaysOrders />
                    </div>
                    <Card className=" md:w-[300px] max-w-[300px] mx-auto">
                        <div className="md:w-[260px] max-w-[260px] mx-auto">
                            <Calendar  />
                        </div>
                    </Card>
                <div className="col-span-3">
                    <OrderHistory />
                </div>
            </div>
        </div>
    )
}

export default Home
