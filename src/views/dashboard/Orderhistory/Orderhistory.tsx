import React, { useEffect, useState } from 'react';
import { supabase } from '@/backend/supabaseClient';
import { CalendarClock, Users, MapPin, ChevronDown } from 'lucide-react';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui';
import TableRowSkeleton from '@/components/shared/loaders/TableRowSkeleton';

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
  const [visibleOrders, setVisibleOrders] = useState(10);
  const navigate = useNavigate();

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

  const handleEventClick = (orderId: number) => {
    navigate(`/orderDetails/${orderId}`);
  };

  const loadMoreOrders = () => {
    setVisibleOrders((prevVisibleOrders) => prevVisibleOrders + 10);
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'D':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'P':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <Card className="bg-white rounded-lg overflow-hidden">
      <div className="px-6 py-4">
        <h2 className="text-2xl font-bold text-black">Order History</h2>
      </div>
      <div className="p-6">
        {loading ? (
          <TableRowSkeleton
          avatarInColumns={[0]}
          columns={5}
          rows={5}
          avatarProps={{
              width: 1850,
              height: 80,
          }}
      />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-8 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Client</th>
                    <th scope="col" className="px-8 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Date & Time</th>
                    <th scope="col" className="px-8 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Location</th>
                    <th scope="col" className="px-8 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">People</th>
                    <th scope="col" className="px-8 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.slice(0, visibleOrders).map((order) => (
                    <tr key={order.id} onClick={() => handleEventClick(order.id)} className="hover:bg-gray-50 cursor-pointer transition-colors duration-200">
                      <td className="px-8 py-5 whitespace-nowrap">
                        <div className="text-lg font-semibold text-gray-900">{order.client_name}</div>
                        <div className="text-md text-gray-500">{order.order_occasion}</div>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        <div className="text-lg text-gray-900 flex items-center">
                          <CalendarClock className="w-6 h-6 mr-3 text-indigo-500" />
                          {dayjs(`${order.order_date} ${order.order_time}`).format('D MMM YY, h:mm A')}
                        </div>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        <div className="text-lg text-gray-900 flex items-center">
                          <MapPin className="w-6 h-6 mr-3 text-indigo-500" />
                          {order.order_location}
                        </div>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        <div className="text-lg text-gray-900 flex items-center">
                          <Users className="w-6 h-6 mr-3 text-indigo-500" />
                          {order.people_count}
                        </div>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        <span className={`px-8 py-3 text-base font-medium rounded-full ${getStatusColor(order.order_status)}`}>
                          {order.order_status || 'Unknown'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {visibleOrders < orders.length && (
              <div className="mt-8 text-center">
                <button 
                  onClick={loadMoreOrders} 
                  className="px-6 py-3 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition duration-300 ease-in-out flex items-center justify-center mx-auto"
                >
                  <ChevronDown className="w-6 h-6 mr-2" />
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );
};

export default OrderHistory;
