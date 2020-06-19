// Helper functions used throughout the client

let moment = require('moment');
moment().format();

export function dateRenderer(startDate, endDate) {
    const start = moment(startDate);
    const end = moment(endDate);
    const startMonth = start.format('MMM');
    const endMonth = end.format('MMM');
    const startDay = start.format('D');
    const endDay = end.format('D');
    const startYear = start.format('YYYY');
    if (start.isSame(end, 'month') || start.isSame(end, 'day')) {  // Checks for same month and year
        if (startDay === endDay) {  // Jan 12, 2022
            return startMonth.concat(" ", startDay, ", ", startYear);
        } else {  // Jan 12-13, 2022
            return startMonth.concat(" ", startDay, "-", endDay, ", ", startYear);
        }
    } else if (start.isSame(end, 'year') && start.diff(end, 'month') !== 0) {  // Same year, but different month
        // Jan 12 - Feb 13, 2022
        return startMonth.concat(" ", startDay, " - ", endMonth, " ", endDay, ", ", startYear);
    } else {
        // Jan 15, 2022 - Jan 23, 2023  ||  Dec 15, 2022 - Jan 5, 2023
        const formattedStart = start.format('MMM D, YYYY');
        const formattedEnd = end.format('MMM D, YYYY');
        return formattedStart.concat(' - ', formattedEnd);
    }
    return 'Error';
}

export function tournament_status(startDate, endDate) {
    const today = moment();
    const start = moment(startDate);
    const end = moment(endDate);
    if (today.isBefore(start)) {
        return 'Not started';
    } else if (today.isBetween(start, end)) {
        return 'In progress';
    } else if (today.isAfter(end)) {
        return 'Completed';
    }
}

const EMAIL_VALIDATION_REGEX = /\S+@\S+\.\S+/;
export function isValidEmail (value) {
    return EMAIL_VALIDATION_REGEX.test(value);
}