const express = require('express');
const dashboardMediator = require('../mediator/dashboardMediator');
const router = express.Router();


// Dashboard Admin Apis

router.post('/create_dashboard_admin', dashboardMediator.create_dashboard_admin);

router.post('/login', dashboardMediator.login);

router.put('/edit_dashboard_admin', dashboardMediator.edit_dashboard_admin);

router.put('/edit_Selected_dashboard_admin', dashboardMediator.edit_Selected_dashboard_admin);

router.patch('/update_admin_password', dashboardMediator.update_admin_password);

router.patch('/update_selected_admin_password', dashboardMediator.update_selected_admin_password);

router.patch('/inactive_dashboard_admin', dashboardMediator.inactive_dashboard_admin);

router.patch('/active_dashboard_admin', dashboardMediator.active_dashboard_admin);

router.post('/list_dashboard_admins', dashboardMediator.list_dashboard_admins);

//Languages

router.post('/add_language', dashboardMediator.add_language);

router.post('/edit_language', dashboardMediator.edit_language);

router.post('/disable_language', dashboardMediator.disable_language);

router.post('/enable_language', dashboardMediator.enable_language);

router.post('/list_all_languages', dashboardMediator.list_all_languages);

//Languages




module.exports = router; 