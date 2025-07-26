//Dependency
const Joi = require('joi');
//helper
const dashboardHelper = require('../helpers/dashboardHelper');
const dashboardController = require('../controllers/dashboardController');
const responsehelper = require('../helpers/responsehelper');

// Joi schema defined directly here


const DashboardMediator = {};

DashboardMediator.create_dashboard_admin = async (req, res) => {
  try {
    let payload = JSON.parse(JSON.stringify(req.body));
    let createDashboardAdminSchema = Joi.object({
        name: Joi.string().min(2).max(50).required(),
        phone: Joi.string().min(10).required(),
        email: Joi.string().email().required(),
        roleType: Joi.number().valid(1, 2, 3).required()
      });
    const { error, value } = createDashboardAdminSchema.validate({ ...payload });
    if (error) throw { status: false, error_code: 400, message: error.details[0].message };
    await dashboardHelper.isEmailExistsForOtherAdmin(value.email, "");
    await dashboardHelper.isPhoneExistsForOtherAdmin(value.phone, "");
    const result = await dashboardController.create_dashboard_admin(payload);
    await responsehelper.Response_Handler(res, result);
  } catch (error) {
    await responsehelper.Response_Handler(res, error);
  }
};

DashboardMediator.login = async (req, res) => {
  try {
    let payload = JSON.parse(JSON.stringify(req.body));
    let loginSchema = Joi.object({
      username: Joi.string().required(),
      password: Joi.string().required()
    });
    const { error, value } = loginSchema.validate({ ...payload });
    if (error) throw { status: false, error_code: 400, message: error.details[0].message };
    let admin = await dashboardHelper.isUsernameExists(value.username);
    const result = await dashboardController.login(value, admin);
    await responsehelper.Response_Handler(res, result);    
  } catch (error) {
    await responsehelper.Response_Handler(res, error);
  }
};

DashboardMediator.edit_dashboard_admin = async (req, res) => {
  try {
    let payload = JSON.parse(JSON.stringify(req.body));
    let editDashboardAdminSchema = Joi.object({
      dashAdminId: Joi.string().required(),
      sessionId: Joi.string().required(),
      name: Joi.string().min(2).max(50).required(),
      phone: Joi.string().min(10).required(),
      email: Joi.string().email().required(),
      roleType: Joi.number().valid(1, 2, 3).required()
    });
    const { error, value } = editDashboardAdminSchema.validate({ ...payload });
    if (error) throw { status: false, error_code: 400, message: error.details[0].message };
    await dashboardHelper.validateAdminActiveSession(value.dashAdminId, value.sessionId);
    await dashboardHelper.isEmailExistsForOtherAdmin(value.email, value.dashAdminId);
    await dashboardHelper.isPhoneExistsForOtherAdmin(value.phone, value.dashAdminId);
    const result = await dashboardController.edit_dashboard_admin(value);
    await responsehelper.Response_Handler(res, result);
  } catch (error) {
    await responsehelper.Response_Handler(res, error);
  }
};

DashboardMediator.edit_Selected_dashboard_admin = async (req, res) => {
  try {
    let payload = JSON.parse(JSON.stringify(req.body));
    let editselectedDashboardAdminSchema = Joi.object({
      dashAdminId: Joi.string().required(),
      sessionId: Joi.string().required(),
      selected_dashAdminId: Joi.string().required(),
      name: Joi.string().min(2).max(50).required(),
      phone: Joi.string().min(10).required(),
      email: Joi.string().email().required(),
      roleType: Joi.number().valid(1, 2, 3).required()
    });
    const { error, value } = editselectedDashboardAdminSchema.validate({ ...payload });
    if (error) throw { status: false, error_code: 400, message: error.details[0].message };
    await dashboardHelper.validateAdminActiveSession(value.dashAdminId, value.sessionId);
    await dashboardHelper.validateAdmin(value.selected_dashAdminId)
    await dashboardHelper.isEmailExistsForOtherAdmin(value.email, value.dashAdminId);
    await dashboardHelper.isPhoneExistsForOtherAdmin(value.phone, value.dashAdminId);
    const result = await dashboardController.edit_Selected_dashboard_admin(value);
    await responsehelper.Response_Handler(res, result);
  } catch (error) {
    await responsehelper.Response_Handler(res, error);
  }
};

