const responsehelper = function () {};  

responsehelper.Response_Handler = (res, Result) => {
   return new Promise(async (resolve) => {
      try {
         if (Result.status) {
            if (!res.headersSent) {
               resolve(res.status(200).json(Result));
            } else {
               resolve("Already Sent");
            }
         } else if (!Result.status) {
            if (!res.headersSent) {
               resolve(res.status(200).json(await responsehelper.Error_Handler(Result)));
            } else {
               resolve("Already Sent");
            }
         } else {
            if (!res.headersSent) {
               resolve(res.status(200).json({ status: false, message: 'Server Error', error_code: 400 }));
            } else {
               resolve("Already Sent");
            }
         }
      } catch (error) {
         console.error("Something Response Handler--->", error);
         if (!res.headersSent) {
            resolve(res.status(200).json({ status: false, error_code: 400, message: error.message || error }));
         } else {
            resolve("Already Sent");
         }
      }
   });
};

responsehelper.Error_Handler = (error) => {
   return new Promise(async (resolve) => {
      try {
         console.error("Common_Error_Handler---------->", error);
         if (error.status === null || error.status === undefined) {
            if (error instanceof SyntaxError) {
               resolve({ status: false, error_code: 400, message: 'Internal Server Error' });
            } else {
               resolve({ status: false, error_code: 400, message: 'Internal Server Error' });
            }
         } else {
            resolve(error);
         }
      } catch (error) {
         console.error("Something Error Handler--->", error);
         resolve({ status: false, error_code: 400, error: error.message || error });
      }
   });
};

module.exports = responsehelper;
