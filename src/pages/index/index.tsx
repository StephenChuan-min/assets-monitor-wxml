import React, { Component } from 'react';
import Taro from '@tarojs/taro';
import {View, Text, Image, ScrollView} from '@tarojs/components';
import { connect } from 'react-redux';
import NavigationBar from '../../components/navigation-bar';
import Tab from "../../components/tab";
import { setGlobalData} from "../../utils/const/global";
import {handleDealAuthRule, isRule, getArraySum } from "../../utils/tools/common";
import addBus from '../../assets/img/page/add-bus.png';
import portrait from '../../assets/img/page/portrait-search.png';
import auction from '../../assets/img/page/auction.png';
import businessMan from '../../assets/img/page/business-management.png';
import debtor from '../../assets/img/page/debtor.png';
import collection from '../../assets/img/page/collection.png';
import follow from '../../assets/img/page/follow.png';
import star from '../../assets/img/page/star.png';
import high from '../../assets/img/page/high-risk.png';
import warn from '../../assets/img/page/warn-risk.png';
import tip from '../../assets/img/page/tip-risk.png';
import good from '../../assets/img/page/good-risk.png';
import noresult from '../../assets/img/components/blank_noresult.png'
import noData from '../../assets/img/page/blank_nodate.png';
import './index.scss'

interface dataItem{
  id: number
  name: string
  icon: string
  num: number
  isRule: boolean
  value: string
}

interface caseItem{
  title: string
  time: string
  text: string
}

type IProps = {
  count: number,
  dispatch: any

  assetsStarLevelCounts: {starLevel: number, starLevelCount: number}[]
  riskStarLevelCounts: {starLevel: number, starLevelCount: number}[]
};

type IState = {
  animation: any,
  current: number
  type: string
  scrollViewHeight: number
  loading: boolean,
  businessCount: number
  caseArray: caseItem[]
  assetsArray: dataItem[]
  riskArray: dataItem[]
  starLevel: {
    three: number,
    two: number,
    one: number,
    high: number,
    warn: number,
    good: number,
    tip: number
  }
};

@connect(({ home }) => ({ ...home }))
class Index extends Component <IProps, IState>{
  constructor(props) {
    super(props);
    this.state = {
      animation: '',
      current: 1,
      type: 'assets',
      caseArray: [
        {title: '?????????????????????', time: '2020-10-10', text: '??????????????????????????????????????????????????????100????????????????????????????????????????????????????????????100?????????'},
        {title: '?????????????????????', time: '2020-10-10', text: '??????????????????????????????????????????????????????100????????????????????????????????????????????????????????????100?????????'},
      ],
      scrollViewHeight: 0,
      loading: true,
      businessCount: 0,
      assetsArray: [],
      riskArray: [],
      starLevel: {
        three: 0,
        two: 0,
        one: 0,
        high: 0,
        tip: 0,
        warn: 0,
        good: 0,
      }
    };
  }

  componentWillMount () {
    Taro.getSystemInfo().then(res => {
      setGlobalData('statusBarHeight', res.statusBarHeight);
      this.setState({
        scrollViewHeight: res.windowHeight - res.statusBarHeight
      })
    });
  }

  componentDidShow () {
    const { dispatch } = this.props;
    dispatch({
      type: 'home/getCurrentOrganization',
      payload: {}
    }).then(res => {
      if(res.code === 200){
        this.setState({
          businessCount: res.data.businessCount,
        })
      }
    }).catch();
    dispatch({
      type: 'home/getAuthRule',
      payload: {}
    }).then(res => {
      if(res.code === 200){
        let ruleArray = handleDealAuthRule(res.data.orgPageGroups);
        setGlobalData('ruleArray', ruleArray);
        this.handleRequestAsstes();
      }
    }).catch(() => {});
  }

  shouldComponentUpdate(nextProps: Readonly<IProps>, nextState: Readonly<IState>): boolean {
    const { current, businessCount, starLevel } = this.state;
    return current !== nextState.current ||  businessCount !== nextState.businessCount || JSON.stringify(starLevel) !== JSON.stringify(nextState.starLevel);
  }

  // ????????????????????????tab
  handleClick = (value?: any) => {
    const { current } = this.state;
    let activeId = value ? value.id : current;
    if(value){
      this.setState({
        current: value.id,
      });
    }
    if(activeId === 1){
      this.handleRequestAsstes();
    }
    else {
      this.handleRequestRisk();
    }
  };

