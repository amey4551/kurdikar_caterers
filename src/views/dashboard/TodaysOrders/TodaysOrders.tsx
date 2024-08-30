import React, { useEffect, useState } from 'react';
import { CalendarClock, Users, MapPin } from 'lucide-react';
import { supabase } from '@/backend/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui';

type Order = {
  id: number;
  order_date: string;
  order_time: string;
  order_location: string;
  client_name: string;
  people_count: number;
  order_occasion: string;
  order_status: string | null;
};

const TodaysOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleEventClick = (orderId: number) => {
    navigate(`/orderDetails/${orderId}`);
  };

  useEffect(() => {
    const fetchTodaysOrders = async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('order_datetime_details')
        .select('*')
        .eq('order_date', today)
        .order('order_time', { ascending: true });

      if (error) {
        console.error('Error fetching orders:', error);
      } else {
        setOrders(data || []);
        setLoading(false);
      }
    };

    fetchTodaysOrders();
  }, []);

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-500';
      case 'Pending':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className="w-full max-w-xl mx-auto overflow-hidden shadow-lg">
      <div className="bg-gradient-to-r from-blue-300 to-blue-200 text-white p-2 rounded-lg">
        <h2 className="text-xl font-semibold">Today's Orders</h2>
      </div>
      <div className="p-4 bg-white">
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : orders.length === 0 ? (
          <p className="text-center text-gray-500">No orders for today</p>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              onClick={() => handleEventClick(order.id)}
              onFocus={(e) => e.currentTarget.classList.add('ring', 'ring-blue-300')} 
              onBlur={(e) => e.currentTarget.classList.remove('ring', 'ring-blue-300')} 
              tabIndex={0}
              className="mb-4 last:mb-0 border-b border-gray-200 pb-4 last:border-b-0 cursor-pointer hover:bg-gray-100 focus:outline-none hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-center -mx-2">
                <div className="flex-1 px-2">
                  <h3 className="text-lg font-semibold text-gray-800">{order.client_name}</h3>
                  <p className="text-sm font-medium text-gray-600">{order.order_occasion}</p>
                </div>
                <div className="flex-1 px-2">
                  <div className="flex items-center mb-1">
                    <CalendarClock size={16} className="mr-2 text-red-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{order.order_time}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-2 text-red-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{order.order_location}</span>
                  </div>
                </div>
                <div className="flex-1 px-2">
                  <div className="flex items-center">
                    <Users size={16} className="mr-2 text-red-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{order.people_count} people</span>
                  </div>
                </div>
                <div className="flex-1 px-2 flex justify-center">
                  <span
                    className={`${getStatusColor(order.order_status)} text-white px-3 py-1 rounded-full text-xs font-medium`}
                  >
                    {order.order_status || 'Pending'}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default TodaysOrders;
