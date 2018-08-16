/**
* Summary: Program Details Component
* Description: This is Program Details screen created by extending base Screen
* @author Shashi Kapoor Singh
* @date  04.07.2018
*/
import React from 'react';
import BaseScreen,{invokeConnect} from './BaseScreen';
import KeyMap from '../../constants/keymap.constant';
import { Trans } from 'react-i18next';
import { SCREENS } from '../../constants/screens.constant';
import {getProgramDetails} from '../../actions';
import purchaseStartCompleteAction from '../../actions/action.purchaseStart';
import PurchaseScreen from './PurchaseScreen';
import { alertConstants } from '../../constants/alert.constant';
import Utilities from '../../commonUtilities';

/** 
    * Description:This is constant object to define the Keyname
 */
const KEY =  {"UP": "UP","DOWN":"DOWN"};
const OPEN_SCREEN = {"PURCHASE":"purchase","RELATED_TITLE":"relatedTitles","RESUME":"resume"};
const MAX_ACTOR_LENGTH = 6;
const MAX_DIRECTOR_LENGTH = 3;
const CAST_NAME = {"Actor":"Actor"}

class ProgramDetails extends BaseScreen {

    constructor() {
        super();
        this.state = {
            ...this.state,
            screen: SCREENS.programdetails,//This is mandatory for all the screens 
            keyEvent:{},
            active:1,
            overlay:false,
        }
        this.buttonList = [];
        this.forward =  false;
        this.openScreen = this.openScreen.bind(this);
        this.closePopup = this.closePopup.bind(this);
    }
   
 
    /**
     * Description: Handling the key event.
     * @param {event} 
     * @return {null}
     */
    handleKey(event) {
        const keycode = event.keyCode;
        if(!this.state.overlay){
            switch(keycode){
                case KeyMap.VK_UP:
                this.focusChange(KEY.UP);
                break;
                case KeyMap.VK_DOWN:
                this.focusChange(KEY.DOWN);
                break;
                case KeyMap.VK_BACK:
                this.handleBack();
                break;
                case KeyMap.VK_ENTER:
                    this.openScreen();
                break;

                default:
            }
        }
    }

    /**
     * This function will send to the new screen or popup
     */
    openScreen() {
        if(this.buttonList[this.state.active-1].id === OPEN_SCREEN.PURCHASE){
            this.setState({overlay:true});
        }else  if(this.buttonList[this.state.active-1].id === OPEN_SCREEN.RELATED_TITLE){
               this.goToScreen(SCREENS.relatedtitle+"/"+this.state.data.data.title, null);
            return;
        }else if(this.buttonList[this.state.active-1].id === OPEN_SCREEN.RESUME){
            this.goToScreen(SCREENS.player+"/"+this.state.data.data.id, null);
        }
    }
    
     /**
     * This function will be call if screen is loaded fresh not on back , overrrding base method
     */
    onScreenLoad= () => {
        this.props.fetchNetworkData.call(null, this.props.routerData.match.params.id);
    }
    
    /**
     * Description: Make the button active.
     * @param {string} _direction
     * @return {null}
     */    
    focusChange(_direction) {
        if(_direction === KEY.UP){
            if(this.state.active > 1){
                this.setState({active:this.state.active-1});
            }
        }
        if(_direction === KEY.DOWN){
            if(this.state.active <  this.buttonList.length){
                this.setState({active:this.state.active+1});
            }
        }
    }
    
    /**
     * Description: Adding the active class on the button.
     * @param {number} n
     * @return {string}
     */    
    getActiveClass(n) {
        if (this.state.active === n) {
            return "active"
        }
    }
    closePopup(){
        this.setState({overlay:false});
    }

    /**
     * Description: Set Button Length and active position on componentDidUpdate.
     * @param {}
     * @return {}
     */
    componentDidUpdate(){
        if(document.getElementById('left-button')){
            this.buttonList = document.getElementById('left-button').childNodes;
        }  
    }

    /**
     * Description: Set Button Length and active position on componentDidMount.
     * @param {}
     * @return {}
     */
    componentDidMount(){
        if(document.getElementById('left-button')){
            this.buttonList = document.getElementById('left-button').childNodes;
        }
    }
    /**
     * Description: Return max 6 actor name
     * @param {cast,index}
     * @return {html list}
     */
     actorList(actorData) {
        if(actorData){
            return  actorData.filter((Obj,index)=>{
                if(Obj.role===CAST_NAME.Actor)
                return true
            }).map((cast, index)=>{
                if(index <= (MAX_ACTOR_LENGTH-1)){
                    return <li key={cast.nameId + index}>{cast.name}</li>
                }
            })
        }
     }

