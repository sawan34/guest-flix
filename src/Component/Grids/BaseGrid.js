/**
* Summary: BaseGrid Component 
* Description: Top Most Hierarchy class of the Grid , having common functionality
               of Grid.This class recieve Datasource props.
* @author Akash Sharma
* @date  22.06.2018
*/
import React, { PureComponent } from 'react';
import Utility from '../../commonUtilities';
import { commonConstants } from '../../constants/common.constants';
import KeyMap from '../../constants/keymap.constant';
import i18n from 'i18next';
import { Trans } from 'react-i18next';
class BaseGrid extends PureComponent {

    constructor(props) {
        super(props);
        this.dataSource = [];
        this.gridId = this.props.id;
        this.itemWidth = 0;
        this.itemHeight = 0; 
        this.itemPadding = 20;
        this.SCROLL_SPEED = 300; 
        this.isScrollWrap = false;
        this.listedData = [];
        this.start = 0; // new animation
        this.end = 0; // new animation
        this.circulationStart =  false;
        this.totalItems = 0;
        this.isloadNextData = true;
        this.doScroll = true; 
        this.loadingNextData = false;
        this.itemWhenloadData  = 5; 
        this.keyEventDifference = 700;
        this.itemPerpage = 7;
        this.state = {
            activeIndex: 0,
            focusLostItemPosition: -1,
            scrollIndex: 0,
            timeInterval: 0, // new animation
            itemPerPage: 0,
            from: 0,
        }
       this.initData();
       this.keyEvent =  this.keyEvent.bind(this);
        
    }

    /** 
     * initialize values after Constructor calling
     * initial loadData from index 0 to maxVisible item
    */
    initData = () => {
        this.setDataSource();
        let toVisibleIndex = this.getMaxVisibleItem() - 1;
        this.loadData(0, toVisibleIndex);
        if(this.props.currentPage === this.props.totalPage-1){
            this.isloadNextData = false;
            this.isScrollWrapping();
        }
    }

    /**
     * Load Visible data from DataSource to component state(only visible data load in the state)
     * @param {*} fromPos 
     * @param {*} toPos 
     */
    loadData(fromPos, toPos) {
       this.listedData = [];
       for (var i = fromPos , j = 0;  i < (toPos); i++, j++) {
        this.listedData[i] = this.dataSource[i];
       }
    }

     /**
     * Description:Load next data and work for cicular grid
     * @param {String} direction 
     */
    nextIndexDataLoad(direction) {
      if(!this.isloadNextData){
        let scrollPosition = 1; 
        if(this.isScrollWrap){
            scrollPosition = this.circulateListedData(this.dataSource, 1,direction);
            this.state.from = scrollPosition;
        }
      }else{
        let self =  this;  
        // stop scroll when loading next data navigation reach ends  
        if(this.totalItems === (this.state.activeIndex + 1) && this.loadingNextData )  {
            this.doScroll = false;
        } 

        if(!this.loadingNextData && (this.totalItems - this.itemWhenloadData) === (this.state.activeIndex + 1)  ) {
            this.loadingNextData = true;
            if (!Utility.isEmpty(this.props.loadNextData)) {
                self.props.loadNextData(self.gridId, (data) => {
                    self.dataSource = [...self.dataSource, ...data];
                    self.totalItems = this.dataSource.length;
                    self.loadingNextData = false;
                    if(this.props.currentPage === this.props.totalPage-1){
                        this.isloadNextData = false;
                        this.isScrollWrapping();
                    }
                })
            }

        }  
      }  
        
    }

