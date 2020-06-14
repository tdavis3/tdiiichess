// Helper functions used throughout the client

let moment = require('moment');
moment().format();

export function dateRenderer(startDate, endDate) {
    const start = moment(startDate);
    const end = moment(endDate);
    return (
        start.isSame(end) ?
            start.format("MM/DD/YYYY") :
            start.format("MM/DD/YYYY").concat(" - ", end.format("MM/DD/YYYY"))
    );
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
