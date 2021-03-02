import assetsAuction from '../../assets/img/components/assets-auction.png'
import subrogation from '../../assets/img/components/subrogation.png'
import { auctionMarkReadApi, subrogationTrialMarkReadApi, subrogationCourtMarkReadApi, subrogationJudgmentMarkReadApi } from '../../services/monitor';
import moment from "moment";
moment.locale('zh-cn');

// 1：资产拍卖 2：代位权-立案 3：代位权-开庭 4：代位权-涉诉 5：破产立案 6：破产公告 7：涉诉-立案 8：涉诉-开庭 9：涉诉-涉诉
const getPlot = (type: number) => {
  switch (type) {
    case 1: return assetsAuction;
    case 2: return subrogation;
    case 3: return subrogation;
    case 4: return subrogation;
    case 5: return subrogation;
    case 6: return subrogation;
    case 7: return subrogation;
    case 8: return subrogation;
    default: return assetsAuction;
  }
};

// const status = 1-即将开始、3-正在进行、5-已成交、7-已流拍、9-中止、11-撤回
const getAuctionStatus = (status: number) => {
  let title: string = '即将开始';
  switch (status) {
    case 1: title = '即将开始'; break;
    case 3: title = '正在进行'; break;
    case 5: title = '已成交'; break;
    case 7: title = '已流拍'; break;
    case 9: title = '中止'; break;
    case 11: title = '撤回'; break;
  }
  return title
};


// 角色类型:0-未知 1-资产所有人 2-债权人 3-资产线索 4-起诉人 5-竞买人
const getAuctionRoleType = (role: number) => {
  let roleType: string = '未知';
  switch (role) {
    case 0: roleType = '未知'; break;
    case 1: roleType = '资产所有人'; break;
    case 2: roleType = '债权人'; break;
    case 3: roleType = '资产线索'; break;
    case 4: roleType = '起诉人'; break;
    case 5: roleType = '竞买人'; break;
  }
  return roleType
};



const getRiskTag = (valueLevel: number) => {
  let title: string = '高风险';
  switch (valueLevel) {
    case 90: title = '高风险'; break;
    case 80: title = '警示'; break;
    case 60: title = '提示'; break;
    case 40: title = '利好'; break;
  }
  return title
};

const getTitleTag = (type: number, bankruptcyType?: number) => {
  let title: string = '资产拍卖';
  switch (type) {
    case 1: title = '资产拍卖'; break;
    case 2: title = '代位权-立案'; break;
    case 3: title = '代位权-开庭'; break;
    case 4: title = '代位权-文书'; break;
    case 5: title = bankruptcyType === 1 ? '破产重整立案' : '破产重整公告'; break;
    case 6: title = '涉诉-立案'; break;
    case 7: title = '涉诉-开庭'; break;
    case 8: title = '涉诉-立案'; break;
  }
  return title
};

const getObligorName = (type: number, detail) => {
  let name: string = '';
  switch (type) {
    case 1: name = detail.obligorName; break;
    case 2:
    case 3:
    case 4:
      let subrogationParties = detail.parties.filter(item => item.roleType === 1 && item.obligorId > 0);
      name = subrogationParties.map(item => { return item.name}).join();
      break;
    case 5: name = detail.obligorName; break;
    case 6:
    case 7:
    case 8:
      let litigationParties = detail.parties.filter(item => item.roleType === 2 && item.obligorId > 0);
      name = litigationParties.map(item => { return item.name}).join();
      break;
  }
  console.log('name === ', name);
  return name
};


const getTime = (type: number, detail) => {
  let date = new Date();
  let currentTime = moment(date.valueOf());
  let time = moment(detail.gmtCreate);
  let long = currentTime.diff(time, 'days');
  let showTime = moment(detail.gmtCreate).format('YYYY-MM-DD');
  switch (type) {
    case 1: showTime = long > 1 ?  moment(detail.gmtCreate).format('YYYY-MM-DD') : moment(detail.gmtCreate).fromNow(); break;
    case 2: showTime = long > 1 ?  moment(detail.gmtCreate).format('YYYY-MM-DD') : moment(detail.gmtCreate).fromNow(); break;
    case 3: showTime = long > 1 ?  moment(detail.gmtCreate).format('YYYY-MM-DD') : moment(detail.gmtCreate).fromNow(); break;
    case 4: showTime = long > 1 ?  moment(detail.gmtCreate).format('YYYY-MM-DD') : moment(detail.gmtCreate).fromNow(); break;
    case 5: showTime = long > 1 ?  moment(detail.gmtCreate).format('YYYY-MM-DD') : moment(detail.gmtCreate).fromNow(); break;
    case 6: showTime = long > 1 ?  moment(detail.gmtCreate).format('YYYY-MM-DD') : moment(detail.gmtCreate).fromNow(); break;
    case 7: showTime = long > 1 ?  moment(detail.gmtCreate).format('YYYY-MM-DD') : moment(detail.gmtCreate).fromNow(); break;
    case 8: showTime = long > 1 ?  moment(detail.gmtCreate).format('YYYY-MM-DD') : moment(detail.gmtCreate).fromNow(); break;
  }
  return showTime
};


const getJumpType = (type) => {
  let apiName;
  let url: string = '';
  switch (type) {
    case 1: apiName = auctionMarkReadApi; url = '/subpackage/pages/monitor/asset-auction/index'; break;
    case 2: apiName = subrogationTrialMarkReadApi; url = '/subpackage/pages/monitor/asset-auction/index'; break;
    case 3: apiName = subrogationCourtMarkReadApi; url = '/subpackage/pages/monitor/asset-auction/index'; break;
    case 4: apiName = subrogationJudgmentMarkReadApi; url = '/subpackage/pages/monitor/asset-auction/index'; break;
    case 5: apiName = 'auctionMarkReadApi'; url = '/subpackage/pages/monitor/asset-auction/index'; break;
    case 6: apiName = 'auctionMarkReadApi'; url = '/subpackage/pages/monitor/asset-auction/index'; break;
    case 7: apiName = 'auctionMarkReadApi'; url = '/subpackage/pages/monitor/asset-auction/index'; break;
    case 8: apiName = 'auctionMarkReadApi'; url = '/subpackage/pages/monitor/asset-auction/index'; break;
  }
  return { apiName, url}
};

export { getPlot, getTitleTag, getRiskTag, getObligorName, getTime, getAuctionStatus, getAuctionRoleType, getJumpType}
