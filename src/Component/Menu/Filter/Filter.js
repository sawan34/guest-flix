/**
* Summary: Menu Language Component
* Description: This is Component form menu language
* @author Sawan Kumar
* @date  31.07.2018
*/
import React, { Component } from 'react';
import ButtonGrid from '../../FocusElement/ButtonGrid';
import CommonUtility from '../../../commonUtilities';
import MenuCheckBoxGrid from './MenuCheckBoxGrid';
import { Trans } from 'react-i18next';


const dummyLang = ['en','es','gn','pd','pl']

const dummyFilter =['fl1','fl2','fl3','fl4','fl5']
/**
 * 
 */
const numberOfColumn = 4;
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
  "RATING":"rating",
  "BUTTON": "button",
  'LANGUAGE_SELECT':'languageSelect',
  'RATING_SELECT':'filterSelect'
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

const selection = ["selectAll","selectNone"];


class Filter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      language: '',
      [COMPONENT_NAME.RATING]:'',
      [COMPONENT_NAME.LANGUAGE_SELECT]:false,
      [COMPONENT_NAME.RATING_SELECT]:false,
      currentRowIndex: 0,
      scrolledRowIndex: 0,
      direction: "",
      activeIndex:-1,
      activeGrid: 1,
      prevGrid:1,
      selectedLang:''
    }
    this.currentActiveGrid = 1;
    this.previousActiveGrid = 0;
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
            if (i === index) {
            val[innerValue].status = !val[innerValue].status;
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
    const language = dummyLang;
    let selectLang = [],value;
    if (language.length > 0) {
      languageData = language.map((item, i) => {
        return this.init(item, i,'es')
      })
    }

    if (selection.length > 0) {
        selectLang = selection.map((item, i) => {
          return this.init(item, i,value)
        })
      }


    this.setState({
      language: languageData,
      [COMPONENT_NAME.LANGUAGE_SELECT]:selectLang,
      [COMPONENT_NAME.RATING_SELECT]:selectLang,
      [COMPONENT_NAME.RATING]:selectLang

    })
  }
  init(item,i,value) {
    let obj = null;
    if (item === value) {
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
          //this.currentActiveGrid = this.state.activeGrid;
        }
     
      setTimeout(this.changeGrid.bind(this,scrolledRowIndex,direction),0);
        break;
    }
    return;
  }
  changeGrid(scrolledRowIndex,direction){
    this.setState((prev)=>{
        return { 
             defaultItemIndex: 0,
             active: 0,
             prevGrid: this.currentActiveGrid,
             activeGrid: this.state.activeGrid+1,
             currentRowIndex: -1,
             scrolledRowIndex: scrolledRowIndex,
             direction: direction
        }
       })
  }


  render() {
    return (
        <div className="sub-menu language">
            <div className="heading"><h3><Trans i18nKey="choose_your_lang">Choose Your Language</Trans></h3></div>
            <div className="checkbox-lists">
                <div className={"col-" + 2}>
                    <MenuCheckBoxGrid
                        data={this.state[COMPONENT_NAME.LANGUAGE_SELECT]}
                        enterEvent={this.enterEvent}
                        gridNo={1}
                        gridName={COMPONENT_NAME.LANGUAGE_SELECT}
                        col={2}
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
                        preSelectedLangIndex={0}
                        numberOfColumn={2}
                    />
                </div>
            </div>

            <div className="checkbox-lists">
                <div className={"col-" + numberOfColumn}>
                    <MenuCheckBoxGrid
                        data={this.state.language}
                        enterEvent={this.enterEvent}
                        gridNo={2}
                        gridName={COMPONENT_NAME.LANGUAGE}
                        col={numberOfColumn}
                        leftNotMove={false}
                        isKeyEvent={this.props.subMenuActiveStatus && this.state.activeGrid === 2}
                        firsttimeActive={false}
                        eventCallback={this.eventCallbackFunction}
                        onChange={this.onChange}
                        activeIndex={0}  //active column
                        currentRowIndex={0} //active row
                        scrolledRowIndex={0}
                        focusDirection={this.state.direction} //Direction
                        visibleRow={ROW_VISIBLE.CHECKBOX_BUTTON}
                        preSelectedLangIndex={0}
                        numberOfColumn={numberOfColumn}
                    />
                </div>
            </div>

            <div className="heading"><h3><Trans i18nKey="choose_your_lang">Choose Your Language</Trans></h3></div>
            <div className="checkbox-lists">
                <div className={"col-" + 2}>
                    <MenuCheckBoxGrid
                        data={this.state[COMPONENT_NAME.LANGUAGE_SELECT]}
                        enterEvent={this.enterEvent}
                        gridNo={3}
                        gridName={COMPONENT_NAME.LANGUAGE_SELECT}
                        col={2}
                        leftNotMove={false}
                        isKeyEvent={this.props.subMenuActiveStatus && this.state.activeGrid === 3}
                        firsttimeActive={false}
                        eventCallback={this.eventCallbackFunction}
                        onChange={this.onChange}
                        activeIndex={0}  //active column
                        currentRowIndex={this.state.currentRowIndex} //active row
                        scrolledRowIndex={this.state.scrolledRowIndex}
                        focusDirection={this.state.direction} //Direction
                        visibleRow={ROW_VISIBLE.CHECKBOX_BUTTON}
                        preSelectedLangIndex={0}
                        numberOfColumn={2}
                    />
                </div>
            </div>


            <div className="checkbox-lists">
            <div className={"col-" + numberOfColumn}>
                <MenuCheckBoxGrid
                    data={this.state.language}
                    enterEvent={this.enterEvent}
                    gridNo={4}
                    gridName={COMPONENT_NAME.LANGUAGE}
                    col={numberOfColumn}
                    leftNotMove={false}
                    isKeyEvent={this.props.subMenuActiveStatus && this.state.activeGrid === 4}
                    firsttimeActive={false}
                    eventCallback={this.eventCallbackFunction}
                    onChange={this.onChange}
                    activeIndex={0}  //active column
                    currentRowIndex={0} //active row
                    scrolledRowIndex={0}
                    focusDirection={this.state.direction} //Direction
                    visibleRow={ROW_VISIBLE.CHECKBOX_BUTTON}
                    preSelectedLangIndex={0}
                    numberOfColumn={numberOfColumn}
                />
            </div>
        </div>


            <div className="menu-button-row">
                <ButtonGrid
                    data={button}
                    gridNo={5}
                    enterEvent={this.enterEvent}
                    gridName={COMPONENT_NAME.BUTTON}
                    col={1}
                    leftNotMove={false}
                    isKeyEvent={this.props.subMenuActiveStatus && this.state.activeGrid === 5}
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

export default Filter;