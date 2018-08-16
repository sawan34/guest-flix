/**
* Summary: Menu Language Component
* Description: This is Component form menu language
* @author Sawan Kumar
* @date  31.07.2018
*/
import React, { Component } from 'react';
import CommonUtility from '../../../commonUtilities';

import { alertConstants } from '../../../constants/alert.constant';
import { Trans } from 'react-i18next';
import UTILITY from "../../../commonUtilities";
import RadioGrid from '../../FocusElement/RadioGrid';


/**
* Description: Define constant to visible Component Row
*/
const ROW_VISIBLE = {
  "CHECKBOX_BUTTON": 10
}
const COMPONENT_NAME = {
  "LANGUAGE": "language"
  
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
class Language extends Component {
  constructor(props) {
    super(props);
    this.state = {
      language: '',
      currentRowIndex: 0,
      scrolledRowIndex: 0,
      direction: "",
      activeIndex: 0,
      activeGrid: -1,
      prevGrid: 1,
      selectedLang: '',
      error: false,
      errorMessage: ''
    }
    this.currentActiveGrid = 1;
    this.preSelectedLangIndex = 0;
    this.numberOfLangColumn = 2;
    this.enterEvent = this.enterEvent.bind(this);
    this.eventCallbackFunction = this.eventCallbackFunction.bind(this);
    this.defaultUIlang = CommonUtility.getDefaultUILanguage();
    this.focus = this.focus.bind(this);
    this.deFocus = this.deFocus.bind(this);
    this.isFocused = this.isFocused.bind(this);
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
        val.status = false;
        if (i === index) {
          val.status = true;
        }
        return val;

      })
      this.setState({ updateArray });
    }
    if (gridname === COMPONENT_NAME.LANGUAGE) {
      this.setState((prev) => {
        let userPreferance = this.props.getUserPreferences, toSendData = {};
        if (userPreferance.type === alertConstants.SUCCESS) {
          toSendData.stayId = userPreferance.data.stayId;
          toSendData.preferences = {
            uiLanguage: name.value,
            programFilters: userPreferance.data.programFilters
          }
          this.props.actionSaveUserPreferences(this.props.stayId, toSendData);
          this.props.changeLanguage(name.value);
          return { selectedLang: name.value, error: false };
        } else { // on error
          this.setState(
            {
              error: true,
              errorMessage: userPreferance.data
            }
          );
        }

      });
    }
  }
  componentWillMount() {
    let languageData = [];
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
    if (item === this.defaultUIlang) {
      this.preSelectedLangIndex = i;
      obj = {
        value: item,
        id: COMPONENT_NAME.LANGUAGE + i,
        status: true
      }
    }
    else {
      obj = {
        value: item,
        id: COMPONENT_NAME.LANGUAGE + i,
        status: false
      }
    }
    return obj
  }

  componentDidMount() {
    if (!UTILITY.isEmptyObject(this.props.onRef)) {
      this.props.onRef(this);
    }
  }
  /**
   * Description: do nothing onchange
   * @param {null}
   * @return {null}
   */
  onChange() {
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
        this.deFocus();
        this.props.removeSubMenu();
        break;
    }
    return;
  }

  focus() {
    this.audioLangGrid.focus();
    this.setState({activeGrid: 1});
  }

  deFocus() {
    this.audioLangGrid.deFocus();
    this.setState({activeGrid: -1});
  }

  isFocused() {
    return this.audioLangGrid.isFocused();
  }

  render() {
    return (
      <div className="sub-menu language">
        {<div>{this.state.error ? this.state.errorMessage:""}</div>}
        <div className="heading"><h3><Trans i18nKey="choose_your_lang">Choose Your Language</Trans></h3></div>
        <div className="checkbox-lists">
          <div className="col-2">
          <RadioGrid
                    onRef={instance => (this.audioLangGrid = instance)}
                    data={this.state.language}
                    enterEvent={this.enterEvent}
                    gridNo={1}
                    gridName={'language'}
                    col={2}
                    leftNotMove={false}
                    isKeyEvent={this.state.activeGrid === 1}
                    eventCallback={this.eventCallbackFunction}
                    onChange={this.onChange}
                    activeIndex={0}
                    currentRowIndex={this.state.currentRowIndex}
                    scrolledRowIndex={this.state.scrolledRowIndex}
                    focusDirection={this.state.direction}
                    visibleRow={ROW_VISIBLE.RADIO_BUTTON}
            />

          </div>
        </div>
      </div>
    )
  }
}

export default Language;