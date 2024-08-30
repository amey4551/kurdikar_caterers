import TodaysOrders from './dashboard/TodaysOrders/TodaysOrders'
import OrderHistory from './dashboard/Orderhistory/Orderhistory'

const Home = () => {
  return (
    <div>
      <TodaysOrders/>
      <OrderHistory/>
    </div>
  )
}

export default Home