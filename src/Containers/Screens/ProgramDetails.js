/**
* Summary: Program Details Component
* Description: This is Program Details screen created by extending base Screen
* @author Shashi Kapoor Singh
* @date  04.07.2018
*/
import React from 'react';
import BaseScreen,{invokeConnect} from './BaseScreen';
import KeyMap from '../../constants/keymap.constant';
import { translate, Trans } from 'react-i18next';
import { SCREENS } from '../../constants/screens.constant';
import {getProgramDetails} from '../../actions';
require('../css/style.css');

/** 
     * Description:This is constant object to define the Keyname
 */
const KEY =  {"UP": "UP","DOWN":"DOWN"}

class ProgramDetails extends BaseScreen {

    constructor() {
        super();
        this.state = {
            ...this.state,
            screen: SCREENS.programdetails,//This is mandatory for all the screens 
            keyEvent:{},
            active:1
        }
        this.leftButtonLength = 3;
        this.forward =  false;
        
    }
   
 
    /**
     * Description: Handling the key event.
     * @param {event} 
     * @return {null}
     */
    handleKey(event) {
        const keycode = event.keyCode;
        switch(keycode){
            case KeyMap.VK_UP:
            this.focusedItem(KEY.UP);
            break;
            case KeyMap.VK_DOWN:
            this.focusedItem(KEY.DOWN);
            break;
            case KeyMap.VK_BACK:
            this.handleBack();
            break;
            case KeyMap.VK_ENTER:
               this.goToScreen(SCREENS.player, null);
            
            break;

            default:
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
    focusedItem = (_direction) => {
        if(_direction === KEY.UP){
            if(this.state.active > 1){
                this.setState({active:this.state.active-1});
            }
        }
        if(_direction === KEY.DOWN){
            if(this.state.active <  this.leftButtonLength){
                this.setState({active:this.state.active+1});
            }
        }
    }
    
    /**
     * Description: Adding the active class on the button.
     * @param {number} n
     * @return {string}
     */    
    returnActiveclass = (n) => {
        if (this.state.active === n) {
            return "active"
        }
    }

    /** 
     * Description: render html on the page
    */
    render() {        
        if(!Object.keys(this.state.data).length ){            
            return false;
        }

        if( this.state.data.data ===""){
            return false;
        }
        if(this.state.data.type !== 'success'){
            return this.state.data.data;
        }
        const posterSize = {
            width:this.state.data.data.preferredImage.width + 'px',
            height:this.state.data.data.preferredImage.height + 'px'
        }
        
        return (
           
            <div className="container">
                <div className="home-top-poster-details">
                    <img src={this.state.data.data.preferredImage.uri} />
                </div>
                <div className="product-details-wrapper">
                    <div className="left-col">
                        <div className="poster" style={posterSize}>
                            <img src={this.state.data.data.preferredImage.uri} style={posterSize} />
                        </div>
                        <div id="left-button">
                            <button className={this.returnActiveclass(1)}><span><Trans i18nKey="purchase">Purchase</Trans><br /> ${this.state.data.data.price}</span></button>
                            <button className={this.returnActiveclass(2)}><span><Trans i18nKey="related_titles">Related <br />Titles</Trans></span></button>
                            <button className={this.returnActiveclass(3)}><span><Trans i18nKey="go_back">Go Back</Trans></span></button>
                        </div>
                    </div>
                    <div className="right-col">
                        <div className="content-list">
                            <h3>{this.state.data.data.title}</h3>
                            <div className="heading-row"><span className="btn-style">PG</span> <span className="text">{this.state.data.data.releaseYear}</span> <span className="text">2h 31m</span> <span className="btn-style btn-small">CC</span> <span className="btn-style btn-small"><i className="fa fa-globe"></i></span></div>
                            <div className="descriptions">
                                <p>{this.state.data.data.longDescription}</p>
                            </div>
                            <div className="director-actors">
                                <div className="list">
                                    <h4><Trans i18nKey="director">Director</Trans>:</h4>
                                    <ul className="director">
                                        {this.state.data.data.directors && this.state.data.data.directors.map((directors, index) => {
                                            return <li key={index}>{directors}</li>
                                        })}
                                    </ul>
                                </div>
                                <div className="list">
                                    <h4><Trans i18nKey="actors">Actors</Trans>:</h4>
                                    <ul className="list actors">
                                        {this.state.data.data.cast && this.state.data.data.cast.map((cast, index) => {
                                            return <li key={cast.nameId + index}>{cast.name}</li>
                                        })}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }   
}   


export default invokeConnect(ProgramDetails,getProgramDetails,"getProgramDetails");