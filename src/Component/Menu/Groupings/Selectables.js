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
import VerticalGrid from '../../Grids/verticalGrid';
import Method from '../../../services/services';
import API_INTERFACE from '../../../constants/uri.constant';
import { responseActions } from '../../../actions/action.response';
import Utility from '../../../commonUtilities';
const SELECTABLE_TYPE = { "BUTTON": "button", "PROGRAM": "program" }

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
    this.selectableIds = [];
    this.selectableData = [];
    this.menuName = "";
    this.groupID = 0;
    this.gridProps = {
      entries: [],
      wrapperHeight: 763,
      wrapperWidth: 1800,
      lazyCallback: this.lazyCallback,
      coloumns: 6,
      gridClass: 'VerticalGrid',
      gridItemClass: 'VerticalGridItem',
      itemHeight: 400,
      itemWidth: 260,
      FocusCallback: this.FirstGridFocusCallback,
      paddingBottom: 30,
      paddingLeft: 10,
      activeEvent: true,
      keyEvent: {},
      enterPressed: this.gridItemSelected,

    };
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
      <img style={styles} src={props.image_url} alt="Image Loading ...."></img>
    );
  }


  /**
   * Description: this is callback method which invoke when grid item is selected
   * @param {integer} index
   * @return {null}
   */
  gridItemSelected(index) {
    if (!Utility.isEmptyObject(this.props.selectableItemClicked)) {
      if (this.selectableData[index].type === SELECTABLE_TYPE.PROGRAM) {
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
    this.getGroupingData();
    if (this.selectableIds.length > 0) {
      this.dataForSelctable(this.selectableIds);
      this.state.noData = false;
    } else {
      this.setState({ noData: true });
    }
  }

  /**
   * Description: this method fetch group data e.g selectable array 
   * @param {null} 
   * @return {null}
   */
  getGroupingData = () => {
    let groupNo = (this.props && this.props.getGroupings && this.props.getGroupings.message) ? this.props.getGroupings.message.data.length : 0;
    if (groupNo > 0) {
      for (var groupIndex = 0; groupIndex < groupNo; groupIndex++) {
        if (this.props.groupingID === this.props.getGroupings.message.data[groupIndex].id) {
          this.groupID = groupIndex;
          this.groupingID = groupIndex;
          this.menuName = this.props.getGroupings.message.data[groupIndex].label;
          this.selectableIds = this.props.getGroupings.message.data[groupIndex].selectables;
        }
      }
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
                    width: getResponse.message.data[selectableIndex].images[imageTypeId].width,
                    height: getResponse.message.data[selectableIndex].images[imageTypeId].height
                  };
                  this.state.items.push(this.selectableItem(itemObj));
                  this.gridProps.itemHeight = getResponse.message.data[selectableIndex].images[imageTypeId].height;
                  this.gridProps.itemWidth = getResponse.message.data[selectableIndex].images[imageTypeId].width;
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
            this.setState({ isLoading: false });

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
        this.state.noData = false;
      } else {
        this.setState({ noData: true });
      }
    }
  }

  /**
    * Description: This method JSX of vetical grid
    * @param {JSX}
  */

  renderGrid = () => {
    if (this.gridProps.entries.length > 0) {
      return <VerticalGrid data={this.gridProps} />;
    } else if (this.state.noData === true) {
      return <div> <Trans i18nKey="no_data_message">No Data here</Trans></div>;
    } else {
      return <div><Trans i18nKey="loading_data_message">Loading</Trans></div>;
    }
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
          <h3>{this.menuName}</h3>
        </div>
        <this.renderGrid />
      </div>
    )
  }
}


Selectables.defaultProps = {
  groupingID: 2002
}

const mapStateToProps = state => ({
  getUiConfig: state.getUiConfig,
  getGroupings: state.getGroupings
});

//export default Menu;
export default connect(mapStateToProps)(Selectables)