     /**
     * Description: Return max 3 director name
     * @param {directors,index}
     * @return {html list}
     */
    directorList(directors,index) {
        if(index <= (MAX_DIRECTOR_LENGTH-1)){
           return <li key={directors+index}>{directors}</li>
        }
     }

     /**
     * Description: Get Hour and Minute
     * @param {time}string
     * @return {string}
     */
    timeFormat(time){
        const HR = time[2] + time[3];
        const MIN = time[5] + time[6] ;
        return (HR*1) + 'h ' + (MIN*1) + 'm';
    }

    /**
     * Description: If image source not available or url is not working
     * @param {e}object
     * @return {none}
     */
    onErrorHandler(e){
        e.target.src = '';
        e.target.style.display='none';
    }

    /** 
     * Description: render html on the page
    */
    render() {
        if(Utilities.isEmptyObject(this.state.data)){
            return false;
        }
        if( Utilities.isEmpty(this.state.data.data)){
            return false;
        }
        if(this.state.data.type !== alertConstants.SUCCESS){
            return this.state.data.data;
        }
        return (
            <div className="container">
                {
                    this.state.overlay ?
                    <div ref="overlay">
                        <PurchaseScreen data={this.state.data.data} closePopup={this.closePopup} purchaseStartAction={this.props.purchaseStartAction} pmsPurchaseAction={this.props.pmsPurchaseAction} purchaseCompleteAction={this.props.purchaseCompleteAction} reducerPurchaseStart = {this.props.reducerPurchaseStart}  programId = {this.state.data.data.id} goToScreen = {this.goToScreen} />
                    </div>:""
                }
                <div className={this.state.overlay ? "bluureffects-overlay" : null}>
                <div className="home-top-poster-details">
                    <img src={this.state.data.data.preferredImage.uri} onError={Utilities.onImageErrorHandler} />
                </div>
                <div className="product-details-wrapper">
                    <div className="left-col">
                        <div className="poster">
                            <img src={this.state.data.data.preferredImage.uri} onError={Utilities.onImageErrorHandler} />
                        </div>
                        <div id="left-button">
                            {!this.state.data.data.isPurchased ? <button id="purchase" className={this.getActiveClass(1)} ><span><Trans i18nKey="purchase">Purchase</Trans><br /> ${this.state.data.data.price}</span></button>:null}

                            {this.state.data.data.isPurchased ? <button id="resume" className={this.getActiveClass(1)} ><span><Trans i18nKey="resume">Resume</Trans></span></button>:null}

                            <button id="relatedTitles" className={this.getActiveClass(2)} ><span><Trans i18nKey="related_titles">Related <br />Titles</Trans></span></button>
                        </div>
                    </div>
                    <div className="right-col">
                        <div className="content-list">
                            <h3>{this.state.data.data.title}</h3>
                            <div className="heading-row">
                            {
                                !Utilities.isEmpty(this.state.data.data.rating) ? <span className="btn-style">{this.state.data.data.rating}</span> : null
                            }
                            <span className="text">{this.state.data.data.releaseYear}</span> <span className="text">{this.timeFormat(this.state.data.data.runTime)}</span></div>
                            <div className="descriptions">
                                <p>{this.state.data.data.longDescription}</p>
                            </div>
                            <div className="director-actors">
                                <div className="list">
                                    <h4><Trans i18nKey="director">Director</Trans>:</h4>
                                    <ul className="director">
                                        {this.state.data.data.directors ? this.state.data.data.directors.map((directors, index) => {
                                            return this.directorList(directors,index)
                                        }):""}
                                    </ul>
                                </div>
                                <div className="list">
                                    <h4><Trans i18nKey="actors">Actors</Trans>:</h4>
                                    <ul className="list actors">
                                        {this.actorList(this.state.data.data.cast)}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        );
    }   
}   


export default invokeConnect(ProgramDetails,getProgramDetails,"getProgramDetails",{
    purchaseStartAction:purchaseStartCompleteAction.purchaseStartAction,
    pmsPurchaseAction : purchaseStartCompleteAction.pmsPurchaseAction,
    purchaseCompleteAction:purchaseStartCompleteAction.purchaseCompleteAction
},{
   reducerPurchaseStart:'reducerPurchaseStart'
});