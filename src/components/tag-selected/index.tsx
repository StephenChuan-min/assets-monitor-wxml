import React, { Component } from "react";
import { View} from '@tarojs/components';
import { eventCenter, getCurrentInstance }from '@tarojs/taro';
import './index.scss';

interface configType{
  id: number,
  title: string,
  value: string | undefined
}

type IProps = {
  type: string
  initId: number
  onClick: (item: configType) => void
}

type IState = {
  selected: number
  config: configType[]
};

const assetsConfig: configType[] = [
  { title: '全部', id: 1, value: undefined},
  { title: '三星', id: 2, value: '3'},
  { title: '二星', id: 3, value: '2'},
  { title: '一星', id: 4, value: '1'}
];
const riskConfig: configType[] = [
  { title: '全部', id: 1, value: undefined},
  { title: '高风险', id: 2, value: '90'},
  { title: '警示', id: 3, value: '80'},
  { title: '提示', id: 4, value: '60'},
  { title: '利好', id: 5, value: '40'}
];

class TagSelected extends Component<IProps, IState>{
  $instance = getCurrentInstance();
  constructor(props) {
    super(props);
    this.state = {
      selected: 1,
      config: assetsConfig,
    };
  }

  componentDidMount(): void {
    const { initId } = this.props;
    if(initId > 0){
      this.setState({
        selected: initId,
      })
    }
  }

  componentWillReceiveProps(nextProps: Readonly<IProps>): void {
    // console.log('componentWillReceiveProps === ', JSON.stringify(this.props), JSON.stringify(nextProps));
    const { initId } = nextProps;
    const { type } = this.props;
    const { selected } = this.state;
    if(type !== nextProps.type){
      this.setState({
        config: type === 'assets' ? assetsConfig : riskConfig,
        selected: initId > 0 ? initId : selected,
      })
    }
  }

  onClickTag = (item) => {
    const { onClick } = this.props;
    this.setState({
      selected: item.id,
    }, () => {
      onClick(item);
    })
  };

  render(){
    const { selected, config } = this.state;
    return (
      <View className='tag'>
        {
          config.map((item) => {
            const active = selected === item.id;
            return (
              <View
                onClick={() => this.onClickTag(item)}
                className={`tag-item-${active ? `active` : `normal`}`}
              >
                {item.title}
              </View>
            )
          })
        }
      </View>
    );
  }
}
export default TagSelected;