  handleRequestAsstes = () => {
    const { loading } = this.state;
    const { dispatch } = this.props;
    if(loading){
      Taro.showLoading();
    }
    dispatch({
      type: 'home/getAssets',
      payload: {}
    }).then(res => {
      Taro.hideLoading();
      const { starLevel } = this.state;
      let newStarLevel = {...starLevel};
      const { code, data} = res;
      if( code === 200){
        Taro.hideLoading();
        let newAssetsArrary: dataItem[] =  [
          { id: 1, name: '????????????', num: data.auctionCount || 0, isRule: isRule('zcwjzcpm'), icon: 'icon-auction', value: 'zcwjzcpm'},
          { id: 2, name: '?????????', num: data.subrogationCount || 0, isRule: isRule('zcwjdwq'), icon: 'icon-subrogation', value: 'zcwjdwq'},
        ];
        data.starLevelCounts.forEach(item => {
          if(item.starLevel === 90){
            newStarLevel.three = item.starLevelCount;
          }
          else if(item.starLevel === 80){
            newStarLevel.two = item.starLevelCount;
          }
          else if(item.starLevel === 60){
            newStarLevel.one = item.starLevelCount;
          }
        });
        this.setState({
          starLevel: newStarLevel,
          assetsArray: [...newAssetsArrary]
        })
      }
    }).catch(()=>{
      Taro.hideLoading();
    });
  };

  handleRequestRisk = () => {
    const { loading } = this.state;
    const { dispatch } = this.props;
    if(loading){
      Taro.showLoading();
    }
    dispatch({
      type: 'home/getRisk',
      payload: {}
    }).then(res => {
      Taro.hideLoading();
      const { code, data} = res;
      const { starLevel } = this.state;
      let newStarLevel = {...starLevel};
      if( code === 200){
        let newRiskArrary = [
          { id: 21, name: '????????????', num: data.bankruptcyCount || 0, isRule: isRule('fxjkqypccz'), icon: 'icon-bankruptcy', value: 'fxjkqypccz'},
          { id: 22, name: '????????????', num: data.lawsuitCount  || 0, isRule: isRule('fxjkssjk'), icon: 'icon-litigation', value: 'fxjkssjk'},
        ];
        data.starLevelCounts.forEach(item => {
          if(item.starLevel === 90){
            newStarLevel.high = item.starLevelCount;
          }
          else if(item.starLevel === 80){
            newStarLevel.warn = item.starLevelCount;
          }
          else if(item.starLevel === 60){
            newStarLevel.tip = item.starLevelCount;
          }
          else{
            newStarLevel.good = item.starLevelCount;
          }
        });
        this.setState({
          starLevel: newStarLevel,
          riskArray: [...newRiskArrary]
        })
      }
    }).catch(() => {
      Taro.hideLoading();
    });
  };

  // ??????????????????
  onAddBusClick = (type) =>{
    Taro.navigateTo({url: `/subpackage/pages/monitorManage/addBusiness/index?type=${type}`});
  };

  // ??????????????????????????????
  navigateToPage = (type: string) => {
    Taro.navigateTo({url:`/subpackage/pages/monitorManage/index?type=${type}`})
  };

  // ???????????????
  navigateToPortrait = () => {
    Taro.showToast({
      title: '????????????',
      icon: 'loading',
      duration: 1500
    })
  };

  // ??????????????????
  navigateToAuction = () => {
    Taro.showToast({
      title: '????????????',
      icon: 'loading',
      duration: 1500
    })
  };

  // ??????????????????
  navigateToCollection = () => {
    Taro.showToast({
      title: '????????????',
      icon: 'loading',
      duration: 1500
    })
  };

  // ????????????
  navigateToFollow = () => {
    Taro.showToast({
      title: '????????????',
      icon: 'loading',
      duration: 1500
    })
  };

  // ?????????????????????
  navigateToRule = () => {
    Taro.navigateTo({url:'/subpackage/pages/rule-description/index'})
  };

  // ??????????????????
  navigateToMonitor = (tabId: number, star: number, value: string) => {
    const { dispatch  } = this.props;
    dispatch({
      type: 'home/updateMonitorParams',
      payload: {
        params: {
          tabId: tabId,
          starId: star,
          value,
        }
      }
    });
    setGlobalData('refreshMonitor', true);
    Taro.switchTab({
      url:'/pages/monitor/index'
    });
  };

