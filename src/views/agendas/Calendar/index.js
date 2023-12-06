import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import adaptivePlugin from '@fullcalendar/adaptive';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import momentPlugin from '@fullcalendar/moment';
import scrollgridPlugin from '@fullcalendar/scrollgrid';
import timelinePlugin from '@fullcalendar/timeline';


import '../../../Calendar.css';

function Calendar() {
    const [events, setEvents] = useState([]);

    const handleEventDrop = (info) => {
        const { event, oldEvent, newEvent, el, delta, revert } = info;

        const updatedEvents = events.map((item) => {
            if (item === event) {
                return {
                    ...item,
                    start: newEvent.start,
                    end: newEvent.end,
                    allDay: newEvent.allDay,
                };
            }
            return item;
        });

        setEvents(updatedEvents);
    };

    const handleDateClick = (arg) => {
        const title = prompt('Ingresa el título del evento:');
        if (title) {
            const newEvent = {
                title: title,
                start: arg.date,
                allDay: arg.allDay,
            };
            setEvents([...events, newEvent]);
        }
    };

    return (
        <div className="col-md-6" style={{ position: 'relative' }}>
            <FullCalendar
                plugins={[
                    dayGridPlugin,
                    interactionPlugin,
                    timeGridPlugin,
                    adaptivePlugin,
                    bootstrapPlugin,
                    bootstrap5Plugin,
                    googleCalendarPlugin,
                    momentPlugin,
                    scrollgridPlugin,
                    timelinePlugin,
                ]}
                initialView="dayGridMonth"
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                eventDrop={handleEventDrop}
                dateClick={handleDateClick} 
                events={events} // Pasar eventos al calendario
            />
        </div>
    );
}

export default Calendar;
