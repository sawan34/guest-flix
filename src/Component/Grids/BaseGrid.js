/**
* Summary: BaseGrid Component 
* Description: Top Most Hierarchy class of the Grid , having common functionality
               of Grid.This class recieve Datasource props.
* @author Akash Sharma
* @date  22.06.2018
*/
import React, { Component } from 'react';
import Utility from '../../commonUtilities';
import { commonConstants } from '../../constants/common.constants';
import { Trans } from 'react-i18next';
class BaseGrid extends Component {

    constructor(props) {
        super(props);
        this.dataSource = [];
        this.scrollX = 0; //not to used
        this.gridId = this.props.id;
        this.itemWidth = 0;
        this.itemHeight = 0; //not to used
        this.itemPadding = 20;
        this.scrollIndex = 0; //not to used
        this.SCROLL_SPEED = 300; //not to used
        this.scrollDirection=""; //not to used
        this.timeStamp = 0; 
        this.keyStopper = false; //not to used
        this.circulateCount = 0;
        this.isScrollWrap = false;
        this.listedData = [];
        this.c = 1; // new animation
        this.circulationStart =  false;
        this.totalItems = 0;
        this.state = {
            activeIndex: 0,
            focusLostItemPosition: -1,
            scrollIndex: 0,
            transitionSpeed: this.SCROLL_SPEED,
            timeInterval: 0, // new animation
            itemPerPage: 0,
            from: 0,
            cursor: 0,
            viewportWidth: 0
        }
        this.initData();
       // document.addEventListener('keyup', this.keyEventUp);
       this.keyEvent =  this.keyEvent.bind(this);
        
    }

    /** 
     * initialize values after Constructor calling
     * initial loadData from index 0 to maxVisible item
    */
    initData = () => {
        this.setDataSource();
        this.isScrollWrapping();
        let toVisibleIndex = this.getMaxVisibleItem() - 1;
        this.loadData(0, toVisibleIndex);
    }

    /**
     * Load Visible data from DataSource to component state(only visible data load in the state)
     * @param {*} fromPos 
     * @param {*} toPos 
     */
    loadData(fromPos, toPos) {
       this.listedData = [];
       for (var i = fromPos; i < (toPos); i++) {
        this.listedData[i] = this.dataSource[i];
       }
    }

    /**
    * calculate the two indexs from Datasource in forward direction for rendering minimum visible item
    * 1. From Index
    * 2. To Index 
    */
    nextIndexDataLoad(direction) {
        let scrollPosition = 1; 
        if(this.isScrollWrap){
            console.log("before pop",this.dataSource);
            scrollPosition = this.circulateListedData(this.dataSource, 1,direction);
            console.log("activeIndex:",this.state.activeIndex);
            this.scrollTo(scrollPosition);
        }
        // if (this.state.from < (this.dataSource.length)) {

        //     let fromPos = fromVisibleIndex;
        //     let toPos;
        //     if ((fromVisibleIndex + (this.getMaxVisibleItem() - 1)) < (this.dataSource.length - 1)) {
        //         toPos = fromPos + this.getMaxVisibleItem() - 1;
        //     }
        //     else {
        //         toPos = this.dataSource.length - 1;
        //         if (!Utility.isEmpty(this.props.loadNextData)) {
        //             this.props.loadNextData(this.gridId, (data) => {
        //                 this.dataSource = [...this.dataSource, ...data];
        //             })
        //         }
        //     }
        //     if (fromVisibleIndex !== -1) {
        //         this.totalItems = this.dataSource.length;

        //         this.loadData(fromPos, toPos)
        //         this.circulateCount = 0;
        //         if (this.state.activeIndex !== 0) {
        //           //  this.scrollTo(1)
        //         }
        //     }
        // } else if ((fromVisibleIndex + (this.getMaxVisibleItem() - 1)) >= (this.dataSource.length) && this.isScrollWrap) {
        //     if (this.getMaxVisibleItem() >= this.circulateCount) {
        //        // this.circulateListedData(this.listedData, 1);
        //        // this.scrollTo(1)
        //     }

        // }
    }

