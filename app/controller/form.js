'use strict';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
//
const adapter = new FileSync('db.json');
const db = low(adapter);


const defaultData = [
  { fundCode: '10001', fundName: '信发基金', stock: '32', cost: '40', marketValue: '60', ratio: '11' },
  { fundCode: '10002', fundName: '蓝信基金', stock: '20', cost: '2', marketValue: '20', ratio: '0.5' },
  { fundCode: '10012', fundName: '建光银行', stock: '115', cost: '12', marketValue: '20', ratio: '7' },
  { fundCode: '10013', fundName: '紫岛基金', stock: '11', cost: '34', marketValue: '68', ratio: '1.2' },
  { fundCode: '10213', fundName: '中利智能', stock: '40', cost: '5', marketValue: '76', ratio: '12' },
  { fundCode: '10224', fundName: '广非证券', stock: '66', cost: '37', marketValue: '40', ratio: '4' },
  { fundCode: '10246', fundName: '华岛银行', stock: '68', cost: '21', marketValue: '15', ratio: '0.3' },
  { fundCode: '13401', fundName: '青龙重工', stock: '120', cost: '260', marketValue: '1260', ratio: '18.6' },
  { fundCode: '10881', fundName: '广达智能', stock: '12', cost: '95', marketValue: '146', ratio: '1.1' },
  { fundCode: '19561', fundName: '华欣证券', stock: '12', cost: '50', marketValue: '50', ratio: '0.5' },

  { fundCode: '21013', fundName: '立辛保险', stock: '11', cost: '34', marketValue: '68', ratio: '1.2' },
  { fundCode: '21213', fundName: '清发基金', stock: '40', cost: '5', marketValue: '76', ratio: '12' },
  { fundCode: '21005', fundName: '西非证券', stock: '32', cost: '40', marketValue: '60', ratio: '11' },
  { fundCode: '21006', fundName: '间哒银行', stock: '20', cost: '2', marketValue: '20', ratio: '0.5' },
  { fundCode: '21014', fundName: '非金资产', stock: '115', cost: '12', marketValue: '20', ratio: '7' },
  { fundCode: '21226', fundName: '任工智能', stock: '66', cost: '37', marketValue: '40', ratio: '4' },
  { fundCode: '21246', fundName: '光岛银行', stock: '68', cost: '21', marketValue: '15', ratio: '0.3' },
  { fundCode: '23401', fundName: '重光证券', stock: '120', cost: '160', marketValue: '260', ratio: '18.6' },
  { fundCode: '20881', fundName: '广达智能', stock: '12', cost: '95', marketValue: '146', ratio: '1.1' },
  { fundCode: '29561', fundName: '华欣证券', stock: '12', cost: '50', marketValue: '50', ratio: '0.5' },

  { fundCode: '30215', fundName: '中利智能', stock: '40', cost: '5', marketValue: '76', ratio: '12' },
  { fundCode: '30224', fundName: '广非证券', stock: '66', cost: '37', marketValue: '40', ratio: '4' },
  { fundCode: '30201', fundName: '信发基金', stock: '32', cost: '40', marketValue: '60', ratio: '11' },
  { fundCode: '30202', fundName: '蓝信基金', stock: '20', cost: '2', marketValue: '20', ratio: '0.5' },
  { fundCode: '30212', fundName: '建光银行', stock: '115', cost: '12', marketValue: '20', ratio: '7' },
  { fundCode: '30213', fundName: '紫岛基金', stock: '11', cost: '34', marketValue: '68', ratio: '1.2' },
  { fundCode: '30246', fundName: '华岛银行', stock: '68', cost: '21', marketValue: '15', ratio: '0.3' },
  { fundCode: '33401', fundName: '青龙重工', stock: '120', cost: '260', marketValue: '1260', ratio: '18.6' },
  { fundCode: '30881', fundName: '广达智能', stock: '12', cost: '95', marketValue: '146', ratio: '1.1' },
  { fundCode: '39561', fundName: '华欣证券', stock: '12', cost: '50', marketValue: '50', ratio: '0.5' },
];


// Set some defaults
db.defaults({ fundData: defaultData })
  .write();

const Controller = require('egg').Controller;

const doPageFilter = (limit = 10, currentPage, data) => {
  if (!limit || !currentPage) {
    return data;
  }
  const res = data.filter((item, index) => {
    return index >= limit * (currentPage - 1) && index < limit * currentPage;
  });
  return res;
};


class FormController extends Controller {
  async getFormInfo() {
    const { ctx } = this;
    ctx.body = 'hi, egg form';
  }

  async getFundInfo() {
    const { ctx } = this;
    const { searchInfo } = ctx.request.body;
    let { page = 1, limit = 10 } = ctx.request.body;
    page = page <= 0 ? 1 : page;
    limit = limit || 10;
    let defaultFundData = [ ...db.get('fundData').value() ];


    const { fundCode, fundName, stock, cost, marketValue, ratio } = searchInfo;
    const isNullInfo = (!fundCode || fundCode === '') && (!fundName || fundName === '') && (!stock || stock === '') && (!cost || cost === '') && (!marketValue || marketValue === '') && (!ratio || ratio === '');
    if (!isNullInfo) {


      for (const key in searchInfo) {
        defaultFundData = defaultFundData.filter(item => {
          if (!searchInfo[key] || !item[key]) {
            return item;
          }
          return searchInfo[key] && item[key].toString().indexOf(searchInfo[key].toString()) !== -1;
        });
      }
    }
    const total = defaultFundData.length;
    defaultFundData = doPageFilter(limit, page, defaultFundData);
    ctx.body = {
      data: defaultFundData,
      total,
    };
  }

  async setFundInfo() {
    const { ctx } = this;
    const { info, limit = 10 } = ctx.request.body;
    let { page = 1 } = ctx.request.body;
    page = page <= 0 ? 1 : page;
    const defaultFundData = [ ...db.get('fundData').value() ];
    const hasSameItem = defaultFundData.some(item => {
      const { fundCode } = item;
      return String(fundCode) === String(info.fundCode);
    });
    if (!hasSameItem) {
      defaultFundData.unshift(info);
      db.set('fundData', defaultFundData)
        .write();
    }
    const total = defaultFundData.length;

    const filterData = doPageFilter(limit, page, defaultFundData);
    ctx.body = {
      data: filterData,
      total,
      status: 200,
    };
  }

}

module.exports = FormController;