DashboardMediator.update_admin_password = async (req, res) => {
  try {
    let payload = JSON.parse(JSON.stringify(req.body));
    let editDashboardAdminSchema = Joi.object({
      dashAdminId: Joi.string().required(),
      sessionId: Joi.string().required(),
      password: Joi.string().required(),
    });
    const { error, value } = editDashboardAdminSchema.validate({ ...payload });
    if (error) throw { status: false, error_code: 400, message: error.details[0].message };
    await dashboardHelper.validateAdminActiveSession(value.dashAdminId, value.sessionId);
    const result = await dashboardController.update_admin_password(value);
    await responsehelper.Response_Handler(res, result);
  } catch (error) {
    await responsehelper.Response_Handler(res, error);
  }
};


DashboardMediator.update_selected_admin_password = async (req, res) => {
  try {
    let payload = JSON.parse(JSON.stringify(req.body));
    let upadateDashboardAdminpassSchema = Joi.object({
      dashAdminId: Joi.string().required(),
      sessionId: Joi.string().required(),
      selected_dashAdminId: Joi.string().required(),
      password: Joi.string().required(),
    });
    const { error, value } = upadateDashboardAdminpassSchema.validate({ ...payload });
    if (error) throw { status: false, error_code: 400, message: error.details[0].message };
    await dashboardHelper.validateAdminActiveSession(value.dashAdminId, value.sessionId);
    await dashboardHelper.validateAdmin(value.selected_dashAdminId)
    const result = await dashboardController.update_selected_admin_password(value);
    await responsehelper.Response_Handler(res, result);
  } catch (error) {
    await responsehelper.Response_Handler(res, error);
  }
};

DashboardMediator.inactive_dashboard_admin = async (req, res) => {
  try {
    let payload = JSON.parse(JSON.stringify(req.body));
    let inactiveDashboardAdminSchema = Joi.object({
      dashAdminId: Joi.string().required(),
      sessionId: Joi.string().required(),
      selected_dashAdminId: Joi.string().required()
    });
    const { error, value } = inactiveDashboardAdminSchema.validate({ ...payload });
    if (error) throw { status: false, error_code: 400, message: error.details[0].message };
    await dashboardHelper.validateAdminActiveSession(value.dashAdminId, value.sessionId);
    await dashboardHelper.validateAdmin(value.selected_dashAdminId)
    await dashboardHelper.validateAdminSelectedAdmin(value)
    const result = await dashboardController.inactive_dashboard_admin(value);
    await responsehelper.Response_Handler(res, result);
  } catch (error) {
    await responsehelper.Response_Handler(res, error);
  }
};

DashboardMediator.active_dashboard_admin = async (req, res) => {
  try {
    let payload = JSON.parse(JSON.stringify(req.body));
    let activeDashboardAdminSchema = Joi.object({
      dashAdminId: Joi.string().required(),
      sessionId: Joi.string().required(),
      selected_dashAdminId: Joi.string().required()
    });
    const { error, value } = activeDashboardAdminSchema.validate({ ...payload });
    if (error) throw { status: false, error_code: 400, message: error.details[0].message };
    await dashboardHelper.validateAdminActiveSession(value.dashAdminId, value.sessionId);
    await dashboardHelper.validateAdmin(value.selected_dashAdminId)
    await dashboardHelper.validateAdminSelectedAdmin(value)
    const result = await dashboardController.active_dashboard_admin(value);
    await responsehelper.Response_Handler(res, result);
  } catch (error) {
    await responsehelper.Response_Handler(res, error);
  }
};

DashboardMediator.list_dashboard_admins = async (req, res) => {
  try {
    let payload = JSON.parse(JSON.stringify(req.body));
    let listDashboardAdminSchema = Joi.object({
      dashAdminId: Joi.string().required(),
      sessionId: Joi.string().required(),
      skip: Joi.number().required(),
      limit: Joi.number().required()
    }).unknown()
    const { error, value } = listDashboardAdminSchema.validate({ ...payload });
    if (error) throw { status: false, error_code: 400, message: error.details[0].message };
    await dashboardHelper.validateAdminActiveSession(value.dashAdminId, value.sessionId);
    const result = await dashboardController.list_dashboard_admins(value);
    await responsehelper.Response_Handler(res, result);
  } catch (error) {
    await responsehelper.Response_Handler(res, error);
  }
};

