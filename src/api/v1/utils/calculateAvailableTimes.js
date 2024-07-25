const moment = require('moment');

const calculateAvailableTimes = (occupiedTimes, workingHoursStart, workingHoursEnd) => {
  let availableTimes = [];

  occupiedTimes.sort((a, b) => a.startTime - b.startTime);

  let lastEndTime = workingHoursStart;

  occupiedTimes.forEach(timeSlot => {
    if (timeSlot.startTime > lastEndTime) {
      availableTimes.push({
        start: new Date(lastEndTime),
        end: new Date(timeSlot.startTime),
      });
    }
    lastEndTime = Math.max(lastEndTime, timeSlot.endTime);
  });

  if (lastEndTime < workingHoursEnd) {
    availableTimes.push({
      start: new Date(lastEndTime),
      end: new Date(workingHoursEnd),
    });
  }

  return filterDurations(availableTimes);
};

const filterDurations = (availableTimes) => {
  const minDuration = 1; // in hours
  const maxDuration = 8; // in hours
  let filteredTimes = [];

  availableTimes.forEach(timeSlot => {
    const slotStart = moment(timeSlot.start);
    const slotEnd = moment(timeSlot.end);
    const duration = slotEnd.diff(slotStart, 'hours');

    if (duration >= minDuration && duration <= maxDuration) {
      filteredTimes.push({
        start: slotStart.toDate(),
        end: slotEnd.toDate(),
        duration,
      });
    }
  });

  return filteredTimes;
};

module.exports = calculateAvailableTimes;