/**
* Summary: Home Screen Component
* Description: This is home screen created by extending base Screen
* @author Amit Singh Tomar
* @date  8.08.2018
*/

//external Libraries 
import React from 'react';
import BaseScreen, { invokeConnect } from './BaseScreen';
import { SCREENS } from '../../constants/screens.constant';
import KeyMap from '../../constants/keymap.constant';
import PropTypes from 'prop-types';
import { Trans } from 'react-i18next';
import VerticalGrid from '../../Component/Grids/VerticalGrid';
import API_INTERFACE from '../../constants/uri.constant';
import Utility from '../../commonUtilities';
import Method from '../../services/services';
import { responseActions } from '../../actions/action.response';


class RelatedTitle extends BaseScreen {
    constructor() {
        super();
        this.state = {
            ...this.state,
            screen: SCREENS.relatedtitle,//This is mandatory for all the screens 

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
            wrapperHeight: 864,
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

        if (window.innerWidth <= 1280) {
            this.gridProps.wrapperHeight = (this.gridProps.wrapperHeight * .66);
            this.gridProps.paddingBottom = (this.gridProps.paddingBottom * .66);
            this.gridProps.coloumns = 4;
        }
    }


    /**
    * Description: Handling the key event.
    * @param {event} 
    * @return {null}
    */
    handleKey(event) {
        const keycode = event.keyCode;
        switch (keycode) {
            case KeyMap.VK_BACK:
                this.handleBack();
                break;
            default:
        }
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
            <img style={styles} src={props.image_url} onError={Utility.onImageErrorHandler} alt =""></img>
        );
    }


    /**
     * Description: this is callback method which invoke when grid item is selected
     * @param {integer} index
     * @return {null}
     */
    gridItemSelected(index) {
        this.goToScreen(SCREENS.programdetails + "/" + this.selectableData[index].id, null);
    }

    //============================Start-----Selectable Screen data fetch phase===================// 
    /**
     * Description: prepare data for grid and pass to grid property 
     * @param {null} 
     * @return {null}
     */
    componentDidMount(prevProps, prevstate) {
        this.getRelatedItem();
        if (!Utility.isEmptyObject(this.verticalGrid)) {
            this.verticalGrid.focus();
        }
    }

    componentDidUpdate() {
        if (!Utility.isEmptyObject(this.verticalGrid) && !this.verticalGrid.isFocused()) {
            this.verticalGrid.focus();
        }
    }


    /**
     * Description: this method fetch selectable data e.g image and id 
     * @param {Array} selectableIdArray
     * @return {null}
     */
    getRelatedItem = () => {
        this.state.items = [];
        this.gridProps.entries = [];
        var selectableWrapper = document.getElementsByClassName("selectable-related-title");
        var selectableWrapperWidth = selectableWrapper[0].clientWidth;
        var selectableWrapperPadding = window.getComputedStyle(selectableWrapper[0], null).getPropertyValue('padding-left');
        selectableWrapperPadding = selectableWrapperPadding.substring(0, selectableWrapperPadding.length - 2);
        selectableWrapperWidth = selectableWrapperWidth - (selectableWrapperPadding * 2);

        var encodeTitle = encodeURI(this.props.routerData.match.params.id);

        var queryString = '?q=' + encodeTitle;

        return Method.get(API_INTERFACE.SEARCH_PROGRAMS + queryString, "").then(
            req_response => {
                let getResponse = responseActions.response(req_response);
                if (getResponse) {
                    if (this.state && this.state.items) {
                        for (var relatedItemNo = 0; relatedItemNo < getResponse.message.data.length; relatedItemNo++) {
                            this.selectableData.push(getResponse.message.data[relatedItemNo]);
                            var itemObj = {
                                image_url: getResponse.message.data[relatedItemNo].preferredImage.uri,
                                width: parseInt(getResponse.message.data[relatedItemNo].preferredImage.width,10) || 200,
                                height: parseInt(getResponse.message.data[relatedItemNo].preferredImage.height,10) || 300
                            };
                            this.state.items.push(this.selectableItem(itemObj));
                            this.gridProps.itemHeight = parseInt(getResponse.message.data[relatedItemNo].preferredImage.height,10) || 300;
                            this.gridProps.itemWidth = parseInt(getResponse.message.data[relatedItemNo].preferredImage.width,10) || 200;
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

                if(this.gridProps.entries.length === 0){
                    this.setState({ isLoading: false , noData: true });
                }

            },
            error => {
                return responseActions.errorResponse(error);
            }
        ).catch(function (error) {

        });
    }


    /**
      * Description: This method JSX of vetical grid
      * @param {JSX}
    */

    renderGrid = () => {
        if (this.gridProps.entries.length > 0) {
            return <VerticalGrid onRef={instance => (this.verticalGrid = instance)} data={this.gridProps} />;
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

        return (
            <div className='related-title-wrapper'>
                <div className='slide-container-wrapper selectable-related-title'>
                    <div className="title-related-top">
                        <h3><Trans i18nKey="related_title_screen_title">abc</Trans> {this.props.routerData.match.params.id}</h3>
                    </div>
                    <this.renderGrid />
                </div>
            </div>
        )
    }
};
export default invokeConnect(RelatedTitle, null, "");