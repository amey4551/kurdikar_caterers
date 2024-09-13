import { useEffect, useState } from 'react';
import { supabase } from '@/backend/supabaseClient';
import { Card } from '@/components/ui';
import { CreateDraftType } from '@/@types/createOrder.type';
import { useNavigate } from 'react-router-dom';
import TableRowSkeleton from '@/components/shared/loaders/TableRowSkeleton';

const Pending = () => {
  const [orders, setOrders] = useState<CreateDraftType[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleEventClick = (orderId: number) => {
    navigate(`/orderDetails/${orderId}`);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from('order_datetime_details')
        .select('*')
        .neq('order_status', 'c');

      if (error) {
        console.error('Error fetching orders:', error);
      } else {
        setOrders(data);
      }
      setLoading(false);
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status :string) => {
    switch(status) {
      case 'p': return 'bg-yellow-500';
      case 'i': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'D': return 'Draft';
      case 'P': return 'Pending';
      case 'I': return 'In Progress';
      default: return 'Unknown';
    }
  };

  const formatDate = (dateString : string) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options as any);
  };

  return (
    <Card className="w-full h-full bg-white rounded-lg overflow-hidden">
      <div className="px-6 py-4">
        <h2 className="text-2xl font-bold text-black">Pending Orders</h2>
      </div>
      <div className="p-6">
        {loading ? (
         <TableRowSkeleton
         avatarInColumns={[0]}
         columns={5}
         rows={5}
         avatarProps={{
             width: 1000,
             height: 50,
         }}
     />
        ) : orders.length > 0 ? (
          <div className="overflow-auto max-h-[calc(50vh-100px)]">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-8 py-4 text-left text-base font-semibold text-gray-600 uppercase tracking-wider">Client</th>
                  <th scope="col" className="px-8 py-4 text-left text-base font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-8 py-4 text-left text-base font-semibold text-gray-600 uppercase tracking-wider">Location</th>
                  <th scope="col" className="px-8 py-4 text-left text-base font-semibold text-gray-600 uppercase tracking-wider">Occasion</th>
                  <th scope="col" className="px-8 py-4 text-left text-base font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map(order => (
                  <tr key={order.id} onClick={()=>handleEventClick(order.id)} className='cursor-pointer'>
                    <td className="px-8 py-6 whitespace-nowrap text-base">
                      <div className="font-semibold text-gray-900">{order.client_name}</div>
                      <div className="text-gray-500">ID: {order.id}</div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-base text-gray-500">
                      {formatDate(order.order_date)}
                    </td>   
                    <td className="px-8 py-6 whitespace-nowrap text-base text-gray-500">
                      {order.order_location || 'Not specified'}
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-base text-gray-500">
                      {order.order_occasion || 'Not specified'}
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-base">
                      <span className={`px-4 py-2 text-sm font-medium rounded-full ${getStatusColor(order.order_status)} text-white`}>
                        {getStatusText(order.order_status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8 text-lg">No pending orders found.</p>
        )}
      </div>
    </Card>
  );
};

export default Pending;
