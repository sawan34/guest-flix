/**
 * Summary: Audio and Subtitle Language Component
 * Description: Add this component for select the Audio and Subtitle Language
 * @author Akash Kumar Sharma
 * @date  01.08.2018
 */
import React, { Component } from 'react';
import RadioGrid from '../../Component/FocusElement/RadioGrid';
import { Trans } from 'react-i18next';
import { commonConstants } from '../../constants/common.constants'
let _objAudiolang = null;
let _objSubtitle = null;

class LangMenuGridView extends Component {
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
            activeGrid: 1,
            currentRowIndex: 0,
            scrolledRowIndex: 0,
            direction: "",
            firsttimeActive: true,
            subtitle: [{value: "None", id: "none", status: true}],
            audiolang: _objAudiolang,
            errorMessage: ''
        }
        this.ROW_VISIBLE=5;
        this.purchase = { gfOrderId: '', localTxId: '' };
        this.currentActiveGrid = 1;
        this.availableAudio = this.props.audioLangData;
        this.availableSubtitles = this.props.subtitleData;
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
            case commonConstants.DIRECTION_LEFT:
                
                if (this.state.activeGrid === 1) {
                    this.noFocusEvent()
                }
                if (this.state.activeGrid !== 3) {
                    this.setState({
                        activeGrid: 1,
                        currentRowIndex: currentRowIndex,
                        scrolledRowIndex: scrolledRowIndex,
                        direction: direction
                    })

                    this.audioLangGrid.focus();
          this.subtitleGrid.deFocus();
         
                }
                break;

            case commonConstants.DIRECTION_RIGHT:
                if (this.state.activeGrid !== 3) {
                    this.setState({
                        activeGrid: 2,
                        jumpNextGrid: false,
                        currentRowIndex: currentRowIndex,
                        scrolledRowIndex: scrolledRowIndex,
                        direction: direction
                    })

                    this.audioLangGrid.deFocus();
                    this.subtitleGrid.focus();
          
                }
                break;
            case commonConstants.DIRECTION_UP:
                this.noFocusEvent()
                break;

        }
       
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

        let index = rowIndex * col + colIndex;
        let updateArray = [...this.state[gridname]];

        updateArray.map((val, i) => {

            Object.keys(val).map((innerValue) => {
                val.status = false;
                if (i === index) {
                    val.status = true;
                  }
                return val;
            })
        })
        this.setState({ updateArray });
    }
    /**
    * Description: do nothing onchange
    * @param {null}
    * @return {null}
    */
    onChange() {
        return;
    }

    noFocusEvent = () => {
        this.props.onCloseLangMenu()
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

        _objAudiolang = this.availableAudio.map((item, i) => {
            return this.init(item, i)
        })

        _objSubtitle = this.availableSubtitles.map((item, i) => {
            return {
                value: item,
                id: 'subtitle-' + i,
                status: false
              }
        })

        this.setState({
            subtitle: [...this.state.subtitle, ..._objSubtitle],
            audiolang: _objAudiolang
        })
    }

    componentDidMount(){
        this.audioLangGrid.focus();
      }

    render() {
        return (
            <div className="audio-language">
                <div className="row">
                    <div className="lang-col">
                    <h3><Trans i18nKey="audio_language"></Trans>:</h3>
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
                                visibleRow={this.ROW_VISIBLE}
                            />
                        </div>
                    </div>
                    <div className="lang-col">
                    <h3><Trans i18nKey="subtitles"></Trans>:</h3>
                        <div className="col-2  radio-container">

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
                                visibleRow={this.ROW_VISIBLE}
                            />
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}
export default LangMenuGridView;