     /**
     * Description:Load next data and work for cicular grid
     * @param {Array} array 
     * @param {Number} times
     * @param {String} direction 
     * @return Number
     */
    circulateListedData = (array, times,direction) => {
        let scrollPosition = 1;
        if(direction === commonConstants.DIRECTION_RIGHT){
            if(!this.circulationStart && this.state.activeIndex===1){
                this.dataSource.push(this.dataSource[0]);
                this.changeCirculationStatus();
            }else{
                if(this.state.from>2){
                    var splicedData = this.dataSource.splice(0, this.state.from - 1);
                    this.dataSource = this.dataSource.concat(splicedData);
                    this.changeCirculationStatus();
                    this.dataSource.push(this.dataSource[0]);

                }else{
                    this.dataSource.shift();
                    this.dataSource.push(this.dataSource[0]);
                    
                }
            }
        }
        if(direction === commonConstants.DIRECTION_LEFT){
            if(this.state.activeIndex ===0){
                this.dataSource.pop();
                scrollPosition = 0;
                this.changeCirculationStatus();
            }else{
                this.dataSource.pop();
                this.dataSource.unshift(this.dataSource[this.dataSource.length -1]);
            }
        }
        this.totalItems = this.dataSource.length;
        return scrollPosition;
    }
    /**
     * Description:Change circular status
     * @return null
     */
    changeCirculationStatus(){
        this.circulationStart =  !this.circulationStart;
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
        if (!Utility.isEmpty(this.props.defaultSelectedPosition)){
            return parseInt(this.props.defaultSelectedPosition, 10);
        }else{
            return 0;
        }
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
     * Passing the event to Child class
     * activeEvent is mandatory either true or false
     * Handle Long press down Event and Short key Press Event
     */
    keyEvent = (event) => {
        if (Utility.isEmpty(event) || !this.doScroll) {
            return;
        }
        if (this.props.activeEvent){
            if(event.timeStamp - this.state.timeInterval > this.keyEventDifference){
                this.handleKeyPress(event);
                this.SCROLL_SPEED = 300;
            }else{
                this.SCROLL_SPEED = 100;
                if(event.keyCode === KeyMap.VK_RIGHT){
                        this.goNext(event);
                }
                if(event.keyCode === KeyMap.VK_LEFT){
                    this.goPrevious(event);
                }
            }
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
       let removedEmptiedData = this.listedData.filter((item)=>{
                 if(item){return true;}
            }) //removing empty array
        return (
            removedEmptiedData.map((item, i) => {
                    if (this.props.activeEvent) {
                        return this.getView(i, this.state.activeIndex, item);
                    } else {
                        return this.getView(i, -1, item);
                    }
            }))
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
        let currentLanguage = i18n.language;
        const itemSize = this.itemWidth;
        const length = this.totalItems;
        const itemPerPage = this.getItemPerPage();
        const { from } = this.state;
        const { end, offsetLeft, start, visibleStartIndex } = this.getSizes(itemSize, itemPerPage, from, length);
        this.start = start;
        this.end = end;
        this.loadData(start, end);
        const style = {
            width: (itemSize * length),
            WebkitTransform: `translate3d(-${offsetLeft}px,0,0)`        
          };

        const movieDetails = this.dataSource[this.state.from];
        return (<div>
                <ul id={this.gridId} className="slider" style={style} ref={node => (this.list = node)} >
                    {this.renderItem()}
                </ul>
                {this.props.activeEvent ?
                    <div>
                        {this.state.activeIndex === 0 ? <div className="arrow left-arrow" style={this.leftArrowStyle()}></div> : ""}
                        <div className="active-details" style={this.activeDetailStyle()}>
                            <div className="left-col">
                                <div className="heading-row">
                                    <h3>{movieDetails.data.langMetadata ? (movieDetails.data.langMetadata[currentLanguage] ? movieDetails.data.langMetadata[currentLanguage].title : movieDetails.data.langMetadata[movieDetails.data.langMetadataDefault].title) : <Trans i18nKey="no_data_message" parent="h3"></Trans>}</h3>
                                    {
                                        movieDetails.rating ?
                                            <span className="btn-style">{movieDetails.rating}</span> : ""
                                    }
                                    <span className="time">{Utility.timeFormat(movieDetails.runTime)}</span> <span className="price">{movieDetails.amount}</span>
                                </div>
                                <p>{movieDetails.data.langMetadata ? (movieDetails.data.langMetadata[currentLanguage] ? movieDetails.data.langMetadata[currentLanguage].shortDescription : movieDetails.data.langMetadata[movieDetails.data.langMetadataDefault].shortDescription) : <Trans i18nKey="no_data_message" parent="p"></Trans>}</p>
                            </div>
                            <div className="key-action-details"><Trans i18nKey="key_action_details" parent="div">Press OK <br />to view and <br />order</Trans></div>
                        </div>
                    </div> : "thuis"
                }
                
            </div>
        );
    }

    /**
     * Description:Used for calculating parameter for navigation
     * @param {Number} itemSize 
     * @param {Number} itemPerPage
     * @param {Number} from
     * @param {Number} length
     * @param {Number} viewportWidth
     * @param {Boolean} back 
     * @return Object
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
     * Description:Used for calculating animation offset
     * @param {Number} itemSize 
     * @param {Number} itemPerPage
     * @param {Number} from
     * @param {Number} length
     * @param {Number} nextPosition
     * @return Number
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
     * Description:Return Item to Show 
     * @return Number
     */ 
    getItemPerPage = () => {
        return this.itemPerpage;
      }

   /**
     * Description:Used for calculating animation offset
     * @param {Number} index 
     * @param {Boolean || String} direction
     * @param {Object} event
     * @return Null
     */ 
    scrollTo = (index,direction=false,event={}) => {
        const length  = this.totalItems;
        const itemPerPage  = this.getItemPerPage()
        if( Utility.isEmptyObject(event) ){
            event.timeStamp = 0;
        }
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
          focusLostItemPosition: prevState.from,
          timeInterval: event.timeStamp
        }
        },() => {
               if(direction){
                 this.focusChange();
                 this.nextIndexDataLoad(direction);
               } 
            }
        );
        this.list.removeEventListener('transitionend', this.lastTransitionendAction)
        this.lastTransitionendAction = null
      }

    /**
     *Description:to be used when scroll get started
     */ 
    startAction(){
       //to be used when scroll get started
    } 
    
    /**
     *Description:to be used when scroll get end
     */ 
    endAction(){
        //to be used when scroll get end
    } 
    
 
   /**
     * Description:Used for calculating animation offset
     * @param {Object} event
     * @return Null
     */ 
    goPrevious = (event) => {
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
        this.list.style.transition = 'all '+this.SCROLL_SPEED+'ms linear';
        this.list.children[from - this.start].classList.remove("active");
        this.list.children[prevValue - this.start].classList.add("active");
        const doSetState = () => {
            this.list.style.transition = 'none';
            this.list.style.WebkitTransform = `translate3d(-${nextStyle.offsetLeft}px,0,0)`;
            this.scrollTo(prevValue, commonConstants.DIRECTION_LEFT,event);
        }

        if (this.lastTransitionendAction) {
            this.list.removeEventListener("transitionend", this.lastTransitionendAction)
        }

        this.list.addEventListener('transitionend', doSetState);
        this.lastTransitionendAction = doSetState
    }

   /**
     * Description:Used for calculating animation offset
     * @param {Object} event
     * @return Null
     */ 
    goNext = (event) => {
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
        this.list.style.WebkitTransform = `translate3d(-${animatingOffset-8}px,0,0)`
        this.list.style.transition = 'all '+this.SCROLL_SPEED+'ms linear';
        this.list.children[from - this.start].classList.remove("active");
        this.list.children[nextStart - this.start].classList.add("active");

        const doSetState = () => {
            this.list.style.transition = 'none'
            this.list.style.WebkitTransform = `translate3d(-${nextStyle.offsetLeft}px,0,0)`
            this.scrollTo(nextStart, commonConstants.DIRECTION_RIGHT,event);
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
        if(this.props.rearrangeData !==0){
            this.dataSource = this.props.rearrangeData.map(item=>{
                return this.dataSource[item];
           });
           this.totalItems = this.dataSource.length;
        }
        if(this.props.isScrollWrap && !this.isloadNextData  && this.props.rearrangeData !==0 ){
            if(!Utility.isEmpty(this.props.keyEvent)){
                    this.setState({activeIndex:this.getScrollIndex()});
                    this.scrollTo(1);
                    this.changeCirculationStatus();
                    this.list.children[1].classList.add("active");
            }
            
        }else{
            this.scrollTo(this.getScrollIndex());
            this.setState({activeIndex:this.getScrollIndex()});
        }
    }
     /**
     * Description: Save scroll sequence for unmount data by calling prop method
     */
    componentWillUnmount(){
        if(this.props.isScrollWrap && !this.isloadNextData ){
            this.props.onUnmount(this.dataSource,this.state.activeIndex,this.props.gridIndex); 
        }
    }
}
const Hoc = (props) => props.children;
export default BaseGrid;