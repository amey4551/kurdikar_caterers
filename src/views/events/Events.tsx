import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/backend/supabaseClient'; // Adjust the path as needed

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from('order_datetime_details')
          .select('*');

        if (error) throw error;

        // Transform data to FullCalendar format
        const formattedEvents = data.map(order => ({
          id: order.id,
          title: `${order.client_name} - ${order.order_occasion} - ${order.people_count} people`,
          date: order.order_date,
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

  const handleEventClick = (clickInfo) => {
    const orderId = clickInfo.event.id;
    navigate(`/order/${orderId}`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Order Calendar</h1>
      <div className="bg-white rounded-lg shadow">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          eventClick={handleEventClick}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek,dayGridDay'
          }}
        />
      </div>
    </div>
  );
}

export default Events;
