/**
* Summary: Menu Language Component
* Description: This is Component form menu language
* @author Sawan Kumar
* @date  31.07.2018
*/
import React,{ Component }  from 'react';
import RadioGrid from '../../FocusElement/RadioGrid';
const language = [
    "en",
    "fr",
    "ar",
    "ru",
    "zh",
    "en",
    "fr",
    "ar",
    "ru",
    "zh",
    "en",
    "fr",
    "ar",
    "ru",
    "zh"
  ];
  /**
* Description: Define constant to visible Component Row
*/
const ROW_VISIBLE = {
    "CHECKBOX_BUTTON": 10
}
let languageData = [];
const COMPONENT_NAME = {
    "LANGUAGE": "language",
    "BUTTON": "button"
}
class MenuLanguage extends Component {
    constructor(props){
        super(props);
        this.state={
            language:language,
            currentRowIndex:0,
            scrolledRowIndex:0,
            direction:"",
        }
        this.enterEvent = this.enterEvent.bind(this);
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
  }
    componentWillMount() {
        if (this.state.language) {
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
        if (i === 0) {
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
  onChange() {
    return;
  }
    render(){
        console.log(this.state.language);
        return(
            <div className="sub-menu language">
			<div className="heading"><h3>Choose Your Language</h3></div>
			<div className="checkbox-lists">
				<div className="col-2">
					 <RadioGrid
                    data={this.state.language}
                    enterEvent={this.enterEvent}
                    gridNo={1}
                    gridName={'language'}
                    col={2}
                    leftNotMove={false}
                    isKeyEvent={true}
                    firsttimeActive={true}
                    eventCallback={this.eventCallbackFunction}
                    onChange={this.onChange}
                    activeIndex={0}
                    currentRowIndex={this.state.currentRowIndex}
                    scrolledRowIndex={this.state.scrolledRowIndex}
                    focusDirection = {this.state.direction}
                    visibleRow={ROW_VISIBLE.CHECKBOX_BUTTON}
                  />
					
				</div>				
			</div>
			<div className="menu-button-row">
				<a href="#" className="go-back"><i className="fa fa-caret-left" aria-hidden="true"></i> Go Back</a>
			</div>
		</div>
        )
    }
}

export default MenuLanguage;