    circulateListedData = (array, times,direction) => {
        let scrollPosition = 1;
        if(direction === commonConstants.DIRECTION_RIGHT){
            if(!this.circulationStart){
                this.dataSource.push(this.dataSource[0]);
                this.changeCirculationStatus();
            }else{
                this.dataSource.shift();
                this.dataSource.push(this.dataSource[0]);
                
            }
        }
        if(direction === commonConstants.DIRECTION_LEFT){
            if(this.state.activeIndex ===0){
                this.dataSource.pop();
                scrollPosition = 0;
                console.log("idex=0,pop",this.dataSource);
                this.changeCirculationStatus();
            }else{
                this.dataSource.pop();
                console.log("pop",this.dataSource);
                
                this.dataSource.unshift(this.dataSource[this.dataSource.length -1]);
                console.log("unshift",this.dataSource);
                
            }
        }
        this.totalItems = this.dataSource.length;
        return scrollPosition;
        //     console.log("before circular:",array[0].title);
        //     array = array.slice();
        //     while (times--) {
        //         var temp = array.shift();
        //         array.push(temp)
        //     }
        //     this.dataSource = array;
        //     console.log("after circular:",array[0].title)

        //    // this.listedData[this.getMaxVisibleItem() - 1] = this.dataSource[this.circulateCount]
        //     this.circulateCount++;
    }

    changeCirculationStatus(){
        this.circulationStart =  !this.circulationStart;
    }
    /**
     *  not to used
        * calculate the two indexs from Datasource in backward for rendering minimum visible item
        * 1. From Index
        * 2. To Index 
    */
    previousIndexDataLoad(fromVisibleIndex) {
        if (fromVisibleIndex >= 1) {
            let fromPos = fromVisibleIndex - 1;
            let toPos = 0;
            if ((fromPos - 1) + this.getMaxVisibleItem() < this.dataSource.length - 1) {
                toPos = fromPos + (this.getMaxVisibleItem() - 1);
            } else {
                toPos = this.dataSource.length - 1;
            }
            this.loadData(fromPos, toPos)
            this.scrollTo(1);
        }
    }

    /**
    *   calling the Child method give two information , Focus Lost Item and Current focus Item
    * 1.  Focus Lost Item
    * 2.  Current focus Item
    */
    focusChange = () => {
        this.onFocusChange(this.state.focusLostItemPosition, this.state.activeIndex);
    }

    /**
     * function called from BaseGrid if Child class not override
     * @param {*} focusLostPosition 
     * @param {*} currentItemFocus 
     */
    onFocusChange = (focusLostPosition, currentItemFocus) => {
    }

    /**
     *  calling the onItemSelected function of the child overriden 
     *  Selected Item position
     */
    itemSelected = () => {
        this.onItemSelected(this.state.from)
    }

    /**
     * function called from BaseGrid if Child class not override
     * @param {*} position 
     */
    onItemSelected = (position) => {
    }

    /**
     * Return the Default Focus Position from Props if not given then default focus Position will be 0  
     */
    getScrollIndex = () => {
        if (!Utility.isEmpty(this.props.defaultSelectedPosition))
            return parseInt(this.props.defaultSelectedPosition, 10);
        else
            return 0;
    }

    /**
     * Assign the dataSource in BaseGrid property variable from props
     */
    setDataSource() {
        if (!Utility.isEmpty(this.props.dataSource)) {
            this.dataSource = this.props.dataSource;
            this.itemWidth = parseInt(this.dataSource[0].dimension.width, 10)+this.itemPadding;
            this.itemHeight = parseInt(this.dataSource[0].dimension.height, 10);
            this.totalItems = this.props.dataSource.length;
        }
    }

    /**
     *  Return the Maximum Visible item from props
     *  if DataSource length is less than Maximum visible Item ,return the Data source lenth
     */
    getMaxVisibleItem = () => {
        if (!Utility.isEmpty(this.props.maxVisibleItem) && (this.dataSource.length >= this.props.maxVisibleItem))
            return parseInt(this.props.maxVisibleItem, 10);
        else
            return this.dataSource.length;
    }

