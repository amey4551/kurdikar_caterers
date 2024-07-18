import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useNavigate } from 'react-router-dom'


const orders = [
  { id: 1234, title: 'Order #1234', date: '2024-07-18', customer: 'John Doe', total: 150.00 },
  { id: 5678, title: 'Order #5678', date: '2024-07-20', customer: 'Jane Smith', total: 225.50 },
  { id: 9101, title: 'Order #9101', date: '2024-07-22', customer: 'Bob Johnson', total: 75.25 },
  { id: 1121, title: 'Order #1121', date: '2024-07-25', customer: 'Alice Brown', total: 300.00 },
  { id: 3141, title: 'Order #3141', date: '2024-07-28', customer: 'Charlie Davis', total: 180.75 },
]

function Events() {
  const navigate = useNavigate()

  const handleEventClick = (clickInfo) => {
    const orderId = clickInfo.event.id
    navigate(`/order/${orderId}`)
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Order Calendar</h1>
      <div className="bg-white rounded-lg shadow">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={orders}
          eventClick={handleEventClick}
        //   height="auto"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek,dayGridDay'
          }}
        />
      </div>
    </div>
  )
}

export default Events