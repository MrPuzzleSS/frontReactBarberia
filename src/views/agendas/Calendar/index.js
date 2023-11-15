import React from 'react';
import '@fullcalendar/web-component/global';
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
    const handleEventDrop = (info) => {
        console.log('Evento arrastrado:', info);
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
            />
        </div>
    );
}

export default Calendar;