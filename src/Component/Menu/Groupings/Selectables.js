/**
* Summary: Selectable Screen Component
* Description: This is Selectable screen 
* @author Amit Singh Tomar
* @date  26.07.2018
*/
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { Trans } from 'react-i18next';
import VerticalGrid from '../../Grids/VerticalGrid';
import Method from '../../../services/services';
import API_INTERFACE from '../../../constants/uri.constant';
import { responseActions } from '../../../actions/action.response';
import Utility from '../../../commonUtilities';
import { commonConstants } from '../../../constants/common.constants';
const SELECTABLE_TYPE = { "BUTTON": "button", "PROGRAM": "program", "MOVIE": "movie" }

class Selectables extends React.Component {
  /**
   * Description: class initialization, set initial properties while instanciating
   * @param {null} 
   * @return {null}
   */
  constructor() {
    super();
    this.state = {
      items: [],
      isLoading: true,
      keyEvent: {},
      activeGrid: -1,
      groupingID: 0,
      noData: false
    }
    this.gridItemSelected = this.gridItemSelected.bind(this);
    this.isComponentLoaded = this.isComponentLoaded.bind(this);
    this.gridFocusCallback = this.gridFocusCallback.bind(this);
    this.selectableIds = [];
    this.selectableData = [];
    this.menuName = "";
    this.groupID = 0;
    this.gridProps = {
      entries: [],
      wrapperHeight: 864,
      wrapperWidth: 1800,
      lazyCallback: this.lazyCallback,
      coloumns: 6,
      gridClass: 'VerticalGrid',
      gridItemClass: 'VerticalGridItem',
      itemHeight: 400,
      itemWidth: 260,
      FocusCallback: this.gridFocusCallback,
      paddingBottom: 30,
      paddingLeft: 10,
      activeEvent: true,
      keyEvent: {},
      enterPressed: this.gridItemSelected,
      isLeftMovementAllowed: false

    };

    this.dataLoaded = false;
    if (window.innerWidth <= 1280) {
      this.gridProps.wrapperHeight = (this.gridProps.wrapperHeight * .66);
      this.gridProps.paddingBottom = (this.gridProps.paddingBottom * .66);
      this.gridProps.coloumns = 4;
    }
  }

  /**
    * Description: React Inbuilt method for defining  the property types
    * @param {null}
    * @returns {object}
  */
  static get propTypes() {
    return {
      groupingID: PropTypes.number
    }
  }

  /**
  * Description: Selectable item component
  * @param {integer} index
  * @return {null}
  */

  selectableItem(props) {

    const styles = {
      width: props.width,
      height: props.height
    };

    return (
      <img style={styles} src={props.image_url} onError={Utility.onImageErrorHandler} alt=""></img>
    );
  }


  /**
   * Description: this is callback method which invoke when grid item is selected
   * @param {integer} index
   * @return {null}
   */
  gridItemSelected(index) {
    if (!Utility.isEmptyObject(this.props.selectableItemClicked)) {
      if (this.selectableData[index].type === SELECTABLE_TYPE.PROGRAM || this.selectableData[index].type === SELECTABLE_TYPE.MOVIE) {
        this.props.selectableItemClicked(this.selectableData[index].programId);
      }
    }
  }

  //============================Start-----Selectable Screen data fetch phase===================// 
  /**
   * Description: prepare data for grid and pass to grid property 
   * @param {null} 
   * @return {null}
   */
  componentDidMount(prevProps, prevstate) {
    this.props.onRef(this)
    this.getGroupingData();
    if (this.selectableIds.length > 0) {
      this.dataForSelctable(this.selectableIds);
    } else {
      this.setState({ noData: true });
    }

    if (!Utility.isEmptyObject(this.verticalGrid) && this.props.isFocus) {
      this.verticalGrid.focus();
    }
  }

  /**
   * Description: this method fetch group data e.g selectable array 
   * @param {null} 
   * @return {null}
   */
  getGroupingData = () => {
    this.dataLoaded = false;
    let groupNo = (this.props && this.props.getGroupings && this.props.getGroupings.message) ? this.props.getGroupings.message.data.length : 0;
    if (groupNo > 0) {
      for (var groupIndex = 0; groupIndex < groupNo; groupIndex++) {
        if (this.props.groupingID === this.props.getGroupings.message.data[groupIndex].id) {
          this.groupID = groupIndex;
          this.groupingID = groupIndex;
          if (this.props.getGroupings.message.data[groupIndex].i8nLabel) {
            this.menuName = this.props.getGroupings.message.data[groupIndex].i8nLabel;
          } else {
            this.menuName = "i8nLabel missing";
          }
          this.selectableIds = this.props.getGroupings.message.data[groupIndex].selectables;
        }
      }
    }
  }

  isComponentLoaded() {
    return (this.verticalGrid.isComponentLoaded() && this.dataLoaded);
  }


