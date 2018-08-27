/**
* Summary: Vertical Grid Component
* Description: This is Vertical Grid with infinite scrolling 
* @author Amit Singh Tomar
* @date  03.08.2018
*/
import { Component } from 'react';
import UTILITY from "../commonUtilities";

// Animation time Constant
const KEY_DELAY_TIME = 150
class TvComponent extends Component {

    constructor(props) {
        super(props);
        this.isFocusEnabled = false;
        this.registerKeyListener = this.registerKeyListener.bind(this);
        this.deregisterKeyListener = this.deregisterKeyListener.bind(this);
        this.focus = this.focus.bind(this);
        this.deFocus = this.deFocus.bind(this);
        this.isFocused = this.isFocused.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.keyPressTime = new Date().getTime();
        this.isComponentLoaded = this.isComponentLoaded.bind(this);
        this.componentLoaded = false;
    }


    /**
    * Description: This method register key Listener
    *  @param {null}   
    * @return {null}
    */
    registerKeyListener() {
        document.addEventListener("keydown", this.onKeyDown);
    }

    /**
    * Description: This method deregister key Listener
    *  @param {null}   
    * @return {null}
    */
    deregisterKeyListener() {
        document.removeEventListener("keydown", this.onKeyDown);
    }

    componentDidMount() {
        if(!UTILITY.isEmptyObject(this.props.onRef)){
            this.props.onRef(this);
        }
     }

    componentWillUnmount() {
       this.deregisterKeyListener();
       this.componentLoaded = false;
    }

    isComponentLoaded (){
        return this.componentLoaded;
    }

    /**
    * Description: This method enable key Listener for the component
    *  @param {null}   
    * @return {null}
    */
    focus() {
        this.isFocusEnabled = true;
        this.registerKeyListener();
    }

    componentWillMount(){
        this.componentLoaded = false;
    }
    

    componentWillUpdate(){
        this.componentLoaded = false;
    }
     /**
    * Description: This method disable key Listener for the component
    *  @param {null}   
    * @return {null}
    */
    deFocus() {
        this.isFocusEnabled = false;
        this.deregisterKeyListener();
    }

    /**
    * Description: This method return weather key handling is enabled or not
    *  @param {null}   
    * @return {boolean}
    */
    isFocused() {
        return this.isFocusEnabled;
    }


    /**
    * Description: key handling method
    * @param {object} event   
    * @return {boolean}
    */
    onKeyDown(event) {
        try {
            if(this.isFocusEnabled){
                if (new Date().getTime() - this.keyPressTime < KEY_DELAY_TIME) {
                    return;
                } else {
                    this.keyPressTime = new Date().getTime();
                }
                this.handleKeyPress(event);
            }
        } catch (e) {
            
        }
    }

    handleKeyPress(event) {

    }

}
export default TvComponent;