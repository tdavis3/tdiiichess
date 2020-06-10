const request = require("request-promise");
const cheerio = require("cheerio");
const parseFullName = require("parse-full-name").parseFullName;

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

const ratingparser = ratingstr => {
    const splitarray = ratingstr.split("*", 2);
    if (splitarray.length === 1) {
        // Provisional rating
        return splitarray[0].split("/", 2)[0];
    }
    return splitarray[0].trim(); // Rating
};

const getUSCFhtml = async (partialuscfURI, uscfid) => {
    const uscfURI = partialuscfURI.concat(uscfid);
    try {
        const body = await request(uscfURI);
        const $ = cheerio.load(body);
        const tr = $("tr");
        const memfide = tr
            .find('[name="memfideid"]')
            .val()
            .split("-", 2); // Only two splits (id, country)
        const name = parseFullName(tr.find('[name="memname"]').val());
        const ret = {
            uscfId: tr.find('[name="memid"]').val(),
            expires: tr.find('[name="memexpdt"]').val(),
            firstName: toTitleCase(name.first),
            middleName: toTitleCase(name.middle),
            lastName: toTitleCase(name.last),
            suffix: (name.suffix.includes("i") || name.suffix.includes("I")) ? name.suffix.toUpperCase() : toTitleCase(name.suffix),
            regRating: ratingparser(tr.find('[name="rating1"]').val()),
            quickRating: ratingparser(tr.find('[name="rating2"]').val()),
            blitzRating: ratingparser(tr.find('[name="rating3"]').val()),
            state: tr.find('[name="state_country"]').val(),
            fideId: memfide[0].trim(),
            fideCountry: memfide[1].trim(),
            fideRating: tr
                .find('[name="rating4"]')
                .val()
                .split(" ", 2)[0]
                .trim()
        };
        return ret;
    } catch (err) {
        return null;
    }
};

module.exports = getUSCFhtml;
