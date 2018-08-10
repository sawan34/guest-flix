/**
* Summary: Purchase Component
* Description: This is Purchase Popup screen
* @author Shashi Kapoor Singh
* @date  18.07.2018
*/
import React from 'react';
import commonUtility from '../../commonUtilities';
import { Trans } from 'react-i18next';
import BaseOverlay from '../../Component/Overlay/BaseOevrlay';
import RadioGrid from '../../Component/FocusElement/RadioGrid';
import ButtonGrid from '../../Component/FocusElement/ButtonGrid';
import roomUser from '../../services/service.roomUser';
import { SCREENS } from '../../constants/screens.constant';
import { alertConstants } from '../../constants/alert.constant';


let _objAudiolang = null;
let _objSubtitle = null;
const PREVGRID = { AUDIOGRID: 1, SUBTITLEGRID: 2 }
/**
* Description: Defind Button Name
*/
const button = [{ id: "confirm", label: 'confirm' }, { id: "cancel", label: 'cancel' }];

/**
* Description: Define constant for the Key LEFT, RIGHT, UP, DOWN
*/
const KEY = {
  "LEFT": "LEFT",
  "RIGHT": "RIGHT",
  "UP": "UP",
  "DOWN": "DOWN"
}

/**
* Description: Define constant Button List Object
*/
const BUTTON_LIST = {
  "CONFIRM": "confirm",
  "CANCEL": "cancel"
}

/**
* Description: Define constant Component Name
*/
const COMPONENT_NAME = {
  "AUDIOLANG": "audiolang",
  "SUBTITLE": "subtitle",
  "BUTTON": "button"
}

/**
* Description: Define constant to visible Component Row
*/
const ROW_VISIBLE = {
  "RADIO_BUTTON": 5,
  "BUTTON": 1
}

class PurchaseScreen extends React.Component {

  /**
  * Description: class initialization
  * @param {props}  object
  * @return {null}
  */
  constructor(props) {
    super(props)
    this.state = {
      active: 1,
      prevGrid: 1,
      activeGrid: 3,
      currentRowIndex: 0,
      scrolledRowIndex: 0,
      direction: "",
      firsttimeActive: true,
      subtitle: [{ value: "None", id: "none", status: true }],
      audiolang: _objAudiolang,
      errorMessage: ''
    }
    this.purchase = { gfOrderId: '', localTxId: '' };
    this.currentActiveGrid = 1;
    this.eventCallbackFunction = this.eventCallbackFunction.bind(this);
    this.enterEvent = this.enterEvent.bind(this);
  }

  /**
  * Description: Receive Key Positon on Callback
  * @param {direction}  string
  * @return {null}
  */
  eventCallbackFunction(direction, currentRowIndex, scrolledRowIndex) {
    switch (direction) {
      case KEY.LEFT:
        if (this.state.activeGrid !== 3) {
          this.setState({
            activeGrid: 1,
            currentRowIndex: currentRowIndex,
            scrolledRowIndex: scrolledRowIndex,
            direction: direction
          });
          this.audioLangGrid.focus();
          this.subtitleGrid.deFocus();
          this.buttonGrid.deFocus();
        }
        break;

      case KEY.RIGHT:
        if (this.state.activeGrid !== 3) {
          this.setState({
            activeGrid: 2,
            jumpNextGrid: true,
            currentRowIndex: currentRowIndex,
            scrolledRowIndex: scrolledRowIndex,
            direction: direction
          });

          this.audioLangGrid.deFocus();
          this.subtitleGrid.focus();
          this.buttonGrid.deFocus();

        }
        break;

      case KEY.UP:
        if (this.audioLangGrid.isFocused() || this.subtitleGrid.isFocused()) {
          return false;
        }
        this.setState({
          activeGrid: this.state.prevGrid,
          currentRowIndex: currentRowIndex,
          scrolledRowIndex: scrolledRowIndex,
          direction: direction
        })
        switch (this.state.prevGrid) {
          case PREVGRID.AUDIOGRID:
            this.audioLangGrid.focus();
            this.subtitleGrid.deFocus();
            this.buttonGrid.deFocus();
            break;
          case PREVGRID.SUBTITLEGRID:
            this.subtitleGrid.focus();
            this.audioLangGrid.deFocus();
            this.buttonGrid.deFocus();
            break;
        }
        break;

      case KEY.DOWN:
        if (!this.buttonGrid.isFocused()) {
          this.currentActiveGrid = this.state.activeGrid;
        }
        this.setState({
          defaultItemIndex: 0,
          active: 0,
          prevGrid: this.currentActiveGrid,
          activeGrid: 3,
          currentRowIndex: currentRowIndex,
          scrolledRowIndex: scrolledRowIndex,
          direction: direction
        });
            this.subtitleGrid.deFocus();
            this.audioLangGrid.deFocus();
            this.buttonGrid.focus();
        break;
    }
  }

