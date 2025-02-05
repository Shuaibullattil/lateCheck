const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const today = new Date();
const weekDay = daysOfWeek[today.getDay()];

const now = new Date();
let hours = now.getHours(); // Get the hour (0-23)
const minutes = now.getMinutes(); // Get the minutes (0-59)

// Determine AM/PM
const ampm = hours >= 12 ? 'PM' : 'AM';

// Convert to 12-hour format
hours = hours % 12;
hours = hours ? hours : 12; // Handle the case when hours == 0 (midnight)

// Format minutes to always show two digits
const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;