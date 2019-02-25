const time = require('../models/timetable')
const subject = require('../models/subject')
const timetable = async function (req) {
    if (req.param('catalogNumber') != '') {
        return subject.findAll({
            where: {
                catalogNumber: req.param('catalogNumber')
            }, attributes: ['CatalogNumber', 'CourseTitle', 'Instructor', 'Term'],
            include: [{
                model: time,
                required: true, attributes: ['MeetingDay', 'StartTime', 'EndTime', 'Room'],
            }]
        })

            .then(subject => {
                if (time) {
                    subject = JSON.stringify(subject).replace(/timetables/g, 'Timetables')
                    console.log(">"+JSON.parse(subject))
                    return JSON.parse(subject)

                } else {
                    return 'CatalogNumber does not exist'
                }
            })
            .catch(err => {
                return 'error: ' + err
            })
    }
}
module.exports = { timetable }