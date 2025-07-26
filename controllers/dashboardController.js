//Dependencies
const { v4: uuidv4 } = require('uuid');
const { Boolify } = require('node-boolify');

//Database
const Dashboard = require('../db/Dashboard');

//Helpers
const dashboardHelper = require('../helpers/dashboardHelper');
const responsehelper = require('../helpers/responsehelper');
const languages = require('../db/languages');


//Controller
// Create dashboard admin
exports.create_dashboard_admin = (payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      let plainPassword = dashboardHelper.generateRandomPassword();
      plainPassword = "Jpnews@123"
      console.log("plainPassword==>"+plainPassword)
      const hashedPass = await dashboardHelper.hashPassword(plainPassword);
      
      // Username generation logic
      const usernameCandidates = dashboardHelper.generateUsernames(payload.name, payload.phone);
      let username = null;
      for (const candidate of usernameCandidates) { 
        const exists = await Dashboard.findOne({ username: candidate });
        if (!exists) {
          username = candidate;
          break;
        }
      }
      if (!username) {
        throw { status: false, error_code: 400, message: 'Failed to generate a unique username. Please try again.' };
      }

      const admin = new Dashboard({
        ...payload,
        username,
        pass: hashedPass
      });
      await admin.save();
      resolve({ status: true, message: 'Dashboard admin created successfully.' });
    } catch (error) {
      reject(await responsehelper.Error_Handler(error));
    }
  });
};

exports.login = (payload, admin) => {
  return new Promise(async (resolve, reject) => {
    try {
      const isPasswordValid = await dashboardHelper.comparePassword(payload.password, admin.pass);
      if (!isPasswordValid) throw { status: false, error_code: 400, message: 'Invalid password.' };
      
      const sessionId = uuidv4();
      const updatedAdmin = await Dashboard.findOneAndUpdate(
        { dashAdminId: admin.dashAdminId },
        { sessionId: sessionId },
        { new: true, lean: true, select: '-_id -__v -updatedAt -pass' }
      );
      
      resolve({ 
        status: true, 
        message: 'Login successful.',
        data: updatedAdmin
      });
    } catch (error) {
      reject(await responsehelper.Error_Handler(error));
    }
  });
};

exports.edit_dashboard_admin = async (payload) => {
  return new Promise(async (resolve, reject) => {
  try {
    // Update admin details using updateOne
    await Dashboard.updateOne(
      { dashAdminId: payload.dashAdminId },
      {
        name: payload.name,
        phone: payload.phone,
        email: payload.email,
        roleType: payload.roleType
      }
    );
    resolve({ 
      status: true, 
      message: 'Details Updated successful.',
    });
  } catch (error) {
    reject(await responsehelper.Error_Handler(error));
  }
});
};

exports.edit_Selected_dashboard_admin = async (payload) => {
  return new Promise(async (resolve, reject) => {
  try {
    // Update admin details using updateOne
    await Dashboard.updateOne(
      { dashAdminId: payload.selected_dashAdminId },
      {
        name: payload.name,
        phone: payload.phone,
        email: payload.email,
        roleType: payload.roleType
      }
    );
    resolve({ 
      status: true, 
      message: 'Details Updated successful.',
    });
  } catch (error) {
    reject(await responsehelper.Error_Handler(error));
  }
});
};

exports.update_admin_password = async (payload) => {
  return new Promise(async (resolve, reject) => {
  try {
    const hashedPass = await dashboardHelper.hashPassword(payload.password);
    // Update admin details using updateOne
    await Dashboard.updateOne(
      { dashAdminId: payload.dashAdminId },
      {
        pass: hashedPass,
      }
    );
    resolve({ 
      status: true, 
      message: 'Password Updated successful.',
    });
  } catch (error) {
    reject(await responsehelper.Error_Handler(error));
  }
});
};

exports.update_selected_admin_password = async (payload) => {
  return new Promise(async (resolve, reject) => {
  try {
    const hashedPass = await dashboardHelper.hashPassword(payload.password);
    // Update admin details using updateOne
    await Dashboard.updateOne(
      { dashAdminId: payload.selected_dashAdminId },
      {
        pass: hashedPass,
      }
    );
    resolve({ 
      status: true, 
      message: 'Password Updated successful.',
    });
  } catch (error) {
    reject(await responsehelper.Error_Handler(error));
  }
});
};


