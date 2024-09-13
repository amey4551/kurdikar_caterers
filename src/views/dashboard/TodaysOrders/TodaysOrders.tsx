import React, { useEffect, useState } from 'react';
import { CalendarClock, Users, MapPin, Clock } from 'lucide-react';
import { supabase } from '@/backend/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui';
import TableRowSkeleton from '@/components/shared/loaders/TableRowSkeleton';

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

  const handleEventClick = (orderId: number) => {
    navigate(`/orderDetails/${orderId}`);
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <Card className="bg-white rounded-lg overflow-hidden h-full">
      <div className="px-6 py-4">
        <h2 className="text-2xl font-bold text-black">Today's Orders</h2>
      </div>
      <div className="p-6">
        {loading ? (
          <TableRowSkeleton
          avatarInColumns={[0]}
          columns={3}
          rows={5}
          avatarProps={{
              width: 700,
              height: 50,
          }}
      />
        ) : orders.length === 0 ? (
          <p className="text-gray-500 text-center py-12 text-lg">No orders for today</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {orders.map((order) => (
              <div
                key={order.id}
                onClick={() => handleEventClick(order.id)}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer overflow-hidden"
              >
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 truncate">{order.client_name}</h3>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-600 mb-3">{order.order_occasion}</p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Clock className="w-4 h-4 mr-2 text-indigo-500" />
                      <span>{order.order_time}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="w-4 h-4 mr-2 text-indigo-500" />
                      <span className="truncate">{order.order_location}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Users className="w-4 h-4 mr-2 text-indigo-500" />
                      <span>{order.people_count} people</span>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.order_status)}`}>
                    {order.order_status || 'Pending'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default TodaysOrders;