    isScrollWrapping = () => {
        if (!Utility.isEmpty(this.props.isScrollWrap))
            this.isScrollWrap = this.props.isScrollWrap;
    }

    /**
     * Set the focus position and scrolling value in state when Grid move
     *  @param {*} scrollIndex  passing the focus position
     */
    scrollInit = (scrollIndex) => {
        this.scrollX = 0;
        let activeState = 0;
        for (var i = 0; i < scrollIndex; i++) {
            activeState = activeState + 1;
            this.scrollX = this.scrollX - (this.itemWidth);
        }
        this.setState({ activeIndex: activeState, SCROOL_SPEED: 0 })
    }

    /**
     * not to used
    * Set the initial focus position and scrolling value in state
    *  @param {*} position  passing the focus position
    */
    setScrollPosition = (position) => {
        if (position !== 0) {
            let toPos = 0;
            if ((position - 1) + this.getMaxVisibleItem() < this.dataSource.length - 1) {
                toPos = (position - 1) + this.getMaxVisibleItem();
            }
            else {
                toPos = this.dataSource.length - 1;
            }
            this.scrollX = this.scrollX - (this.itemWidth );
            this.loadData(position - 1, toPos)
            this.setState({ activeIndex: 1, scrollIndex: position })
        }
    }

    /**
     * not to used
     * Key event up
     */
    keyEventUp = (event) => {
        this.keyStopper = false;
        this.SCROLL_SPEED = 300;
    }

    /**
     * Passing the event to Child class
     * activeEvent is mandatory either true or false
     * Handle Long press down Event and Short key Press Event
     */
    keyEvent = (event) => {
        if (Utility.isEmpty(event)) {
            return;
        }
        if (this.props.activeEvent) { 
        if(!this.timeStamp){
            this.timeStamp = parseInt(event.timeStamp,10);
        }
        console.log("Norma key Press",event.timeStamp - this.timeStamp )
        console.log("time stamp", this.timeStamp )
        
        
        if (event.timeStamp - this.timeStamp < 150) {
            console.log("Long key Press",event.timeStamp - this.timeStamp )
            this.timeStamp = event.timeStamp;
            this.SCROLL_SPEED = 100;
        }
         
    }

        // if (this.keyStopper) {
        //     if (event.timeStamp - this.timeStamp > 210) {
        //         this.timeStamp = event.timeStamp;
        //         this.SCROLL_SPEED = 200;
        //         if (this.props.activeEvent) {
        //            // this.handleKeyPress(event);
        //         }
        //     }
        //     return event.keyCode;
        // }
        //this.keyStopper = true;
        if (this.props.activeEvent) {
            this.handleKeyPress(event);
        }
    }

    /**
     * return default Rendering
     */
    getView = (position, activeIndex, dataObject) => {
        return (<h1>Welcome React Grid</h1>)
    }

    /**
     * Listening event from Screen 
     */
    componentDidUpdate(prevProps, prevState) {
        if (prevState.from === this.state.from) {
            this.keyEvent(this.props.keyEvent);
        }
    }

    /**
     * Return the Rendered View Items
     * if the active event true will pass the active Index for focus, otherwise grid will be not focus
     */
    renderItem=()=> {
        return (
            this.listedData.map((item, i) => {
               // if (i < this.getMaxVisibleItem()) {
                    if (this.props.activeEvent) {
                        return this.getView(i, this.state.from, item);
                    } else {
                        return this.getView(i, -1, item);
                    }
               // }
                // else {
                //     return false;
                // }
            }))
    }

    /**
     * not to used
     * handle the transition and focus on next item
     * @returns : none
     */
    onTransitionEnd = () => {
        if (this.scrollDirection === commonConstants.DIRECTION_RIGHT) {
            this.nextIndexDataLoad(this.state.from - 1);
        }
        else if ((this.state.activeIndex <= 1) && (this.scrollDirection === commonConstants.DIRECTION_LEFT)) {
            this.previousIndexDataLoad(this.state.from)
        }
    }

    activeDetailStyle() {
        return { height: "100px", top: (this.itemHeight + 50) + "px", position: "relative" };
    }