exports.inactive_dashboard_admin = async (payload) => {
  return new Promise(async (resolve, reject) => {
  try {
    // Update admin details using updateOne
    await Dashboard.updateOne(
      { dashAdminId: payload.selected_dashAdminId},
      {
        isActive: false
      }
    );
    resolve({ 
      status: true, 
      message: 'Admin Inactivated successful.',
    });
  } catch (error) {
    reject(await responsehelper.Error_Handler(error));
  }
});
};

exports.active_dashboard_admin = async (payload) => {
  return new Promise(async (resolve, reject) => {
  try {
    // Update admin details using updateOne
    await Dashboard.updateOne(
      { dashAdminId: payload.selected_dashAdminId },
      {
        isActive: true
      }
    );
    resolve({ 
      status: true, 
      message: 'Admin activated successful.',
    });
  } catch (error) {
    reject(await responsehelper.Error_Handler(error));
  }
});
};

exports.list_dashboard_admins = async (payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      const skip = parseInt(payload.skip) || 0;
      const limit = parseInt(payload.limit) || 10;

      let filter = {};

      if (Boolify(payload.isActiveFilter)) {
        filter.isActive = payload.isActive;
      }

      if (Boolify(payload.isRoleTypeFilter)) {
        filter.roleType = payload.roleType;
      }

      if (Boolify(payload.isSearchFilter)) {
        let searchInput = {
           $regex: String(payload.search),
           $options: "i",
        };
        filter.$or = [
           {
              name: searchInput,
           },
           {
              email: searchInput,
           },
           {
              phone: searchInput,
           },
           {
              username: searchInput,
           },
        ];
      }
      const totalCount = await Dashboard.countDocuments(filter);
      const data = await Dashboard.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .select('-_id -__v -updated_at -pass') // Keep `pass` for decryption
        .lean();

      resolve({
        status: true,
        message: 'Dashboard admin list fetched successfully.',
        data,
        totalCount
      });
    } catch (error) {
      reject(await responsehelper.Error_Handler(error));
    }
  });
};

//lagunages

exports.add_language = (payload) => {
  return new Promise(async (resolve, reject) => {
    try { 
      console.log("eneer")     
      let languageId = await dashboardHelper.fetchlanguageID();
      console.log("eneereeee")     
      await languages.create({languageId: languageId, name: payload.name});
      resolve({ status: true, message: 'language created successfully.' });
    } catch (error) {
      reject(await responsehelper.Error_Handler(error));
    }
  });
};

exports.edit_language = (payload) => {
  return new Promise(async (resolve, reject) => {
    try {     
      console.log("eneterdddd") 
      await languages.updateOne(
        { languageId: payload.languageId },
        {
          name: payload.name,
        }
      );
      resolve({ 
        status: true, 
        message: 'language Updated successful.',
      });
    } catch (error) {
      reject(await responsehelper.Error_Handler(error));
    }
  });
};

exports.disable_language = (payload) => {
  return new Promise(async (resolve, reject) => {
    try {      
      await languages.updateOne(
        { languageId: payload.languageId },
        {
          isActive: false
        }
      );
      resolve({ 
        status: true, 
        message: 'language disabled successful.',
      });
    } catch (error) {
      reject(await responsehelper.Error_Handler(error));
    }
  });
};

exports.enable_language = (payload) => {
  return new Promise(async (resolve, reject) => {
    try {      
      await languages.updateOne(
        { languageId: payload.languageId },
        {
          isActive: true
        }
      );
      resolve({ 
        status: true, 
        message: 'language enabled successful.',
      });
    } catch (error) {
      reject(await responsehelper.Error_Handler(error));
    }
  });
};

exports.list_all_languages = async (payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      const skip = parseInt(payload.skip) || 0;
      const limit = parseInt(payload.limit) || 10;

      let filter = {};

      if (Boolify(payload.isActiveFilter)) {
        filter.isActive = payload.isActive;
      }

      if (Boolify(payload.isSearchFilter)) {
        let searchInput = {
           $regex: String(payload.search),
           $options: "i",
        };
        filter.$or = [
           {
              name: searchInput,
           },
        ];
      }
      const totalCount = await languages.countDocuments(filter);
      const data = await languages.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ name: 1 })
        .select('-_id -__v -createdAt -updatedAt')
        .lean();

      resolve({
        status: true,
        message: 'Languages list fetched successfully.',
        data,
        totalCount
      });
    } catch (error) {
      reject(await responsehelper.Error_Handler(error));
    }
  });
};




