const express = require('express');
const router = express.Router();
const agController = require('../controller/stdController');

router.get('/get', agController.getStudent);
router.post('/getServerSide', agController.getStudentsServerSide); 
router.post('/add', agController.addStudent);
router.put('/update/:regNo', agController.updateStudent);
router.delete('/delete/:regNo', agController.deleteStudent);

module.exports = router;