    leftArrowStyle() {
        return { top: (this.itemHeight / 2) - 14 + "px" };
    }
    
    /**
     * Life cycle method of component class
     * Render all Item Views in Slider 
     */
    render() {
        
      const itemSize = this.itemWidth ;
       const length = this.totalItems;
       const itemPerPage = this.getItemPerPage();
       const {from} = this.state;
       const { end, offsetLeft, start, visibleStartIndex } = this.getSizes(itemSize,itemPerPage,from,length);
       if(this.props.activeEvent){
    //    console.log("length",length);
    //    console.log("itemSize",itemSize);
    //   console.log("from",from);
    //    console.log("itemPerPage",itemPerPage);
    //    console.log("length - itemPerPage",length - itemPerPage);
    //    console.log("from + itemPerPage", from + itemPerPage);

    //     console.log("start", start);
    //    console.log("end", end);
       }

        this.loadData(start, end) ;
        
        const style = {
            width: (itemSize * length),
            WebkitTransform: `translate3d(-${offsetLeft}px,0,0)`,
            willChange: 'transform'
          };

        const movieDetails = this.dataSource[this.state.from];
        return (
            <Hoc>
                <ul id={this.gridId} className="slider" style={style} ref={node => (this.list = node)} >
                    {this.renderItem()}
                </ul>
                {this.props.activeEvent ?
                    <Hoc>
                        {this.state.from === 0 ? <div className="arrow left-arrow" style={this.leftArrowStyle()}></div> : ""}
                        <div className="active-details" style={this.activeDetailStyle()}>
                            <div className="left-col">
                                <div className="heading-row">
                                    <h3>{movieDetails.title}</h3>
                                    {
                                        movieDetails.rating ?
                                            <span className="btn-style">{movieDetails.rating}</span> : ""
                                    }
                                    <span className="time">{Utility.timeFormat(movieDetails.runTime)}</span> <span className="price">{movieDetails.amount}</span>
                                </div>
                                <p>{movieDetails.description}</p>
                            </div>
                            <div className="key-action-details"><Trans i18nKey="key_action_details">Press OK <br />to view and <br />order</Trans></div>
                        </div>
                    </Hoc> : ""

                }
            </Hoc>
        )
    }

    /**
     * 
     */
    getSizes(itemSize, itemPerPage, from, length, viewportWidth,back=false) {
        const end = Math.min(from + itemPerPage * 2 + 1, length);
        var start = 0,offsetLeft,lastPage = false;
        start = Math.max(from - itemPerPage, 0);
        offsetLeft = (from - start) * itemSize;
        const visibleEndIndex = from ;
        if (itemPerPage >  visibleEndIndex) {
          lastPage = true;
        }
        return {
          visibleStartIndex: from,
          visibleEndIndex: visibleEndIndex,
          end,
          start,
          offsetLeft,
          lastPage:lastPage
        }
      }

    /**
     * 
     */  
    getAnimatingOffset (itemSize,itemPerPage,from,length,nextPosition) {
        const { start, end } = this.getSizes(
          itemSize,
          itemPerPage,
          from,
          length
        )
      
        let offsetIndex = 0
        for (let i = start; i < end; i++) {
          if (nextPosition === i) {
            break
          }
      
          offsetIndex++
        }
      
        return offsetIndex * itemSize
      }
    /**
     * 
     */
    getItemPerPage = () => {
        return 7;
      }

