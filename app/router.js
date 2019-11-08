'use strict';

/**
 * @param {Egg.Application} app - egg application
 */

module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/getFormInfo', controller.form.getFormInfo);
  router.post('/getFundInfo', controller.form.getFundInfo);
  router.post('/setFundInfo', controller.form.setFundInfo);
};
