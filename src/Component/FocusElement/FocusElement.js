/**
* Summary: Focus Element Component
* Description: This is Focus Element Component to Creating focus on item
* @author Shashi Kapoor Singh
* @date  24.07.2018
*/
import React from 'react'
import KeyMap from '../../constants/keymap.constant';
import loDash from 'lodash';
import Utility from '../../commonUtilities'

/**
* Description: Defind the Key LEFT, RIGHT, UP, DOWN 
*/
const KEY = {
    "LEFT": "LEFT",
    "RIGHT": "RIGHT",
    "UP": "UP",
    "DOWN": "DOWN"
}
class Grid extends React.Component {
    /**
    * Description: class initialization 
    * @param {props}  object
    * @return {null}
    */
    constructor(props) {
        super(props);
        this.state = {
            selectedRow: this.props.currentRowIndex,
            selectedItemIndex: this.props.activeIndex,
            previousIndexState: 0,
            firsttimeActive: this.props.firsttimeActive
        }
        this.totalItem = 0;
        this.totalRow = this.rowData().length;
        this.onHandleKey = this.onHandleKey.bind(this);
        this.isActiveClass = this.isActiveClass.bind(this);
    }

    /**
    * Description: Handle key on Focus Component 
    * @param {event} object
    * @return {null}
    */
    onHandleKey(event) {
        if (this.props.isKeyEvent) {
            this.onKeyDown(event);
        }
    }

    /**
    * Description: Handle Key Event
    * @param {event} object
    * @return {null}
    */
    onKeyDown(event) {
        try {
            var keyCode = event.keyCode;
            switch (keyCode) {
                case KeyMap.VK_UP:
                    this.keyPosition(KEY.UP);
                    this.focusOnUpKey();
                    break;
                case KeyMap.VK_DOWN:
                    this.keyPosition(KEY.DOWN);
                    this.focusOnDownKey();
                    break;
                case KeyMap.VK_LEFT:
                    this.keyPosition(KEY.LEFT);
                    this.focusOnLeftKey();
                    break;
                case KeyMap.VK_RIGHT:
                    this.keyPosition(KEY.RIGHT);
                    if (this.state.firsttimeActive && this.props.gridNo > 1 && this.props.leftNotMove) {
                        this.setState({ firsttimeActive: false });
                    } else {
                        this.focusOnRightKey();
                    }
                    break;
                case KeyMap.VK_BACK:
                    break;
                case KeyMap.VK_ENTER:
                    this.getActiveDetails();
                    break;
            }
        } catch (e) {
            console.log(e);
        }
    }

    /**
    * Description: Get Active Component Name and Information about Active Component
    * @param {null} 
    * @return {null}
    */
    getActiveDetails() {
        this.props.enterEvent(this.props.gridName, this.rowData()[this.state.selectedRow][this.state.selectedItemIndex], this.state.selectedRow, this.state.selectedItemIndex, this.props.col);
    }

    /**
    * Description: Get the Key Direction on Callback
    * @param {direction} string
    * @return {null}
    */
    keyPosition(direction) {
        switch (direction) {
            case KEY.LEFT:
                if (this.state.selectedItemIndex === 0) {
                    this.setState({ firsttimeActive: true });
                    this.props.eventCallback(KEY.LEFT, this.state.selectedRow)
                }
                break;
            case KEY.RIGHT:
                if (this.state.selectedItemIndex === (this.props.col - 1)) {
                    this.props.eventCallback(KEY.RIGHT, this.state.selectedRow);
                }
                break;
            case KEY.UP:
                if (this.state.selectedRow === 0) {
                    this.props.eventCallback(KEY.UP, this.state.selectedRow)
                }
                break;
            case KEY.DOWN:
                if (this.state.selectedRow === (this.totalRow - 1) || !this.rowData()[this.state.selectedRow + 1][this.state.selectedItemIndex]) {
                    this.props.eventCallback(KEY.DOWN, this.state.selectedRow)
                }
                break;
        }
    }

    /**
    * Description: Remove Event Listener at keydown on componentWillUnmount 
    * @param {null} 
    * @return {null}
    */
    componentWillUnmount() {
        document.removeEventListener("keydown", this.onHandleKey);
    }