  gridFocusCallback(direction) {

    switch (direction) {
      case commonConstants.DIRECTION_LEFT:
        this.deFocus();
        this.props.selectableMenuCallback();
        break;
      default:
        break;
    }
  }
  /**
   * Description: this method fetch selectable data e.g image and id 
   * @param {Array} selectableIdArray
   * @return {null}
   */
  dataForSelctable = (selectableIdArray) => {
    var selectableWrapper = document.getElementsByClassName("selectable-related-title");
    var selectableWrapperWidth = selectableWrapper[0].clientWidth;
    var selectableWrapperPadding = window.getComputedStyle(selectableWrapper[0], null).getPropertyValue('padding-left');
    selectableWrapperPadding = selectableWrapperPadding.substring(0, selectableWrapperPadding.length - 2);
    selectableWrapperWidth = selectableWrapperWidth - (selectableWrapperPadding * 2);

    if (selectableIdArray.length > 0) {
      var queryString = '?id=' + selectableIdArray.join('&id=');
    }
    return Method.get(API_INTERFACE.SELECTABLES + queryString, "").then(
      req_response => {
        let getResponse = responseActions.response(req_response);
        if (getResponse) {
          if (this.state && this.state.items) {
            for (var selectableIndex = 0; selectableIndex < getResponse.message.data.length; selectableIndex++) {
              this.selectableData.push(getResponse.message.data[selectableIndex]);
              for (var imageTypeId = 0; imageTypeId < getResponse.message.data[selectableIndex].images.length; imageTypeId++) {
                if (this.props.getGroupings.message.data[this.groupingID].imageType === getResponse.message.data[selectableIndex].images[imageTypeId].type) {
                  var itemObj = {
                    image_url: getResponse.message.data[selectableIndex].images[imageTypeId].url,
                    width: parseInt(getResponse.message.data[selectableIndex].images[imageTypeId].width, 10),
                    height: parseInt(getResponse.message.data[selectableIndex].images[imageTypeId].height, 10)
                  };
                  this.state.items.push(this.selectableItem(itemObj));
                  this.gridProps.itemHeight = parseInt(getResponse.message.data[selectableIndex].images[imageTypeId].height, 10);
                  this.gridProps.itemWidth = parseInt(getResponse.message.data[selectableIndex].images[imageTypeId].width, 10);
                  break;
                }
              }
            }

            var gridWidth = (this.gridProps.itemWidth + (10)) * 6;
            if (gridWidth > selectableWrapperWidth) {
              var coloumns = Math.round(selectableWrapperWidth / (this.gridProps.itemWidth + (20)));
              this.gridProps.coloumns = coloumns;
            } else {
              this.gridProps.coloumns = 6;
            }
            this.gridProps.entries = this.state.items;

            this.setState({ isLoading: false, noData: false });
            this.dataLoaded = true;
          }
        }
      },
      error => {
        return responseActions.errorResponse(error);
      }
    ).catch(function (error) {

    });
  }

  /**
    * Description: React Inbuilt method 
    * this method check weather there is need of updating the selectable screen
    * @param {Object} prevProps
  */
  componentDidUpdate(prevProps) {
    if (prevProps.groupingID !== this.props.groupingID) {
      this.gridProps.entries.length = 0;
      this.setState(
        {
          items: [],
          isLoading: false,
        })
      this.getGroupingData();
      if (this.selectableIds.length > 0) {
        this.dataForSelctable(this.selectableIds);
      } else {
        this.setState({ noData: true });
      }
    }
    //// Back key code fixed ///////////////
    if (!Utility.isEmptyObject(this.verticalGrid) && this.props.isFocus) {
      this.verticalGrid.focus();
    }
    //// Back key code fixed ///////////////
  }

  /**
    * Description: This is callback method for back key pressed in vertical grid
    *
  */
  onBackKeyPressed = () => {
    this.props.onBackKeyPressed();
  }

  /**
    * Description: This method JSX of vetical grid
    * @param {JSX}
  */

  renderGrid = () => {
    if (this.gridProps.entries.length > 0) {
      return <VerticalGrid onRef={instance => (this.verticalGrid = instance)} data={this.gridProps} onBackKeyPressed={this.onBackKeyPressed} />;
    } else if (this.state.noData === true) {
      return <div> <Trans i18nKey="no_data_message">No Data here</Trans></div>;
    } else {
      return <div><Trans i18nKey="loading_data_message">Loading</Trans></div>;
    }
  }


  /**
    * Description: This method add focus on vertical grid
    *
  */
  focus() {
    if (!Utility.isEmptyObject(this.verticalGrid)) {
      this.verticalGrid.focus();
    }
  }



  /**
    * Description: This method remove focus on vertical grid
    *
  */
  deFocus = () => {
    this.verticalGrid.deFocus();
  }

  /**
    * Description: This method return weather grid is focused or not
    * @return {boolean}
  */
  isFocused = () => {
    return ((!Utility.isEmptyObject(this.verticalGrid)) && this.verticalGrid.isFocused());
  }

  /**
    * Description: React Inbuilt method 
  */
  render() {
    this.gridProps.activeEvent = this.props.activeEvent;
    if (!this.props.activeEvent) {
      this.keyEvent = {};
    }
    if (this.props.activeEvent && !Utility.isEmpty(this.props.keyEvent)) {
      this.gridProps.keyEvent = this.props.keyEvent;
    }
    return (
      <div className='slide-container-wrapper selectable-related-title'>
        <div className="title-related-top">
          <h3><Trans i18nKey={this.menuName}>{this.menuName}</Trans></h3>
        </div>
        <this.renderGrid />
      </div>
    )
  }
}

// default grouping id
Selectables.defaultProps = {
  groupingID: 2002
}

const mapStateToProps = state => ({
  getUiConfig: state.getUiConfig,
  getGroupings: state.getGroupings
});

//export default Menu;
export default connect(mapStateToProps)(Selectables)