import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/backend/supabaseClient';
import CalendarView from '@/components/shared/CalendarView';

function Events() {
  const [events, setEvents] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from('order_datetime_details')
          .select('*');

        if (error) throw error;

        const formattedEvents = data.map(order => ({
          id: order.id.toString(),
          title: `${order.client_name} - ${order.order_occasion} - ${order.people_count} people`,
          start: order.order_date,
          eventColor: getRandomColor(),
        }));

        setEvents(formattedEvents);
      } catch (error) {
        setError('Failed to fetch events.');
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleEventClick = (arg: any) => {
    const orderId = arg.event.id;
    navigate(`/orderDetails/${orderId}`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Order Calendar</h1>
      <div className="bg-white rounded-lg shadow">
        <CalendarView
          events={events}
          eventClick={handleEventClick}
          select={(event) => {
            console.log('onCellSelect', event);
          }}
          eventDrop={(arg) => {
            console.log('onEventChange', arg);
          }}
          editable
          selectable
        />
      </div>
    </div>
  );
}

function getRandomColor() {
  const colors = ['red', 'blue', 'green', 'purple', 'orange', 'emerald'];
  return colors[Math.floor(Math.random() * colors.length)];
}

export default Events;