  /**
  * Description: Receive Key Positon on Callback
  * @param {prevProps}  object
  * @param {prevState}  object
  * @return {null}
  */
  componentDidUpdate(prevProps, prevState) {
    if (this.props.reducerPurchaseStart && this.props.reducerPurchaseStart.data && this.props.reducerPurchaseStart.type === alertConstants.SUCCESS && this.props.reducerPurchaseStart.data.gfOrderId) {
      const room = roomUser.getRoomUserInfoFromStorage().room;
      const stayId = roomUser.getStayId();
      const gfOrderId = this.props.reducerPurchaseStart.data.gfOrderId;
      this.purchase.gfOrderId = gfOrderId;
      this.props.pmsPurchaseAction(room, stayId, gfOrderId);
    }
    else if (this.props.reducerPurchaseStart && this.props.reducerPurchaseStart.data && this.props.reducerPurchaseStart.type === alertConstants.SUCCESS && this.props.reducerPurchaseStart.data.localTxId) {
      const gfOrderId = this.purchase.gfOrderId;
      const localTxId = this.props.reducerPurchaseStart.data.localTxId;
      this.props.purchaseCompleteAction(gfOrderId, localTxId);
    }
    else if (this.props.reducerPurchaseStart && this.props.reducerPurchaseStart.data && this.props.reducerPurchaseStart.type === alertConstants.SUCCESS && this.props.reducerPurchaseStart.data.exp) {
      this.props.closePopup();
      this.props.goToScreen(SCREENS.player + "/" + this.props.data.id, null);
    }
    else {

    }
  }

  componentDidMount(){
    this.buttonGrid.focus();
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

    if (name.id === BUTTON_LIST.CONFIRM) {
      const stayId = roomUser.getStayId();
      const programId = this.props.data.id;
      this.props.purchaseStartAction(programId, stayId);
    }

    if (name.id === BUTTON_LIST.CANCEL) {
      this.clearMessage();
      this.props.closePopup();
    }
  }

  /**
  * Description: clear the message
  * @param {null}
  * @return {null}
  */
  clearMessage = () => {
    this.props.reducerPurchaseStart.error = "";
  }

  /**
  * Description: do nothing onchange
  * @param {null}
  * @return {null}
  */
  onChange() {
    return;
  }

  init(item, i) {
    let obj = null;
    if (i === 0) {
      obj = {
        value: item,
        id: 'audiolang-' + i,
        status: true
      }
    }
    else {
      obj = {
        value: item,
        id: 'audiolang-' + i,
        status: false
      }
    }
    return obj
  }
  /**
  * Description: Convert Audio Language and Subtitle Array into Object and Set into State
  * @param {null}
  * @return {null}
  */
  componentWillMount() {
    if (this.props.data) {
      _objAudiolang = this.props.data.availableAudio.map((item, i) => {
        return this.init(item, i)
      })

      _objSubtitle = this.props.data.availableSubtitles.map((item, i) => {
        return {
          value: item,
          id: 'subtitle-' + i,
          status: false
        }
      })
    }
    this.setState({
      subtitle: [...this.state.subtitle, ..._objSubtitle],
      audiolang: _objAudiolang
    })
  }

  render() {
    console.log(this.props.data);
    return (
      <BaseOverlay myClass={'confirmation-popup'} keyhandler={this.keyHandler} closePopup={this.props.closePopup}>
        <h3>{this.props.data.title}</h3>
        <div className="col-container">
          <div className="col-left">
            <div className="poster"><img src={this.props.data.preferredImage.uri} onError={commonUtility.onImageErrorHandler} /></div>
            <div className="price">${this.props.data.price} {this.props.data.isTaxIncluded ? <span>+ <Trans i18nKey="tax">Tax</Trans></span> : null}</div>
          </div>
          <div className="col-right">
            <div className="content">
              <p><Trans i18nKey="purchase_confirm_description">Tax</Trans></p>
            </div>
            <div className="row">
              <div className="lang-col">
                <h3><Trans i18nKey="audio_language">AUDIO LANGUAGE</Trans>:</h3>
                <div className="col-2 radio-container">
                  <RadioGrid
                    onRef={instance => (this.audioLangGrid = instance)}
                    data={this.state.audiolang}
                    enterEvent={this.enterEvent}
                    gridNo={1}
                    gridName={'audiolang'}
                    col={2}
                    leftNotMove={false}
                    isKeyEvent={this.state.activeGrid === 1}
                    firsttimeActive={this.state.firsttimeActive}
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
              <div className="lang-col">
                <h3><Trans i18nKey="subtitles">SUBTITLES</Trans>:</h3>
                <div className="col-2 radio-container">
                  <RadioGrid
                    onRef={instance => (this.subtitleGrid = instance)}
                    data={this.state.subtitle}
                    enterEvent={this.enterEvent}
                    gridNo={2}
                    gridName={'subtitle'}
                    col={2}
                    leftNotMove={true}
                    isKeyEvent={this.state.activeGrid === 2}
                    firsttimeActive={this.state.firsttimeActive}
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
            <div className="menu-button-row purchase-button">
              <div className="confirmation-error-message">{this.props.reducerPurchaseStart && this.props.reducerPurchaseStart.error}</div>
              <ButtonGrid
                onRef={instance => (this.buttonGrid = instance)}
                data={button}
                gridNo={3}
                enterEvent={this.enterEvent}
                gridName={'button'} col={2}
                leftNotMove={false}
                isKeyEvent={this.state.activeGrid === 3}
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
        </div>
      </BaseOverlay>
    )
  }
}

export default PurchaseScreen;