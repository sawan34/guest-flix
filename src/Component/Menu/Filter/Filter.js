/**
* Summary: Menu Language Component
* Description: This is Component form menu language
* @author Sawan Kumar
* @date  31.07.2018
*/
import React, { Component } from 'react';
import _ from 'lodash';
import CommonUtility from '../../../commonUtilities';
import { alertConstants } from '../../../constants/alert.constant';
import { Trans } from 'react-i18next';
import UTILITY from "../../../commonUtilities";
import CheckboxGrid from '../../FocusElement/CheckboxGrid';

const dummyLang = ['en','es','gn','pd','pl'];
const selection = ["select_all","select_none"];

/**
* Description: Define constant to visible Component Row
*/
const ROW_VISIBLE = {
  "CHECKBOX_BUTTON": 10
}
const COMPONENT_NAME = {
  "LANGUAGE": "language",
  "RATING":"rating",
  'LANGUAGE_SELECT':'languageSelect',
  'RATING_SELECT':'filterSelect'  
}
const SELECT_ID = {
    SELECT:'filterSelect0',
    DE_SELECT:'filterSelect0'
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
class Filter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      [COMPONENT_NAME.LANGUAGE] :{data:[],selected:[]},
      [COMPONENT_NAME.RATING]:{data:[],selected:[]},
      [COMPONENT_NAME.LANGUAGE_SELECT]:{data:[],selected:[]},
      [COMPONENT_NAME.RATING_SELECT]:{data:[],selected:[]},
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
    this.numberOfColumn = 5;
    this.filters = "";
    
    this.enterEvent = this.enterEvent.bind(this);
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
    if(gridname === COMPONENT_NAME.RATING_SELECT){    
        if(name.status===true){
            return;
        }    
        this.selectAndDeSelect.call(this,name,COMPONENT_NAME.RATING_SELECT,COMPONENT_NAME.RATING);
        this.postData.call(this);
    }
    if (gridname === COMPONENT_NAME.LANGUAGE_SELECT) {
        if(name.status===true){
            return;
        }     
       this.selectAndDeSelect.call(this,name,COMPONENT_NAME.LANGUAGE_SELECT,COMPONENT_NAME.LANGUAGE);
       this.postData.call(this);
    }      

    if (gridname === COMPONENT_NAME.LANGUAGE) {
     this.selectFilter.call(this,name,COMPONENT_NAME.LANGUAGE);
    }

    if (gridname === COMPONENT_NAME.RATING) {
            this.selectFilter.call(this,name,COMPONENT_NAME.RATING);
      }

  }
  /**
    * Description: Select Filter
    * @param {Object}  name
    * @param {String}  component
    * @return {null}
    */
  selectFilter(name,component){
    this.setState((prev) => {
        var oldData =  [...this.state[component].data];
        var selectedData = [...this.state[component].selected];
        var newData = oldData.map((item)=>{
            if(item.id ===name.id){
                item.status = !item.status;
                if(item.status){
                    if(_.indexOf(selectedData,item) < 0){
                         selectedData.push(item.value);
                    }
                }else{
                    selectedData = selectedData.filter((item)=>{
                        return item.value !==name.value
                    })
                }
            }
            return item;
        });
        return {
            [component]:{
                data:newData,
                selected:selectedData
            }
        }
      });
  }
 
   /**
    * Description: Post Data
    * @return {null}
    */
  postData(){
    let userPreferance = this.props.getUserPreferences, toSendData = {};
    if (userPreferance.type === alertConstants.SUCCESS) {
        toSendData.stayId = userPreferance.data.stayId;
        toSendData.preferences = {
            uiLanguage: userPreferance.data.uiLanguage,
            programFilters: {
                ratings:this.state[COMPONENT_NAME.RATING].selected,
                languages:this.state[COMPONENT_NAME.LANGUAGE].selected
            }
          }
        this.props.actionSaveUserPreferences(this.props.stayId, toSendData);
    }else { // on error
        this.setState(
          {
            error: true,
            errorMessage: userPreferance.data
          }
        );
      }
    
  }
 /**
    * Description: Select Filter
    * @param {Object}  name
    * @param {String} selectName
    * @param {String}  component
    * @return {null}
    */
  selectAndDeSelect(name,selectName,componentName){
    this.setState(prev=>{
        let data =  [...prev[componentName].data];
        let selectButton = [...prev[selectName].data];
        let selectedArray = [];
        selectButton =  selectButton.map((item)=>{
            if(item.id === name.id){
                item.status = true;               
            }else{
                item.status = false;                    
            }
            return item;
        });
        data = data.map((item)=>{
            if(SELECT_ID.SELECT === name.id){
                item.status = true; 
                selectedArray.push(item.value)                   
            }else{
                item.status = false;   
            }
            return item;
        });

        return { [componentName]:{
            data:data,
            selected:selectedArray
        },
        [selectName]:{
            data:selectButton
        }
      };
    });
  }

  componentWillMount() {
    let languageData = [] ,selectRating = [],ratings=[];
    this.filters =  this.props.configUserPreference;
    const filtersRating =this.filters.ratings;    
    const filtersLanguage = this.filters.languages;
    const selectedPreferenceRating = this.props.getUserPreferences.data.programFilters.ratings;
    const selectedPreferenceLanguage = this.props.getUserPreferences.data.programFilters.languages;

     //filter language
     if (filtersLanguage.length > 0) {
        languageData = filtersLanguage.map((item, i) => {
          return this.init(item, i,COMPONENT_NAME.LANGUAGE,selectedPreferenceLanguage)
        })
      }

     //for filter select options
     if (selection.length > 0) {
        selectRating = selection.map((item, i) => {
          let translated  = <Trans i18nKey={item}></Trans>;            
          return this.init(translated, i,COMPONENT_NAME.RATING_SELECT)
        })
      };
    //for filter filter
    if (filtersRating.length > 0) {
        ratings = filtersRating.map((item, i) => {
          return this.init(item, i,COMPONENT_NAME.RATING,selectedPreferenceRating)
        })
      };    
   
    this.setState({
      [COMPONENT_NAME.LANGUAGE]: {data:languageData,selected:[]},
      [COMPONENT_NAME.RATING_SELECT]:{data:selectRating,selected:[]},
      [COMPONENT_NAME.RATING]:{data:ratings,selected:selectedPreferenceRating},
      [COMPONENT_NAME.LANGUAGE_SELECT]:{data:selectRating,selected:selectedPreferenceLanguage},

    })
  }
  init(item, i,component,value=null) {
    let obj = null;
    if(_.isArray(value)){
        if(_.indexOf(value,item) > -1){
            obj = {
                value: item,
                id: component + i,
                status: true
              }
        }else{
            obj = {
                value: item,
                id: component + i,
                status: false
              }
        }
    }else if (item === value) {
      this.preSelectedLangIndex = i;
      obj = {
        value: item,
        id: component + i,
        status: true
      }
    }
    else {
      obj = {
        value: item,
        id: component + i,
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
  eventCallbackSelectFilter(direction, currentRowIndex, scrolledRowIndex) {
    switch (direction) {
      case KEY.LEFT:
        this.deFocus();
        this.props.removeSubMenu();
        break;
      case KEY.DOWN:
        this.ratingSelect.deFocus();
        this.ratingData.focus(); 
        this.setState({
            activeGrid: 2,
            currentRowIndex: currentRowIndex,
            scrolledRowIndex: scrolledRowIndex,
            direction: direction
          }); 
      break;    
    }
    return;
  }

  /**
   * Description: on changing grid
   * @param {null}
   * @return {null}
   */
  eventCallbackFilters(direction, currentRowIndex, scrolledRowIndex) {
      switch (direction) {
          case KEY.LEFT:
              this.deFocus();
              this.props.removeSubMenu();
              break;
          case KEY.UP:
              this.ratingData.deFocus();
              this.ratingSelect.focus();
              this.setState({
                  activeGrid: 1,
                  currentRowIndex: currentRowIndex,
                  scrolledRowIndex: scrolledRowIndex,
                  direction: direction
              });
         break;    
         case KEY.DOWN:
              this.ratingData.deFocus();
              this.languageSelect.focus();
              this.setState({
                  activeGrid: 3,
                  currentRowIndex: currentRowIndex,
                  scrolledRowIndex: scrolledRowIndex,
                  direction: direction
              });    
        break;    
     
      }
      return;
  }

  /**
   * 
   */
  eventCallbackSelectLanguage(direction, currentRowIndex, scrolledRowIndex){
    switch (direction) {
        case KEY.LEFT:
            this.deFocus();
            this.props.removeSubMenu();
            break;
        case KEY.UP:
            this.languageSelect.deFocus();
            this.ratingData.focus();
            this.setState({
                activeGrid: 2,
                currentRowIndex: currentRowIndex,
                scrolledRowIndex: scrolledRowIndex,
                direction: direction
            });
        break;  
        case KEY.DOWN:
            this.languageSelect.deFocus();
            this.languageData.focus();
            this.setState({
                activeGrid: 4,
                currentRowIndex: currentRowIndex,
                scrolledRowIndex: scrolledRowIndex,
                direction: direction
            });
        break;    

    }
    return;
  }

  /**
   * 
   */
  eventCallbackLanguages(direction, currentRowIndex, scrolledRowIndex){
      switch (direction) {
          case KEY.LEFT:
              this.deFocus();
              this.props.removeSubMenu();
              break;
          case KEY.UP:
              this.languageSelect.focus();
              this.languageData.deFocus();
              this.setState({
                  activeGrid: 3,
                  currentRowIndex: currentRowIndex,
                  scrolledRowIndex: scrolledRowIndex,
                  direction: direction
              });
          break;
          case KEY.DOWN:
             return;
          break;
      }
  }

  focus() {
      this.ratingSelect.focus();
      this.setState({activeGrid: 1});
      this.isFilterFocused = true;
  }

  deFocus() {
    this.isFilterFocused = false;  
    this.ratingSelect.deFocus();
    this.ratingData.deFocus();
    this.languageSelect.deFocus();
    this.languageData.deFocus();
    
    this.setState({activeGrid: -1});
  }

  isFocused() {
    return this.isFilterFocused;  
   // return this.ratingSelect.isFocused();
  }

  render() {
    return (
      <div className="sub-menu filter">
        {<div>{this.state.error && this.state.errorMessage}</div>}
        <div className="heading"><h3><Trans i18nKey="choose_your_lang">Choose Your Language</Trans></h3></div>
        <div className="checkbox-lists">
             <div className="sub-heading"><Trans i18nKey="by_rating">BY RATING</Trans></div>
          <div className="checkbox-header">
          <CheckboxGrid
                    onRef={instance => (this.ratingSelect = instance)}
                    data={this.state[COMPONENT_NAME.RATING_SELECT].data}
                    enterEvent={this.enterEvent}
                    gridNo={1}
                    gridName={COMPONENT_NAME.RATING_SELECT}
                    col={this.numberOfColumn}
                    leftNotMove={false}
                    isKeyEvent={this.state.activeGrid === 1}
                    eventCallback={this.eventCallbackSelectFilter.bind(this)}
                    onChange={this.onChange}
                    activeIndex={0}
                    currentRowIndex={this.state.currentRowIndex}
                    scrolledRowIndex={this.state.scrolledRowIndex}
                    focusDirection={this.state.direction}
                    visibleRow={ROW_VISIBLE.RADIO_BUTTON}
            />
          </div>
          <div className={"col-"+this.numberOfColumn}>
                    <CheckboxGrid
                        onRef={instance => (this.ratingData = instance)}
                        data={this.state[COMPONENT_NAME.RATING].data}
                        enterEvent={this.enterEvent}
                        gridNo={2}
                        gridName={COMPONENT_NAME.RATING}
                        col={this.numberOfColumn}
                        leftNotMove={false}
                        isKeyEvent={this.state.activeGrid === 2}
                        eventCallback={this.eventCallbackFilters.bind(this)}
                        onChange={this.onChange}
                        activeIndex={0}
                        currentRowIndex={this.state.currentRowIndex}
                        scrolledRowIndex={this.state.scrolledRowIndex}
                        focusDirection={this.state.direction}
                        visibleRow={ROW_VISIBLE.RADIO_BUTTON}
                    />
            </div>
          <div className="sub-heading"><Trans i18nKey="by_language">BY LANGUAGE</Trans></div>  
          <div className="checkbox-header">
          <CheckboxGrid
                    onRef={instance => (this.languageSelect = instance)}
                    data={this.state[COMPONENT_NAME.LANGUAGE_SELECT].data}
                    enterEvent={this.enterEvent}
                    gridNo={3}
                    gridName={COMPONENT_NAME.LANGUAGE_SELECT}
                    col={this.numberOfColumn}
                    leftNotMove={false}
                    isKeyEvent={this.state.activeGrid === 3}
                    eventCallback={this.eventCallbackSelectLanguage.bind(this)}
                    onChange={this.onChange}
                    activeIndex={0}
                    currentRowIndex={this.state.currentRowIndex}
                    scrolledRowIndex={this.state.scrolledRowIndex}
                    focusDirection={this.state.direction}
                    visibleRow={ROW_VISIBLE.RADIO_BUTTON}
            />
          </div>
          <div className={"col-"+this.numberOfColumn}>
                    <CheckboxGrid
                        onRef={instance => (this.languageData = instance)}
                        data={this.state[COMPONENT_NAME.LANGUAGE].data}
                        enterEvent={this.enterEvent}
                        gridNo={4}
                        gridName={COMPONENT_NAME.LANGUAGE}
                        col={this.numberOfColumn}
                        leftNotMove={false}
                        isKeyEvent={this.state.activeGrid === 4}
                        eventCallback={this.eventCallbackLanguages.bind(this)}
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

export default Filter;