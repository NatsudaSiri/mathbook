const express = require('express')
const router = express.Router()
const {user} = require('../service/user_service')
const {timetable} = require('../service/timetable_service')

router.post('/login', async (req, res) => {
    users =  await user(req)
    res.json(users)
    console.log(users)
   
});

router.get('/timetable', async (req, res) => {
    times = await timetable(req)
    res.status(200).json(times);
    console.log(times)
   })


module.exports = router;
