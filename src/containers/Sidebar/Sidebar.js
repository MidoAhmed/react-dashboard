import React, { Component } from 'react';
import { connect } from 'react-redux';
import clone from 'clone';
import { Link } from 'react-router-dom';
import { Layout } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import Menu from '../../components/uielements/menu';
import IntlMessages from '../../components/utility/intlMessages';
import getDevSidebar from '../../customApp/sidebar';
import SidebarWrapper from './sidebar.style';

import appActions from '../../redux/app/actions';
import Logo from '../../components/utility/logo';
import { rtl } from '../../config/withDirection';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const { Sider } = Layout;

const {
  toggleOpenDrawer,
  changeOpenKeys,
  changeCurrent,
  toggleCollapsed
} = appActions;
const stripTrailingSlash = str => {
  if (str.substr(-1) === '/') {
    return str.substr(0, str.length - 1);
  }
  return str;
};
class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.onOpenChange = this.onOpenChange.bind(this);
  }
  handleClick(e) {
    this.props.changeCurrent([e.key]);
    if (this.props.app.view === 'MobileView') {
      setTimeout(() => {
        this.props.toggleCollapsed();
        this.props.toggleOpenDrawer();
      }, 100);
    }
  }
  onOpenChange(newOpenKeys) {
    const { app, changeOpenKeys } = this.props;
    const latestOpenKey = newOpenKeys.find(
      key => !(app.openKeys.indexOf(key) > -1)
    );
    const latestCloseKey = app.openKeys.find(
      key => !(newOpenKeys.indexOf(key) > -1)
    );
    let nextOpenKeys = [];
    if (latestOpenKey) {
      nextOpenKeys = this.getAncestorKeys(latestOpenKey).concat(latestOpenKey);
    }
    if (latestCloseKey) {
      nextOpenKeys = this.getAncestorKeys(latestCloseKey);
    }
    changeOpenKeys(nextOpenKeys);
  }
  getAncestorKeys = key => {
    const map = {
      sub3: ['sub2']
    };
    return map[key] || [];
  };

  renderView({ style, ...props }) {
    const viewStyle = {
      marginRight: rtl === 'rtl' ? '0' : '-17px',
      paddingRight: rtl === 'rtl' ? '0' : '9px',
      marginLeft: rtl === 'rtl' ? '-17px' : '0',
      paddingLeft: rtl === 'rtl' ? '9px' : '0'
    };
    return (
      <div className="box" style={{ ...style, ...viewStyle }} {...props} />
    );
  }

  render() {
    // const { url, app, toggleOpenDrawer, bgcolor } = this.props;
    const { app, toggleOpenDrawer, customizedTheme } = this.props;
    const url = stripTrailingSlash(this.props.url);
    const collapsed = clone(app.collapsed) && !clone(app.openDrawer);
    const { openDrawer } = app;
    const mode = collapsed === true ? 'vertical' : 'inline';
    const onMouseEnter = event => {
      if (openDrawer === false) {
        toggleOpenDrawer();
      }
      return;
    };
    const onMouseLeave = () => {
      if (openDrawer === true) {
        toggleOpenDrawer();
      }
      return;
    };
    const scrollheight = app.height;
    const styling = {
      backgroundColor: customizedTheme.backgroundColor
    };
    const submenuStyle = {
      backgroundColor: 'rgba(0,0,0,0.3)',
      color: customizedTheme.textColor
    };
    const submenuColor = {
      color: customizedTheme.textColor
    };
    return (
      <SidebarWrapper>
        <Sider
          trigger={null}
          collapsible={true}
          collapsed={collapsed}
          width="240"
          className="isomorphicSidebar"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          style={styling}
        >
          <Logo collapsed={collapsed} />
          <Scrollbars
            renderView={this.renderView}
            style={{ height: scrollheight - 70 }}
          >
            <Menu
              onClick={this.handleClick}
              theme="dark"
              mode={mode}
              openKeys={collapsed ? [] : app.openKeys}
              selectedKeys={app.current}
              onOpenChange={this.onOpenChange}
              className="isoDashboardMenu"
            >
              <Menu.Item key="mailbox">
                <Link to={`${url}/mailbox`}>
                  <span className="isoMenuHolder" style={submenuColor}>
                    <i className="ion-android-mail" />
                    <span className="nav-text">
                      <IntlMessages id="sidebar.email" />
                    </span>
                  </span>
                </Link>
              </Menu.Item>

              <SubMenu
                key="ecommerce"
                title={
                  <span className="isoMenuHolder" style={submenuColor}>
                    <i className="ion-bag" />
                    <span className="nav-text">
                      <IntlMessages id="sidebar.ecommerce" />
                    </span>
                  </span>
                }
              >
                <Menu.Item style={submenuStyle} key="shop">
                  <Link style={submenuColor} to={`${url}/shop`}>
                    <IntlMessages id="sidebar.shop" />
                  </Link>
                </Menu.Item>
                <Menu.Item style={submenuStyle} key="cart">
                  <Link style={submenuColor} to={`${url}/cart`}>
                    <IntlMessages id="sidebar.cart" />
                  </Link>
                </Menu.Item>
                <Menu.Item style={submenuStyle} key="checkout">
                  <Link style={submenuColor} to={`${url}/checkout`}>
                    <IntlMessages id="sidebar.checkout" />
                  </Link>
                </Menu.Item>
                <Menu.Item style={submenuStyle} key="card">
                  <Link style={submenuColor} to={`${url}/card`}>
                    <IntlMessages id="sidebar.cards" />
                  </Link>
                </Menu.Item>
              </SubMenu>

              <SubMenu
                key="map"
                title={
                  <span className="isoMenuHolder" style={submenuColor}>
                    <i className="ion-map" />
                    <span className="nav-text">
                      <IntlMessages id="sidebar.maps" />
                    </span>
                  </span>
                }
              >
                <Menu.Item style={submenuStyle} key="googlemap">
                  <Link style={submenuColor} to={`${url}/googlemap`}>
                    <IntlMessages id="sidebar.googleMap" />
                  </Link>
                </Menu.Item>
                <Menu.Item style={submenuStyle} key="leafletmap">
                  <Link style={submenuColor} to={`${url}/leafletmap`}>
                    <IntlMessages id="sidebar.leafletMap" />
                  </Link>
                </Menu.Item>
              </SubMenu>

              <Menu.Item key="youtubeSearch">
                <Link to={`${url}/youtubeSearch`}>
                  <span className="isoMenuHolder" style={submenuColor}>
                    <i className="ion-social-youtube" />
                    <span className="nav-text">
                      <IntlMessages id="sidebar.youtubeSearch" />
                    </span>
                  </span>
                </Link>
              </Menu.Item>

              <Menu.Item key="calendar">
                <Link to={`${url}/calendar`}>
                  <span className="isoMenuHolder" style={submenuColor}>
                    <i className="ion-calendar" />
                    <span className="nav-text">
                      <IntlMessages id="sidebar.calendar" />
                    </span>
                  </span>
                </Link>
              </Menu.Item>

              <Menu.Item key="notes">
                <Link to={`${url}/notes`}>
                  <span className="isoMenuHolder" style={submenuColor}>
                    <i className="ion-clipboard" />
                    <span className="nav-text">
                      <IntlMessages id="sidebar.notes" />
                    </span>
                  </span>
                </Link>
              </Menu.Item>

              <Menu.Item key="todo">
                <Link to={`${url}/todo`}>
                  <span className="isoMenuHolder" style={submenuColor}>
                    <i className="ion-android-list" />
                    <span className="nav-text">
                      <IntlMessages id="sidebar.todos" />
                    </span>
                  </span>
                </Link>
              </Menu.Item>

              <Menu.Item key="contacts">
                <Link to={`${url}/contacts`}>
                  <span className="isoMenuHolder" style={submenuColor}>
                    <i className="ion-android-person-add" />
                    <span className="nav-text">
                      <IntlMessages id="sidebar.contacts" />
                    </span>
                  </span>
                </Link>
              </Menu.Item>

              <Menu.Item key="shuffle">
                <Link to={`${url}/shuffle`}>
                  <span className="isoMenuHolder" style={submenuColor}>
                    <i className="ion-grid" />
                    <span className="nav-text">
                      <IntlMessages id="sidebar.shuffle" />
                    </span>
                  </span>
                </Link>
              </Menu.Item>

              <SubMenu
                key="charts"
                title={
                  <span className="isoMenuHolder" style={submenuColor}>
                    <i className="ion-arrow-graph-up-right" />
                    <span className="nav-text">
                      <IntlMessages id="sidebar.charts" />
                    </span>
                  </span>
                }
              >
                <Menu.Item style={submenuStyle} key="googleChart">
                  <Link style={submenuColor} to={`${url}/googleChart`}>
                    <IntlMessages id="sidebar.googleCharts" />
                  </Link>
                </Menu.Item>
                <Menu.Item style={submenuStyle} key="reecharts">
                  <Link style={submenuColor} to={`${url}/reecharts`}>
                    <IntlMessages id="sidebar.recharts" />
                  </Link>
                </Menu.Item>
                <Menu.Item style={submenuStyle} key="reactVis">
                  <Link style={submenuColor} to={`${url}/reactVis`}>
                    <IntlMessages id="sidebar.reactVis" />
                  </Link>
                </Menu.Item>
                <Menu.Item style={submenuStyle} key="reactChart2">
                  <Link style={submenuColor} to={`${url}/reactChart2`}>
                    <IntlMessages id="sidebar.reactChart2" />
                  </Link>
                </Menu.Item>
                <Menu.Item style={submenuStyle} key="reactTrend">
                  <Link style={submenuColor} to={`${url}/reactTrend`}>
                    <IntlMessages id="sidebar.reactTrend" />
                  </Link>
                </Menu.Item>

                <Menu.Item style={submenuStyle} key="frappeChart">
                  <Link style={submenuColor} to={`${url}/frappeChart`}>
                    <IntlMessages id="sidebar.frappeChart" />
                  </Link>
                </Menu.Item>
                {/*<Menu.Item style={submenuStyle} key="echart">
                  <Link style={submenuColor} to={`${url}/echart`}>
                    <IntlMessages id="sidebar.eChart" />
                  </Link>
                </Menu.Item>*/}
              </SubMenu>

              <SubMenu
                key="Forms"
                title={
                  <span className="isoMenuHolder" style={submenuColor}>
                    <i className="ion-android-mail" />
                    <span className="nav-text">
                      <IntlMessages id="sidebar.forms" />
                    </span>
                  </span>
                }
              >
                <Menu.Item style={submenuStyle} key="InputField">
                  <Link style={submenuColor} to={`${url}/InputField`}>
                    <IntlMessages id="sidebar.input" />
                  </Link>
                </Menu.Item>
                <Menu.Item style={submenuStyle} key="editor">
                  <Link style={submenuColor} to={`${url}/editor`}>
                    <IntlMessages id="sidebar.editor" />
                  </Link>
                </Menu.Item>
                <Menu.Item style={submenuStyle} key="FormsWithValidation">
                  <Link style={submenuColor} to={`${url}/FormsWithValidation`}>
                    <IntlMessages id="sidebar.formsWithValidation" />
                  </Link>
                </Menu.Item>
                <Menu.Item style={submenuStyle} key="progress">
                  <Link style={submenuColor} to={`${url}/progress`}>
                    <IntlMessages id="sidebar.progress" />
                  </Link>
                </Menu.Item>
                <Menu.Item style={submenuStyle} key="button">
                  <Link style={submenuColor} to={`${url}/button`}>
                    <IntlMessages id="sidebar.button" />
                  </Link>
                </Menu.Item>
                <Menu.Item style={submenuStyle} key="tab">
                  <Link style={submenuColor} to={`${url}/tab`}>
                    <IntlMessages id="sidebar.tab" />
                  </Link>
                </Menu.Item>
                <Menu.Item style={submenuStyle} key="checkbox">
                  <Link style={submenuColor} to={`${url}/checkbox`}>
                    <IntlMessages id="sidebar.checkbox" />
                  </Link>
                </Menu.Item>
                <Menu.Item style={submenuStyle} key="radiobox">
                  <Link style={submenuColor} to={`${url}/radiobox`}>
                    <IntlMessages id="sidebar.radiobox" />
                  </Link>
                </Menu.Item>
                <Menu.Item style={submenuStyle} key="selectbox">
                  <Link style={submenuColor} to={`${url}/selectbox`}>
                    <IntlMessages id="sidebar.selectbox" />
                  </Link>
                </Menu.Item>
                <Menu.Item style={submenuStyle} key="transfer">
                  <Link style={submenuColor} to={`${url}/transfer`}>
                    <IntlMessages id="sidebar.transfer" />
                  </Link>
                </Menu.Item>
                <Menu.Item style={submenuStyle} key="autocomplete">
                  <Link style={submenuColor} to={`${url}/autocomplete`}>
                    <IntlMessages id="sidebar.autocomplete" />
                  </Link>
                </Menu.Item>
              </SubMenu>

              {/* <Menu.Item key="grid_layout">
              <Link to={`${url}/gridLayout`}>
                <span className="isoMenuHolder" style={submenuColor}>
                  <i className="ion-cube" />
                  <span className="nav-text">
                    <IntlMessages id="sidebar.boxOptions" />
                  </span>
                </span>
              </Link>
            </Menu.Item> */}

              <SubMenu
                key="uielements"
                title={
                  <span className="isoMenuHolder" style={submenuColor}>
                    <i className="ion-leaf" />
                    <span className="nav-text">
                      <IntlMessages id="sidebar.uiElements" />
                    </span>
                  </span>
                }
              >
                <Menu.Item style={submenuStyle} key="op_badge">
                  <Link style={submenuColor} to={`${url}/op_badge`}>
                    <IntlMessages id="sidebar.badge" />
                  </Link>
                </Menu.Item>
                <Menu.Item style={submenuStyle} key="op_card">
                  <Link style={submenuColor} to={`${url}/op_card`}>
                    <IntlMessages id="sidebar.card2" />
                  </Link>
                </Menu.Item>
                <Menu.Item style={submenuStyle} key="op_carousel">
                  <Link style={submenuColor} to={`${url}/op_carousel`}>
                    <IntlMessages id="sidebar.corusel" />
                  </Link>
                </Menu.Item>
                <Menu.Item style={submenuStyle} key="op_collapse">
                  <Link style={submenuColor} to={`${url}/op_collapse`}>
                    <IntlMessages id="sidebar.collapse" />
                  </Link>
                </Menu.Item>
                <Menu.Item style={submenuStyle} key="op_popover">
                  <Link style={submenuColor} to={`${url}/op_popover`}>
                    <IntlMessages id="sidebar.popover" />
                  </Link>
                </Menu.Item>
                <Menu.Item style={submenuStyle} key="op_tooltip">
                  <Link style={submenuColor} to={`${url}/op_tooltip`}>
                    <IntlMessages id="sidebar.tooltip" />
                  </Link>
                </Menu.Item>
                <Menu.Item style={submenuStyle} key="op_tag">
                  <Link style={submenuColor} to={`${url}/op_tag`}>
                    <IntlMessages id="sidebar.tag" />
                  </Link>
                </Menu.Item>
                <Menu.Item style={submenuStyle} key="op_timeline">
                  <Link style={submenuColor} to={`${url}/op_timeline`}>
                    <IntlMessages id="sidebar.timeline" />
                  </Link>
                </Menu.Item>
                <Menu.Item style={submenuStyle} key="dropdown">
                  <Link style={submenuColor} to={`${url}/dropdown`}>
                    <IntlMessages id="sidebar.dropdown" />
                  </Link>
                </Menu.Item>
                <Menu.Item style={submenuStyle} key="pagination">
                  <Link style={submenuColor} to={`${url}/pagination`}>
                    <IntlMessages id="sidebar.pagination" />
                  </Link>
                </Menu.Item>
                <Menu.Item style={submenuStyle} key="rating">
                  <Link style={submenuColor} to={`${url}/rating`}>
                    <IntlMessages id="sidebar.rating" />
                  </Link>
                </Menu.Item>
                <Menu.Item style={submenuStyle} key="tree">
                  <Link style={submenuColor} to={`${url}/tree`}>
                    <IntlMessages id="sidebar.tree" />
                  </Link>
                </Menu.Item>
              </SubMenu>
              <SubMenu
                key="advancedUielements"
                title={
                  <span className="isoMenuHolder" style={submenuColor}>
                    <i className="ion-flash" />
                    <span className="nav-text">
                      <IntlMessages id="sidebar.advancedElements" />
                    </span>
                  </span>
                }
              >
                <Menu.Item style={submenuStyle} key="reactDates">
                  <Link style={submenuColor} to={`${url}/reactDates`}>
                    <IntlMessages id="sidebar.reactDates" />
                  </Link>
                </Menu.Item>
                <Menu.Item style={submenuStyle} key="codeMirror">
                  <Link style={submenuColor} to={`${url}/codeMirror`}>
                    <IntlMessages id="sidebar.codeMirror" />
                  </Link>
                </Menu.Item>
                <Menu.Item style={submenuStyle} key="uppy">
                  <Link style={submenuColor} to={`${url}/uppy`}>
                    <IntlMessages id="sidebar.uppy" />
                  </Link>
                </Menu.Item>
                <Menu.Item style={submenuStyle} key="dropzone">
                  <Link style={submenuColor} to={`${url}/dropzone`}>
                    <IntlMessages id="sidebar.dropzone" />
                  </Link>
                </Menu.Item>
              </SubMenu>
              <SubMenu
                key="feedback"
                title={
                  <span className="isoMenuHolder" style={submenuColor}>
                    <i className="ion-thumbsup" />
                    <span className="nav-text">
                      <IntlMessages id="sidebar.feedback" />
                    </span>
                  </span>
                }
              >
                <Menu.Item style={submenuStyle} key="alert">
                  <Link style={submenuColor} to={`${url}/alert`}>
                    <IntlMessages id="sidebar.alert" />
                  </Link>
                </Menu.Item>
                <Menu.Item style={submenuStyle} key="modal">
                  <Link style={submenuColor} to={`${url}/modal`}>
                    <IntlMessages id="sidebar.modal" />
                  </Link>
                </Menu.Item>
                <Menu.Item style={submenuStyle} key="message">
                  <Link style={submenuColor} to={`${url}/message`}>
                    <IntlMessages id="sidebar.message" />
                  </Link>
                </Menu.Item>
                <Menu.Item style={submenuStyle} key="notification">
                  <Link style={submenuColor} to={`${url}/notification`}>
                    <IntlMessages id="sidebar.notification" />
                  </Link>
                </Menu.Item>
                <Menu.Item style={submenuStyle} key="popconfirm">
                  <Link style={submenuColor} to={`${url}/popconfirm`}>
                    <IntlMessages id="sidebar.popConfirm" />
                  </Link>
                </Menu.Item>
                <Menu.Item style={submenuStyle} key="spin">
                  <Link style={submenuColor} to={`${url}/spin`}>
                    <IntlMessages id="sidebar.spin" />
                  </Link>
                </Menu.Item>
              </SubMenu>

              <SubMenu
                key="table"
                title={
                  <span className="isoMenuHolder" style={submenuColor}>
                    <i className="ion-android-menu" />
                    <span className="nav-text">
                      <IntlMessages id="sidebar.tables" />
                    </span>
                  </span>
                }
              >
                <Menu.Item style={submenuStyle} key="table_ant">
                  <Link style={submenuColor} to={`${url}/table_ant`}>
                    <IntlMessages id="sidebar.antTables" />
                  </Link>
                </Menu.Item>
              </SubMenu>

              <SubMenu
                key="pages"
                title={
                  <span className="isoMenuHolder" style={submenuColor}>
                    <i className="ion-document" />
                    <span className="nav-text">
                      <IntlMessages id="sidebar.pages" />
                    </span>
                  </span>
                }
              >
                <Menu.Item style={submenuStyle} key="404">
                  <Link style={submenuColor} to={'/404'}>
                    <IntlMessages id="sidebar.404" />
                  </Link>
                </Menu.Item>
                <Menu.Item style={submenuStyle} key="500">
                  <Link style={submenuColor} to={'/500'}>
                    <IntlMessages id="sidebar.500" />
                  </Link>
                </Menu.Item>
                <Menu.Item style={submenuStyle} key="signin">
                  <Link style={submenuColor} to={'/signin'}>
                    <IntlMessages id="sidebar.signIn" />
                  </Link>
                </Menu.Item>
                <Menu.Item style={submenuStyle} key="signup">
                  <Link style={submenuColor} to={'/signup'}>
                    <IntlMessages id="sidebar.signUp" />
                  </Link>
                </Menu.Item>
                <Menu.Item style={submenuStyle} key="forgotpassword">
                  <Link style={submenuColor} to={'/forgotpassword'}>
                    <IntlMessages id="sidebar.forgotPw" />
                  </Link>
                </Menu.Item>
                <Menu.Item style={submenuStyle} key="resetpassword">
                  <Link style={submenuColor} to={'/resetpassword'}>
                    <IntlMessages id="sidebar.resetPw" />
                  </Link>
                </Menu.Item>
                <Menu.Item style={submenuStyle} key="invoice">
                  <Link style={submenuColor} to={`${url}/invoice`}>
                    <IntlMessages id="sidebar.invoice" />
                  </Link>
                </Menu.Item>
                {/*<Menu.Item style={submenuStyle} key="comingSoon">
                  <Link style={submenuColor} to={`${url}/comingSoon`}>
                    <IntlMessages id="sidebar.comingSoon" />
                  </Link>
                </Menu.Item>*/}
              </SubMenu>
              <SubMenu
                key="sub1"
                title={
                  <span className="isoMenuHolder" style={submenuColor}>
                    <i className="ion-android-options" />
                    <span className="nav-text">
                      <IntlMessages id="sidebar.menuLevels" />
                    </span>
                  </span>
                }
              >
                <MenuItemGroup
                  key="g1"
                  title={<IntlMessages id="sidebar.item1" />}
                >
                  <Menu.Item style={submenuStyle} key="1">
                    <IntlMessages id="sidebar.option1" />
                  </Menu.Item>
                  <Menu.Item style={submenuStyle} key="2">
                    <IntlMessages id="sidebar.option2" />
                  </Menu.Item>
                </MenuItemGroup>
                <MenuItemGroup
                  key="g2"
                  title={<IntlMessages id="sidebar.item2" />}
                >
                  <Menu.Item style={submenuStyle} key="3">
                    <IntlMessages id="sidebar.option3" />
                  </Menu.Item>
                  <Menu.Item style={submenuStyle} key="4">
                    <IntlMessages id="sidebar.option4" />
                  </Menu.Item>
                </MenuItemGroup>
              </SubMenu>

              {getDevSidebar(url, submenuColor)}
            </Menu>
          </Scrollbars>
        </Sider>
      </SidebarWrapper>
    );
  }
}

export default connect(
  state => ({
    app: state.App.toJS(),
    customizedTheme: state.ThemeSwitcher.toJS().sidebarTheme
  }),
  { toggleOpenDrawer, changeOpenKeys, changeCurrent, toggleCollapsed }
)(Sidebar);
