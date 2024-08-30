import React, { useEffect, useState } from 'react';
import { supabase } from '@/backend/supabaseClient';
import { CalendarClock, Users, MapPin, ChevronDown } from 'lucide-react';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

type Order = {
  id: number;
  created_at: string;
  order_date: string;
  order_time: string;
  order_location: string;
  client_name: string;
  people_count: number;
  order_occasion: string;
  order_status: string | null;
};

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleOrders, setVisibleOrders] = useState(5);
  const navigate = useNavigate();

  const handleEventClick = (orderId: number) => {
    navigate(`/orderDetails/${orderId}`);
  };

  useEffect(() => {
    const fetchOrderHistory = async () => {
      const { data, error } = await supabase
        .from('order_datetime_details')
        .select('*')
        .order('order_date', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching order history:', error);
      } else {
        setOrders(data || []);
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, []);

  const loadMoreOrders = () => {
    setVisibleOrders((prevVisibleOrders) => prevVisibleOrders + 5); // Increase the number of visible orders by 5
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Order History</h1>
      {loading ? (
        <p className="text-center text-gray-500">Loading order history...</p>
      ) : (
        <div className="overflow-y-auto max-h-96 bg-white shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Occasion</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">People</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.slice(0, visibleOrders).map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div onClick={()=>handleEventClick(order.id)} className="text-sm font-medium text-gray-900">{order.client_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      <CalendarClock size={16} className="inline mr-2 text-gray-400" />
                      {dayjs(`${order.order_date} ${order.order_time}`).format('D MMMM YY hA')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      <MapPin size={16} className="inline mr-2 text-gray-400" />
                      {order.order_location}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{order.order_occasion}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      <Users size={16} className="inline mr-2 text-gray-400" />
                      {order.people_count}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.order_status)}`}>
                      {order.order_status || 'Unknown'}
                    </span>
                  </td>
                </tr>
              ))}
              {visibleOrders < orders.length && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">
                    <button 
                      onClick={loadMoreOrders} 
                      className="px-4 py-1 bg text-gray-500 rounded-lg border border-gray-200 hover:bg-gray-100 transition duration-300 ease-in-out">
                      <span className="flex items-center justify-center">
                        <ChevronDown size={16} className="mr-2" />
                        Load More
                      </span>
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