    /**
     * 
     */
    scrollTo = (index,direction=false) => {
        const length  = this.totalItems;
        const itemPerPage  = this.getItemPerPage()
      
        if (index === 0) {
           this.startAction()
        }
    
        if (index === length - itemPerPage) {
            this.endAction()
        }
    
        if (index === this.state.from) return    
        this.setState((prevState)=>{
            let  dataIndex = prevState.activeIndex;
         if(direction ===commonConstants.DIRECTION_LEFT) {
            dataIndex = prevState.activeIndex - 1; 
         }  

         if(direction ===commonConstants.DIRECTION_RIGHT) {
            dataIndex = prevState.activeIndex + 1; 
            //condtion for circular to set 0 when restart
            if(this.isScrollWrap){
                if(prevState.activeIndex >= this.totalItems-2){
                    dataIndex = 0;
                }
            }else{
                if(prevState.activeIndex >= this.totalItems-1){
                    dataIndex = 0;
                }
            }
           
        }  

         return  {
          from: index,
          activeIndex:dataIndex,
          focusLostItemPosition: prevState.from
        }
        },() => {
               this.focusChange();
               // this.nextIndexDataLoad(this.state.from);
               // this.circulateListedData(this.listedData, 1);
                //this.onTransitionEnd();
               if(direction){
                this.nextIndexDataLoad(direction);
               } 
                
            }
        );

        this.list.removeEventListener('transitionend', this.lastTransitionendAction)
        this.lastTransitionendAction = null
      }

    /**
     *
     */ 
    startAction(){
        console.log("start action")
    } 
    
     /**
     *
     */ 
    endAction(){
        console.log("end action")
    } 
    
   /**
    * 
    * 
    */ 
    goPrevious = () => {
        const itemSize = this.itemWidth;
        const length = this.totalItems;
        const itemPerPage = this.getItemPerPage();
        const { from } = this.state;
        if (from <= 0) {
            return;
        }

        const prevValue = Math.max(from - 1, 0)
        const nextStyle = this.getSizes(itemSize, itemPerPage, prevValue, length, true)
        if (!nextStyle.lastPage) {
            this.list.style.WebkitTransform = `translate3d(-${nextStyle.offsetLeft <= 0 ? nextStyle.offsetLeft : nextStyle.offsetLeft - 151}px,0,0)`;
        } else {
            this.list.style.WebkitTransform = `translate3d(-${nextStyle.offsetLeft}px,0,0)`
        }
        this.list.style.transition = 'all 300ms ease-in-out'
        const doSetState = () => {
            this.list.style.transition = 'none';
            this.list.style.WebkitTransform = `translate3d(-${nextStyle.offsetLeft}px,0,0)`;
            this.scrollTo(prevValue, commonConstants.DIRECTION_LEFT);
        }

        if (this.lastTransitionendAction) {
            this.list.removeEventListener("transitionend", this.lastTransitionendAction)
        }

        this.list.addEventListener('transitionend', doSetState);
        this.lastTransitionendAction = doSetState
    }

    /**
     * 
     */
    goNext = () => {
        const itemSize = this.itemWidth;
        const length = this.totalItems;
        const itemPerPage = this.getItemPerPage();
        const { from } = this.state
        if (from + 1 >= length) {
            return;
        }
        const nextStart = Math.max(from + 1, 0);
        const nextStyle = this.getSizes(itemSize, itemPerPage, nextStart, length);
        const animatingOffset = this.getAnimatingOffset(itemSize, itemPerPage, from, length, nextStart);

        this.list.style.WebkitTransform = `translate3d(-${animatingOffset}px,0,0)`
        this.list.style.transition = 'all '+this.SCROLL_SPEED+'ms ease-in-out'
        const doSetState = () => {
            this.list.style.transition = 'none'
            this.list.style.WebkitTransform = `translate3d(-${nextStyle.offsetLeft}px,0,0)`
            this.scrollTo(nextStart, commonConstants.DIRECTION_RIGHT)
        }
        if (this.lastTransitionendAction) {
            this.list.removeEventListener("transitionend", this.lastTransitionendAction)
        }
        this.list.addEventListener('transitionend', doSetState)
        this.lastTransitionendAction = doSetState
      }

    /**
     * Life cycle method of component class
     */
    componentDidMount() {
         this.scrollTo(this.getScrollIndex());
         document.addEventListener('keyup', this.keyEventUp)
    }

    /**
     * Life cycle method of component class
     * unregister the Keyup event
     * not to used
     */
    componentWillUnmount() {
       document.removeEventListener('keyup', this.keyEventUp);
       //document.removeEventListener("keydown", this.keyEvent);
        
    }
}
const Hoc = (props) => props.children;
export default BaseGrid;

