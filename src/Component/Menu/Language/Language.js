/**
* Summary: Menu Language Component
* Description: This is Component form menu language
* @author Sawan Kumar
* @date  31.07.2018
*/
import React, { Component } from 'react';
import RadioGrid from '../../FocusElement/RadioGrid';
import ButtonGrid from '../../FocusElement/ButtonGrid';
import CommonUtility from '../../../commonUtilities';
import { Trans } from 'react-i18next';

/**
 * 
 */
const numberOfLangColumn = 2;
/**
* Description: Defind Button Name
*/
const button = [{ id: "confirm", label: 'confirm' }];
/**
* Description: Define constant to visible Component Row
*/
const ROW_VISIBLE = {
  "CHECKBOX_BUTTON": 10,
  "BUTTON": 1
}
let languageData = [];
const COMPONENT_NAME = {
  "LANGUAGE": "language",
  "BUTTON": "button"
}
/**
* Description: Define constant Button List Object
*/
const BUTTON_LIST = {
  "CONFIRM": "confirm"
}
/**
* Description: Define constant for the Key LEFT, RIGHT, UP, DOWN
*/
const KEY = {
  "LEFT": "LEFT",
  "RIGHT": "RIGHT",
  "UP": "UP",
  "DOWN": "DOWN"
}
class MenuRadioGrid extends RadioGrid{
  constructor(props) {
    super(props);
    console.log(this.state);
    console.log(this.props);
  }
  /**
    * Description: Focus on item by Key Press Right
    * @param {null} 
    * @return {null}
    */
   focusOnRightKey() {
    if (!this.rowData()[this.state.selectedRow][this.state.selectedItemIndex + 1]) {
      return;
    }
    console.log(this.state.selectedItemIndex)
    if(this.state.selectedItemIndex >=0){
      if ((this.state.selectedItemIndex < this.props.col - 1)) {
        this.setState({ selectedItemIndex: this.state.selectedItemIndex + 1 });
      }
    }
    
  }

  componentDidUpdate(){
    console.log(this.state);
    console.log(this.props);
  }
  componentDidMount(){
    super.componentDidMount();
    let focusColumn = 0,focusRow=0;
    if(this.props.scrolledRowIndex > 0){
      focusRow =  this.props.scrolledRowIndex % numberOfLangColumn;
    }
    this.setState({
      selectedItemIndex:0,
      selectedRow:2
    });

  }
}

class Language extends Component {
  constructor(props) {
    super(props);
    this.state = {
      language: '',
      currentRowIndex: 0,
      scrolledRowIndex: 0,
      direction: "",
      activeIndex:-1,
      activeGrid: 1,
      prevGrid:1,
      selectedLang:''
    }
    this.currentActiveGrid = 1;
    this.preSelectedLangIndex = 0;
    this.enterEvent = this.enterEvent.bind(this);
    this.eventCallbackFunction = this.eventCallbackFunction.bind(this);
  }

  /**
    * Description: Get the Enter Key Event
    * @param {gridname}  string
    * @param {name}  string
    * @param {rowIndex}  number
    * @param {colIndex}  number
    * @param {col}  number
    * @return {null}
    */
  enterEvent(gridname, name, rowIndex, colIndex, col) {
    if (gridname != COMPONENT_NAME.BUTTON) {
      let index = rowIndex * col + colIndex;
      let updateArray = [...this.state[gridname]];

      updateArray.map((val, i) => {

        Object.keys(val).map((innerValue) => {
          val[innerValue].status = false;
          if (i === index) {
            val[innerValue].status = true;
          }
          return val;
        })
      })
      this.setState({ updateArray });
    }
    if (gridname === COMPONENT_NAME.LANGUAGE) {
      this.setState({selectedLang:Object.keys(name)[0]});
    }
  }
  componentWillMount() {
    const language = CommonUtility.getUILanguagesAvailable();
    if (language.length > 0) {
      languageData = language.map((item, i) => {
        return this.init(item, i)
      })

    }
    this.setState({
      language: languageData
    })
  }
  init(item, i) {
    let obj = null;
    if (item === "en") {
      this.preSelectedLangIndex = i;
      obj = {
        [item]: {
          id: 'audiolang-' + i,
          status: true
        }
      }
    }
    else {
      obj = {
        [item]: {
          id: 'audiolang-' + i,
          status: false
        }
      }
    }
    return obj

  }
 /**
  * Description: do nothing onchange
  * @param {null}
  * @return {null}
  */ 
 onChange(){
   return;
 }
 /**
  * Description: on changing grid
  * @param {null}
  * @return {null}
  */
  eventCallbackFunction(direction, currentRowIndex, scrolledRowIndex) {
    switch (direction) {
      case KEY.LEFT:      
        this.props.removeSubMenu();
        break;
      case KEY.UP:
        if (this.state.activeGrid === 1) {
          return false;
        }
        this.setState((prev)=>{
         return { activeGrid: prev.prevGrid,
          currentRowIndex: currentRowIndex,
          scrolledRowIndex: scrolledRowIndex,
          direction: direction
         }
        })
        break;

      case KEY.DOWN:
        if (this.state.activeGrid !== 2) {
          this.currentActiveGrid = this.state.activeGrid;
        }
        this.setState((prev)=>{
         return { 
              defaultItemIndex: 0,
              active: 0,
              prevGrid: this.currentActiveGrid,
              activeGrid: 2,
              currentRowIndex: currentRowIndex,
              scrolledRowIndex: scrolledRowIndex,
              direction: direction
         }
        })
        break;
    }
    return;
  }
  render() {
    return (
      <div className="sub-menu language">
        <div className="heading"><h3><Trans i18nKey="choose_your_lang">Choose Your Language</Trans></h3></div>
        <div className="checkbox-lists">
          <div className="col-2">
            <MenuRadioGrid
              data={this.state.language}
              enterEvent={this.enterEvent}
              gridNo={1}
              gridName={COMPONENT_NAME.LANGUAGE}
              col={numberOfLangColumn}
              leftNotMove={false}
              isKeyEvent={this.props.subMenuActiveStatus && this.state.activeGrid === 1}
              firsttimeActive={false}
              eventCallback={this.eventCallbackFunction}
              onChange={this.onChange}
              activeIndex={this.state.activeIndex}  //active column
              currentRowIndex={this.state.currentRowIndex} //active row
              scrolledRowIndex={this.state.scrolledRowIndex}
              focusDirection={this.state.direction} //Direction
              visibleRow={ROW_VISIBLE.CHECKBOX_BUTTON}
              preSelectedLangIndex = {this.preSelectedLangIndex}
            />

          </div>
        </div>
        <div className="menu-button-row">
          <ButtonGrid
            data={button}
            gridNo={2}
            enterEvent={this.enterEvent}
            gridName={COMPONENT_NAME.BUTTON} 
            col={1}
            leftNotMove={false}
            isKeyEvent={this.props.subMenuActiveStatus && this.state.activeGrid === 2}
            firsttimeActive={this.state.firsttimeActive}
            eventCallback={this.eventCallbackFunction}
            onChange={this.onChange}
            activeIndex={this.state.active}
            currentRowIndex={this.state.currentRowIndex}
            scrolledRowIndex={this.state.scrolledRowIndex}
            focusDirection={this.state.direction}
            defaultItemIndex={this.state.defaultItemIndex}
            visibleRow={ROW_VISIBLE.BUTTON}
          />
        </div>
      </div>
    )
  }
}

export default Language;