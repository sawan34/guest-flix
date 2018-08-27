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
import CheckboxGrid from '../../FocusElement/CheckboxGrid';
import {commonConstants} from '../../../constants/common.constants';

const selection = ["select_all","select_none"];
const Hoc = (props) => props.children;

/**
* Description: Define constant to visible Component Row
*/
const ROW_VISIBLE = {
  "CHECKBOX_BUTTON": 10
}
/**
* Description: Define Component Row
*/
const COMPONENT_NAME = {
  "LANGUAGE": "language",
  "RATING":"rating",
  'LANGUAGE_SELECT':'languageSelect',
  'RATING_SELECT':'filterSelect'  
}

/**
* Description: Define Select ID
*/
const SELECT_ID = {
    [COMPONENT_NAME.RATING_SELECT]:{
        SELECT:'filterSelect0',
        DE_SELECT:'filterSelect1'
    },
    [COMPONENT_NAME.LANGUAGE_SELECT]:{
        SELECT:'languageSelect0',
        DE_SELECT:'languageSelect1'
    }
    
}
/**
* Description: Define constant for the Key LEFT, RIGHT, UP, DOWN
*/
const KEY = {
  "LEFT": commonConstants.DIRECTION_LEFT,
  "RIGHT": commonConstants.DIRECTION_RIGHT,
  "UP": commonConstants.DIRECTION_UP,
  "DOWN": commonConstants.DIRECTION_DOWN
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
    this.LanguageName = []
    
    this.enterEvent = this.enterEvent.bind(this);
    this.defaultUIlang = CommonUtility.getDefaultUILanguage();
    this.focus = this.focus.bind(this);
    this.deFocus = this.deFocus.bind(this);
    this.isFocused = this.isFocused.bind(this);
    this.isComponentLoaded = this.isComponentLoaded.bind(this);
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
     this.selectFilter.call(this,name,COMPONENT_NAME.LANGUAGE,COMPONENT_NAME.LANGUAGE_SELECT);
     this.postData.call(this);
    }

    if (gridname === COMPONENT_NAME.RATING) {
            this.selectFilter.call(this,name,COMPONENT_NAME.RATING,COMPONENT_NAME.RATING_SELECT);
            this.postData.call(this);
      }

  }
  /**
    * Description: Select Filter
    * @param {Object}  name
    * @param {String}  component
    * @return {null}
    */
  selectFilter(name,component,selectComponent){
    this.setState((prev) => {
        var oldData =  [...prev[component].data];
        var selectedData = [...prev[component].selected];
        var newData = oldData.map((item)=>{
            if(item.id ===name.id){
                item.status = !item.status;
                if(item.status){
                    if(_.indexOf(selectedData,item) < 0){
                         selectedData.push(item.langKey);
                    }
                }else{
                    selectedData = selectedData.filter((item)=>{
                        return item !==name.langKey
                    })
                }
            }
            return item;
        });
        

        return {
            [component]:{
                data:newData,
                selected:selectedData
            },
            [selectComponent]:{
                data:this.resetSelect.call(this,selectComponent),
                selected:[]
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
        this.props.filterChangeStatus();
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
        let data = JSON.parse(JSON.stringify(prev[componentName].data));
        let value =[];
        value[0] =  prev[selectName].data[0].value;
        value[1] =  prev[selectName].data[1].value;
        
        let selectButton = JSON.parse(JSON.stringify(prev[selectName].data));
        selectButton.value = value;
        let selectedArray = [];
        selectButton =  selectButton.map((item,i)=>{
            if(item.id === name.id){
                item.status = true;               
            }else{
                item.status = false;                    
            }
            item.value = value[i];
            return item;
        });
        data = data.map((item)=>{
            if(SELECT_ID[selectName].SELECT === name.id){
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
            data:selectButton,
            selected:[]
        }
      };
    });
  }

  componentWillMount() {
    let languageData = [] ,selectRating = [],selectlang=[],ratings=[];
    this.filters =  this.props.configUserPreference;
    const filtersRating =this.filters.ratings || [];    
    const filtersLanguage = this.filters.languages || [];
    const selectedPreferenceRating = this.props.getUserPreferences.data.programFilters.ratings;
    const selectedPreferenceLanguage = this.props.getUserPreferences.data.programFilters.languages;

     //filter language
     if (filtersLanguage.length > 0) {
        languageData = filtersLanguage.map((item, i) => {
          return this.init(item, i,COMPONENT_NAME.LANGUAGE,selectedPreferenceLanguage)
        })
      }

    //for filter select options
     selectRating =  this.resetSelect.call(this,COMPONENT_NAME.RATING_SELECT);
     selectlang =   this.resetSelect.call(this,COMPONENT_NAME.LANGUAGE_SELECT);
    //for filter filter
    if (filtersRating.length > 0) {
        ratings = filtersRating.map((item, i) => {
          return this.init(item, i,COMPONENT_NAME.RATING,selectedPreferenceRating)
        })
      };    
   
    this.setState({
      [COMPONENT_NAME.LANGUAGE]: {data:languageData,selected:selectedPreferenceLanguage},
      [COMPONENT_NAME.RATING]:{data:ratings,selected:selectedPreferenceRating},      
      [COMPONENT_NAME.RATING_SELECT]:{data:selectRating,selected:[]},
      [COMPONENT_NAME.LANGUAGE_SELECT]:{data:selectlang,selected:[]}
    })
  }

  init(item, i,component,value=null) {
    let obj = null;
    if(_.isArray(value)){
        if(_.indexOf(value,item) > -1){
            obj = {
                value: item,
                id: component + i,
                status: true,
                langKey:item
              }
        }else{
            obj = {
                value: item,
                id: component + i,
                status: false,
                langKey:item
              }
        }
    }else if (item === value) {
      this.preSelectedLangIndex = i;
      obj = {
        value: item,
        id: component + i,
        status: true,
        langKey:item
      }
    }
    else {
      obj = {
        value: item,
        id: component + i,
        status: false,
        langKey:item
      }
    }
    return obj
  }

componentDidMount() {
    if (!CommonUtility.isEmptyObject(this.props.onRef)) {
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

  resetSelect(componentName){
    let selectJsx =[];  
    if (selection.length > 0) {
        selectJsx = selection.map((item, i) => {
          let translated  = <Trans i18nKey={item}></Trans>;            
          return this.init(translated, i,componentName)
        })
      };
      return selectJsx;
  }

  /**
   * Description: call back on Select filter change
   * @param {String}direction
   * @param {Number}currentRowIndex
   * @param {Number}scrolledRowIndex
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
      default:
      break    
    }
    return;
  }

  /**
   * Description: call back on  filter change
   * @param {String}direction
   * @param {Number}currentRowIndex
   * @param {Number}scrolledRowIndex
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
             if(this.LanguageName.length <=0){
                 return;
             }
              this.ratingData.deFocus();
              this.languageSelect.focus();
              this.setState({
                  activeGrid: 3,
                  currentRowIndex: currentRowIndex,
                  scrolledRowIndex: scrolledRowIndex,
                  direction: direction
              });    
        break;
        default:
        break;
      }
      return;
  }

  /**
   * Description: call back on select language change
   * @param {String}direction
   * @param {Number}currentRowIndex
   * @param {Number}scrolledRowIndex
   * @return {null}
   */
  eventCallbackSelectLanguage(direction, currentRowIndex, scrolledRowIndex){
    switch (direction) {
        case KEY.LEFT:
            this.deFocus();
            this.props.removeSubMenu();
            break;
        case KEY.UP:
            if(this.state[COMPONENT_NAME.RATING].data.length <=0){
                return;
            }
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
        default:
        break;    

    }
    return;
  }

   /**
   * Description: call back on  language change
   * @param {String}direction
   * @param {Number}currentRowIndex
   * @param {Number}scrolledRowIndex
   * @return {null}
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
          default:
          break;
      }
  }

 /**
   * Description: On Focus of Filter
   * @return {null}
   */  
  focus() {
      
      if(this.state[COMPONENT_NAME.RATING].data.length > 0){
        this.ratingSelect.focus();
        this.ratingSelect.resetCurrentFocus(0);  
        this.setState({activeGrid: 1});
      }else{
        this.languageSelect.focus();
        this.languageSelect.resetCurrentFocus(0);    
        this.setState({activeGrid: 3});
      }
      this.isFilterFocused = true;
  }
 /**
   * Description: On Removing Focus of Filter
   * @return {null}
   */
  deFocus() {
    this.isFilterFocused = false;  
    if(this.state[COMPONENT_NAME.RATING].data.length > 0){
        this.ratingSelect.deFocus();
        this.ratingData.deFocus();
    }
    if(this.LanguageName.length > 0){
        this.languageSelect.deFocus();
        this.languageData.deFocus();   
    }

    this.setState({activeGrid: -1});
  }
/**
   * Description: Check Focus from home
   * @return {Boolean}
   */
  isFocused() {
    return this.isFilterFocused;  
  }

  isComponentLoaded(){
      return((!CommonUtility.isEmptyObject(this.ratingSelect)  && this.ratingSelect.isComponentLoaded() && this.ratingData.isComponentLoaded()) || ( !CommonUtility.isEmptyObject(this.languageSelect) && this.languageSelect.isComponentLoaded() && this.languageData.isComponentLoaded()) );
  }

  /**
   * Description: Check Focus from home
   * @return {JSX}
   */
  render() {
    this.LanguageName = JSON.parse(JSON.stringify(this.state[COMPONENT_NAME.LANGUAGE].data)); 
    this.LanguageName.map((item)=>{
                  item.value = CommonUtility.getLanguageName(item.value);
                  return item;
             }); 
    return (
      <div className="sub-menu filter">
        {<div>{this.state.error ? this.state.errorMessage:""}</div>}
        <div className="heading"><h3><Trans i18nKey="filter_screen_title">Filter Available Titles</Trans></h3></div>
        <div className="checkbox-lists">
             <div className="sub-heading"><Trans i18nKey="by_rating">BY RATING</Trans></div>
          {this.state[COMPONENT_NAME.RATING].data.length >0 ? <Hoc>
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
            </Hoc>:<Trans i18nKey="no_rating_available">No rating available</Trans>}  
          <div className="sub-heading"><Trans i18nKey="by_language">BY LANGUAGE</Trans></div>  
          {this.LanguageName.length >0 ? <Hoc>
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
                        data={this.LanguageName}
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
           </Hoc>:<Trans i18nKey="no_language_available">No language available</Trans>}
        </div>
      </div>
    )
  }
}

export default Filter;