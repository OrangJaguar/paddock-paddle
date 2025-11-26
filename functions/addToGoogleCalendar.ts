import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Get the OAuth access token for Google Calendar
    const accessToken = await base44.asServiceRole.connectors.getAccessToken("googlecalendar");
    
    const { booking } = await req.json();
    
    if (!booking) {
      return Response.json({ error: 'Booking data required' }, { status: 400 });
    }

    // Parse the booking time to create proper start/end times
    const dateStr = booking.preferred_date; // e.g., "2025-01-15"
    const timeStr = booking.preferred_time; // e.g., "9:00 AM"
    
    // Convert time string to 24-hour format
    const timeParts = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!timeParts) {
      return Response.json({ error: 'Invalid time format' }, { status: 400 });
    }
    
    let hours = parseInt(timeParts[1]);
    const minutes = parseInt(timeParts[2]);
    const period = timeParts[3].toUpperCase();
    
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    
    // Create start and end times (1 hour duration)
    const startDateTime = new Date(`${dateStr}T${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`);
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // Add 1 hour
    
    // Format for Google Calendar API (ISO format with timezone)
    const formatDateTime = (date) => {
      return date.toISOString();
    };

    const court = booking.selected_court || (booking.selected_courts ? booking.selected_courts[0] : 'N/A');
    const spots = booking.spots_booked || 4;
    const bookingType = booking.booking_type || 'full_court';
    const price = booking.price_paid || 40;
    
    const bookingTypeLabels = {
      'full_court': 'Full Court (4 players)',
      'double_open': 'Double Open Play (2 players)',
      'single_open': 'Single Open Play (1 player)'
    };
    const typeLabel = bookingTypeLabels[bookingType] || 'Court Booking';
    
    // Create calendar event
    const event = {
      summary: `🏓 Court ${court} - ${booking.name} (${spots}/4 spots)`,
      description: `Pickleball Court Booking\n\nType: ${typeLabel}\nCustomer: ${booking.name}\nEmail: ${booking.email}\nPhone: ${booking.phone || 'Not provided'}\nCourt: ${court}\nSpots: ${spots} of 4\nPrice: $${price}\n\nNotes: ${booking.message || 'None'}`,
      start: {
        dateTime: formatDateTime(startDateTime),
        timeZone: 'America/New_York'
      },
      end: {
        dateTime: formatDateTime(endDateTime),
        timeZone: 'America/New_York'
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 60 },
          { method: 'popup', minutes: 30 }
        ]
      }
    };

    // Add event to Google Calendar
    const calendarResponse = await fetch(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
      }
    );

    if (!calendarResponse.ok) {
      const errorData = await calendarResponse.text();
      console.error('Google Calendar API error:', errorData);
      return Response.json({ error: 'Failed to add to calendar', details: errorData }, { status: 500 });
    }

    const createdEvent = await calendarResponse.json();
    console.log('✅ Calendar event created:', createdEvent.id);

    return Response.json({ 
      success: true, 
      eventId: createdEvent.id,
      eventLink: createdEvent.htmlLink 
    });

  } catch (error) {
    console.error('Error adding to Google Calendar:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});