    /**
    * Description: Manage Component Row and Column Index
    * @param {prevProps} object
    * @return {null}
    */
    componentDidUpdate(prevProps) {
        if (this.props.isKeyEvent && prevProps.isKeyEvent !== this.props.isKeyEvent) {
            if (!Utility.isEmpty(this.props.defaultItemIndex)) {
                this.setState({
                    selectedItemIndex: this.props.defaultItemIndex
                });
            }

            var currentRowIndex = this.props.currentRowIndex;
            if (this.props.currentRowIndex > (this.totalRow - 1) && (this.props.focusDirection === KEY.LEFT || this.props.focusDirection === KEY.RIGHT)) {
                currentRowIndex = this.totalRow - 1;
            }
            switch (this.props.focusDirection) {
                case KEY.LEFT:
                    this.setState({
                        selectedRow: currentRowIndex,
                        selectedItemIndex: (this.props.col - 1)
                    });
                    break;
                case KEY.RIGHT:
                    this.setState({
                        selectedRow: currentRowIndex,
                        selectedItemIndex: 0
                    });
                    break;
                case KEY.UP:
                    if (Utility.isEmpty(this.rowData()[this.totalRow - 1][this.state.selectedItemIndex]) || Utility.isEmpty(this.rowData()[this.totalRow - 1][this.state.selectedItemIndex])) {
                        this.setState({
                            selectedItemIndex: this.state.selectedItemIndex - 1
                        });
                    }
                    break;
            }
        }
    }

    /**
    * Description: Add Event Listener at Keydown on componentDidMount 
    * @param {null} 
    * @return {null}
    */
    componentDidMount() {
        document.addEventListener("keydown", this.onHandleKey);
        if (this.props.data) {
            this.totalItem = this.props.data.length;
        }
    }

    /**
    * Description: Focus on item by Key Press Right
    * @param {null} 
    * @return {null}
    */
    focusOnRightKey() {
        if (!this.rowData()[this.state.selectedRow][this.state.selectedItemIndex + 1]) {
            return;
        }
        if ((this.state.selectedItemIndex < this.props.col - 1)) {
            this.setState({ selectedItemIndex: this.state.selectedItemIndex + 1 });
        }
    }

    /**
    * Description: Focus on item by Key Press Left
    * @param {null} 
    * @return {null}
    */
    focusOnLeftKey() {
        if (this.state.selectedItemIndex > 0) {
            this.setState({ selectedItemIndex: this.state.selectedItemIndex - 1 });
        }
    }

    /**
    * Description: Focus on item by Key Press UP
    * @param {null} 
    * @return {null}
    */
    focusOnUpKey() {
        if (this.state.selectedRow > 0) {
            this.setState({ selectedRow: this.state.selectedRow - 1 });
        }
    }

    /**
    * Description: Focus on item by Key Press Down
    * @param {null} 
    * @return {null}
    */
    focusOnDownKey() {
        if (!this.rowData()[this.state.selectedRow][this.state.selectedItemIndex]) {
            return;
        }
        if (this.state.selectedRow < this.totalRow - 1) {
            this.setState({ selectedRow: this.state.selectedRow + 1 });
        }
    }

    /**
    * Description: Return Active Class
    * @param {row} number
    * @param {index} number
    * @return {boolean} 
    */
    isActiveClass(row, index) {
        return this.state.selectedItemIndex === index && this.state.selectedRow === row;
    }

    /**
    * Description: Manupulate the Array and return into Column define in Component Column
    * @param {null}
    * @return {array} 
    */
    rowData() {
        return loDash.chunk(this.props.data, this.props.col);
    }

    /**
    * Description: Return Active Class
    * @param {array} array
    * @param {rowindex} number
    * @return {array} 
    */
    renderView(array, rowindex) {
        return array.map((item, colindex) => {
            return this.getView(item, colindex, rowindex, this.props.gridName);
        })
    }

    render() {
        return (
            <div className="data-list">
                {
                    this.rowData().map((array, index) => {
                        return <div className='row' key={index}>
                            {
                                this.renderView(array, index)
                            }
                        </div>
                    })
                }
            </div>
        )
    }
}

export default Grid;