  render () {
    const tabList = [
      { title: '??????', id: 1 },
      { title: '??????', id: 2 },
    ];
    const { current, businessCount, assetsArray, riskArray, starLevel, scrollViewHeight} = this.state;
    // console.log('index render === ', riskArray, JSON.stringify(riskArray));
    const assetsSum = getArraySum(assetsArray, 'num');
    const riskSum = getArraySum(riskArray, 'num');
    return (
      <View className='home'>
        <View className='home-title'>
          <NavigationBar  title='??????????????????' type='gradient' color='white'/>
        </View>
        {
          businessCount > 0 ? <ScrollView scrollY style={{ height: scrollViewHeight }}>
            <View className='home-bg'>
              <View className='home-header'>
                <View className='home-header-tab' onClick={()=>{this.onAddBusClick('homeAddBus')}}
                >
                  <View className='home-header-tab-logo'>
                    <Image className='home-header-tab-logo-pic' src={addBus}/>
                  </View>
                  <View className='home-header-tab-text'>????????????</View>
                </View>
                <View className='home-header-tab'>
                  <View className='home-header-tab-logo'>
                    <Image className='home-header-tab-logo-pic' src={portrait}/>
                    <View className='home-header-tab-logo-tag'>????????????</View>
                  </View>
                  <View className='home-header-tab-noText'>????????????</View>
                </View>
                <View className='home-header-tab'>
                  <View className='home-header-tab-logo'>
                    <Image className='home-header-tab-logo-pic' src={auction}/>
	                  <View className='home-header-tab-logo-tag'>????????????</View>
                  </View>
                  <View className='home-header-tab-noText'>????????????</View>
                </View>
              </View>
            </View>
            <View className='home-middle'>
              <View className='home-middle-tab' onClick={() =>{this.navigateToPage('business')}}>
                <View className='home-middle-tab-logo'>
                  <Image className='home-middle-tab-logo-img' src={businessMan}/>
                </View>
                <Text className='home-middle-tab-text'>????????????</Text>
              </View>
              <View className='home-middle-tab' onClick={()=>{this.navigateToPage('obligor')}}>
                <View className='home-middle-tab-logo'>
                  <Image className='home-middle-tab-logo-img' src={debtor}/>
                </View>
                <Text className='home-middle-tab-text'>???????????????</Text>
              </View>
              <View className='home-middle-tab' onClick={this.navigateToCollection}>
                <View className='home-middle-tab-logo'>
                  <Image className='home-middle-tab-logo-img' src={collection}/>
                </View>
                <Text className='home-middle-tab-noText'>????????????</Text>
              </View>
              <View className='home-middle-tab' onClick={this.navigateToFollow}>
                <View className='home-middle-tab-logo'>
                  <Image className='home-middle-tab-logo-img' src={follow}/>
                </View>
                <Text className='home-middle-tab-noText'>????????????</Text>
              </View>
            </View>

            <View className='home-data'>
              <Tab type={'homeTab'} config={tabList} onClick={this.handleClick} initId={current} />
              {
                current === 1 && (
                  assetsArray.length > 0 ? ( assetsSum > 0 ? <View className='home-data-box'>
                    <View className='home-data-box-level'>
                      <Text>????????????</Text>
                      <Text className='iconfont icon-question home-data-box-level-icon' onClick={this.navigateToRule}/>
                    </View>
                    <View className='home-data-box-star'>
                      <View className='home-data-box-star-three' onClick={() => this.navigateToMonitor(1, 2, '')}>
                        <Image className='home-data-box-star-three-icon' src={star}/>
                        <View className='home-data-box-star-three-text'>
                          <View className='home-data-box-star-three-text-left'>
                            <View className='home-data-box-star-three-text-left-title'>??????</View>
                            <View className='home-data-box-star-three-text-left-title'>{starLevel.three}</View>
                          </View>
                          <Text className='iconfont icon-right-arrow home-data-box-star-three-text-right' />
                        </View>
                      </View>
                      <View className='home-data-box-star-two' onClick={() => this.navigateToMonitor(1, 3, '')}>
                        <Image className='home-data-box-star-two-icon' src={star}/>
                        <View className='home-data-box-star-two-text'>
                          <View className='home-data-box-star-two-text-left'>
                            <View className='home-data-box-star-two-text-left-title'>??????</View>
                            <View className='home-data-box-star-two-text-left-title'>{starLevel.two}</View>
                          </View>
                          <Text className='iconfont icon-right-arrow home-data-box-star-three-text-right' />
                        </View>
                      </View>
                      <View className='home-data-box-star-one' onClick={() => this.navigateToMonitor(1, 4, '')}>
                        <Image className='home-data-box-star-one-icon' src={star}/>
                        <View className='home-data-box-star-one-text'>
                          <View className='home-data-box-star-one-text-left'>
                            <View className='home-data-box-star-one-text-left-title'>??????</View>
                            <View className='home-data-box-star-one-text-left-title'>{starLevel.one}</View>
                          </View>
                          <Text className='iconfont icon-right-arrow home-data-box-star-three-text-right' />
                        </View>
                      </View>
                    </View>
                    <View className='home-data-box-typeTitle'>????????????</View>
                    <View className='home-data-box-firstLine'/>
                    <View className='home-data-box-type'>
                      {
                        assetsArray.map((item, index) => {
                          return(
                            <View
                              className={`home-data-box-type-logo${assetsArray.length === 1 ? '-noBottom' : ''}`}
                              onClick={() => this.navigateToMonitor(1, 1 , item.value)}
                            >
                              <View className='home-data-box-type-logo-left'>
                                <Text className={`iconfont ${item.icon} home-data-box-type-logo-left-icon`}/>
                              </View>
                              <View className='home-data-box-type-logo-right'>
                                <View className='home-data-box-type-logo-right-name'>{item.name}</View>
                                <View className='home-data-box-type-logo-right-num'>{item.num}</View>
                              </View>
                              {
                                index % 2 === 0 && assetsArray.length !== 1 && <View className='home-data-box-type-logo-divider'/>
                              }
                              {
                                assetsArray.length === 1 && <View className='home-data-box-type-logo-bottom'/>
                              }
                            </View>
                          )
                        })
                      }
                    </View>
                  </View> : <View className='home-data-noData'>
                    <View className='home-data-noData-pic'>
                      <Image className='home-data-noData-pic-img' src={noresult}/>
                    </View>
                    <View className='home-data-noData-tips'>??????????????????????????????????????????</View>
                    <View className='home-data-noData-advice'>????????????????????????</View>
                  </View>
                  ) : null
                )
              }
              {
                current === 2 && (
                  riskArray.length > 0 ? (riskSum > 0 ? <View className='home-data-box'>
                    <View className='home-data-box-level'>
                      <Text>????????????</Text>
                      <Text className='iconfont icon-question home-data-box-level-icon' onClick={this.navigateToRule} />
                    </View>
                    <View className='home-data-box-star'>
                      <View className='home-data-box-star-high' onClick={() => this.navigateToMonitor(2, 2, '')}>
                        <Image className='home-data-box-star-high-icon' src={high}/>
                        <View className='home-data-box-star-high-text'>
                          <View className='home-data-box-star-high-text-left'>
                            <View className='home-data-box-star-high-text-left-title'>?????????</View>
                            <View className='home-data-box-star-high-text-left-title'>{starLevel.high}</View>
                          </View>
                          <Text className='iconfont icon-right-arrow home-data-box-star-three-text-right' />
                        </View>
                      </View>
                      <View className='home-data-box-star-warn' onClick={() => this.navigateToMonitor(2, 3, '')}>
                        <Image className='home-data-box-star-warn-icon' src={warn}/>
                        <View className='home-data-box-star-warn-text'>
                          <View className='home-data-box-star-warn-text-left'>
                            <View className='home-data-box-star-warn-text-left-title'>??????</View>
                            <View className='home-data-box-star-warn-text-left-title'>{starLevel.warn}</View>
                          </View>
                          <Text className='iconfont icon-right-arrow home-data-box-star-three-text-right' />
                        </View>
                      </View>
                      <View className='home-data-box-star-tip' onClick={() => this.navigateToMonitor(2, 4, '')}>
                        <Image className='home-data-box-star-tip-icon' src={tip}/>
                        <View className='home-data-box-star-tip-text'>
                          <View className='home-data-box-star-tip-text-left'>
                            <View className='home-data-box-star-tip-text-left-title'>??????</View>
                            <View className='home-data-box-star-tip-text-left-title'>{starLevel.tip}</View>
                          </View>
                          <Text className='iconfont icon-right-arrow home-data-box-star-three-text-right' />
                        </View>
                      </View>
                      <View className='home-data-box-star-good' onClick={() => this.navigateToMonitor(2, 5, '')}>
                        <Image className='home-data-box-star-good-icon' src={good}/>
                        <View className='home-data-box-star-good-text'>
                          <View className='home-data-box-star-good-text-left'>
                            <View className='home-data-box-star-good-text-left-title'>??????</View>
                            <View className='home-data-box-star-good-text-left-title'>{starLevel.good}</View>
                          </View>
                          <Text className='iconfont icon-right-arrow home-data-box-star-three-text-right' />
                        </View>
                      </View>
                    </View>
                    <View className='home-data-box-typeTitle'>????????????</View>
                    <View className='home-data-box-firstLine'/>
                    <View className='home-data-box-type'>
                      {
                        riskArray.map((item, index) => {
                          return(
                            <View
                              className={`home-data-box-type-logo${riskArray.length === 1 ? '-noBottom' : ''}`}
                              onClick={() => this.navigateToMonitor(2, 1, item.value)}
                            >
                              <View className='home-data-box-type-logo-left'>
                                <Text className={`iconfont ${item.icon} home-data-box-type-logo-left-icon`}/>
                              </View>
                              <View className='home-data-box-type-logo-right'>
                                <View className='home-data-box-type-logo-right-name'>{item.name}</View>
                                <View className='home-data-box-type-logo-right-num'>{item.num}</View>
                              </View>
                              {
                                index % 2 === 0 && riskArray.length !== 1 && <View className='home-data-box-type-logo-divider'/>
                              }
                              {
                                riskArray.length === 1 && <View className='home-data-box-type-logo-bottom'/>
                              }
                            </View>
                          )
                        })
                      }
                    </View>
                  </View> : <View className='home-data-noData'>
                    <View className='home-data-noData-pic'>
                      <Image className='home-data-noData-pic-img' src={noresult}/>
                    </View>
                    <View className='home-data-noData-tips'>??????????????????????????????????????????</View>
                    <View className='home-data-noData-advice'>????????????????????????</View>
                  </View>) : null
                )
              }
            </View>

            {/*?????????????????????????????????????????? ????????????????????????????????????2021-3-4*/}
            {/*{*/}
            {/*  assetsArray.length === 0 && <View className='home-case'>*/}
						{/*		<View className='home-case-title'>??????????????????</View>*/}
						{/*		<View className='home-case-titleLine'/>*/}
            {/*    {*/}
            {/*      caseArray.map((item, index) => {*/}
            {/*        return (*/}
            {/*          <View className='home-case-info'>*/}
            {/*            <View className='home-case-info-title'>*/}
            {/*              <View className='home-case-info-title-text'>{item.title}</View>*/}
            {/*              <View className='home-case-info-title-time'>???????????????{item.time}</View>*/}
            {/*            </View>*/}
            {/*            <View className='home-case-info-text'>{item.text}</View>*/}
            {/*            {*/}
            {/*              index !== caseArray.length - 1 && <View className='home-case-info-line'/>*/}
            {/*            }*/}
            {/*          </View>*/}
            {/*        )*/}
            {/*      })*/}
            {/*    }*/}
						{/*	</View>*/}
            {/*}*/}

            {
              assetsArray.length === 0 && <View className='home-bottom'>
								<View className='home-bottom-left'/>
								<View className='home-bottom-text'>?????????????????????</View>
								<View className='home-bottom-right'/>
							</View>
            }
          </ScrollView> : <ScrollView style={{ height: scrollViewHeight }} className='home-noBusiness'>
            <View className='home-noBusiness-box'>
              <Image className='home-noBusiness-box-pic' src={noData} />
            </View>
            <View className='home-noBusiness-prompt'>??????????????????????????????</View>
            <View className='home-noBusiness-btn' onClick={()=>{this.onAddBusClick('homeEmptyBus')}}>
              <View className='home-noBusiness-btn-text'>????????????</View>
            </View>
          </ScrollView>
        }
      </View>
    )
  }
}
export default Index;