//Languages

DashboardMediator.add_language = async (req, res) => {
  try {
    let payload = JSON.parse(JSON.stringify(req.body));
    console.log("payload")     
    let addlanguageSchema = Joi.object({
      dashAdminId: Joi.string().required(),
      sessionId: Joi.string().required(),
      name: Joi.string().required(),
    }).unknown()
    const { error, value } = addlanguageSchema.validate({ ...payload });
    if (error) throw { status: false, error_code: 400, message: error.details[0].message };
    await dashboardHelper.validateAdminActiveSession(value.dashAdminId, value.sessionId);
    await dashboardHelper.isLanguageNameExist(value.name, "");
    const result = await dashboardController.add_language(value);
    await responsehelper.Response_Handler(res, result);
  } catch (error) {
    await responsehelper.Response_Handler(res, error);
  }
};

DashboardMediator.edit_language = async (req, res) => {
  try {
    let payload = JSON.parse(JSON.stringify(req.body));
    let editDashboardAdminSchema = Joi.object({
      dashAdminId: Joi.string().required(),
      sessionId: Joi.string().required(),
      languageId: Joi.string().required(),
      name: Joi.string().required(),
    }).unknown()
    const { error, value } = editDashboardAdminSchema.validate({ ...payload });
    if (error) throw { status: false, error_code: 400, message: error.details[0].message };
    await dashboardHelper.validateAdminActiveSession(value.dashAdminId, value.sessionId);
    await dashboardHelper.validatlanguage(value.languageId);
    await dashboardHelper.isLanguageNameExist(value.name, value.languageId);
    const result = await dashboardController.edit_language(value);
    await responsehelper.Response_Handler(res, result);
  } catch (error) {
    await responsehelper.Response_Handler(res, error);
  }
};

DashboardMediator.disable_language = async (req, res) => {
  try {
    let payload = JSON.parse(JSON.stringify(req.body));
    let editDashboardAdminSchema = Joi.object({
      dashAdminId: Joi.string().required(),
      sessionId: Joi.string().required(),
      languageId: Joi.string().required(),
    }).unknown()
    const { error, value } = editDashboardAdminSchema.validate({ ...payload });
    if (error) throw { status: false, error_code: 400, message: error.details[0].message };
    await dashboardHelper.validateAdminActiveSession(value.dashAdminId, value.sessionId);
    await dashboardHelper.validatlanguage(value.languageId);
    const result = await dashboardController.disable_language(value);
    await responsehelper.Response_Handler(res, result);
  } catch (error) {
    await responsehelper.Response_Handler(res, error);
  }
};

DashboardMediator.enable_language = async (req, res) => {
  try {
    let payload = JSON.parse(JSON.stringify(req.body));
    let editDashboardAdminSchema = Joi.object({
      dashAdminId: Joi.string().required(),
      sessionId: Joi.string().required(),
      languageId: Joi.string().required(),
    }).unknown()
    const { error, value } = editDashboardAdminSchema.validate({ ...payload });
    if (error) throw { status: false, error_code: 400, message: error.details[0].message };
    await dashboardHelper.validateAdminActiveSession(value.dashAdminId, value.sessionId);
    await dashboardHelper.validatlanguage(value.languageId);
    const result = await dashboardController.enable_language(value);
    await responsehelper.Response_Handler(res, result);
  } catch (error) {
    await responsehelper.Response_Handler(res, error);
  }
};

DashboardMediator.list_all_languages = async (req, res) => {
  try {
    let payload = JSON.parse(JSON.stringify(req.body));
    let editDashboardAdminSchema = Joi.object({
      dashAdminId: Joi.string().required(),
      sessionId: Joi.string().required(),
      skip: Joi.number().required(),
      limit: Joi.number().required()
    }).unknown()
    const { error, value } = editDashboardAdminSchema.validate({ ...payload });
    if (error) throw { status: false, error_code: 400, message: error.details[0].message };
    await dashboardHelper.validateAdminActiveSession(value.dashAdminId, value.sessionId);
    const result = await dashboardController.list_all_languages(value);
    await responsehelper.Response_Handler(res, result);
  } catch (error) {
    await responsehelper.Response_Handler(res, error);
  }
};
module.exports = DashboardMediator; 