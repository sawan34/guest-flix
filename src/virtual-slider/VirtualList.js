import React, { PureComponent } from 'react'
import { findDOMNode } from 'react-dom'
import { getSizes, getItemPerPage, getAnimatingOffset } from './utils'

class VirtualList extends PureComponent {
  constructor() {
    super()
    this.state = {
      itemPerPage: 0,
      from: 0,
      cursor: 0,
      viewportWidth: 0
    }
    this.c = 1;
  }

  
  scrollTo = index => {
    const { startAction, endAction, length}  = this.props
    const { itemPerPage } = this.state

    if (index === 0) {
      startAction && startAction()
    }

    if (index === length - itemPerPage) {
      endAction && endAction()
    }

    if (index === this.state.from) return

    console.log(index);

    this.setState({
      from: index
    })
    this.list.removeEventListener('transitionend', this.lastTransitionendAction)
    this.lastTransitionendAction = null
  }

  componentDidMount() {
    this.container = findDOMNode(this)
    this.calculateItemPerPage(this.props, this.container)

    // window.addEventListener(
    //   'resize',
    //   this.calculateItemPerPage.bind(null, this.props, this.container)
    // )
  }

  componentWillUnmount() {
    // window.removeEventListener(
    //   'resize',
    //   this.calculateItemPerPage.bind(null, this.props, this.container)
    // )
  }

  calculateItemPerPage = (props, container) => {
    const { itemSize } = props
    const viewportWidth = container.offsetWidth
    const itemPerPage = getItemPerPage(viewportWidth, itemSize)

    this.setState({
      itemPerPage,
      viewportWidth
    })
  }

  goBack = () => {
    const { length, itemSize } = this.props
    const { itemPerPage, from, viewportWidth } = this.state;
    if(from <=0){
      return;
    }
    
    const prevValue = Math.max(from - 1, 0)
    //Math.max(from - itemPerPage, 0)
    const nextStyle = getSizes(itemSize, itemPerPage, prevValue, length, viewportWidth,true)
    if(!nextStyle.lastPage){
       this.list.style.WebkitTransform = `translate3d(-${ nextStyle.offsetLeft <=0  ? nextStyle.offsetLeft: nextStyle.offsetLeft - 151}px,0,0)`;
    }else{
       this.list.style.WebkitTransform = `translate3d(-${nextStyle.offsetLeft}px,0,0)`
    } 
    this.list.style.transition = 'all 300ms ease-in-out'
    const doSetState = () => {
      this.list.style.transition = 'none'
      this.list.style.WebkitTransform = `translate3d(-${nextStyle.offsetLeft}px,0,0)`
      this.scrollTo(prevValue)
    }

    if (this.lastTransitionendAction) {
      this.list.removeEventListener("transitionend", this.lastTransitionendAction)
    }
    
    this.list.addEventListener('transitionend', doSetState);
    this.lastTransitionendAction = doSetState
  }

  goNext = () => {
    const { length, itemSize } = this.props
    const { itemPerPage, from, viewportWidth } = this.state
    if(from +1  >= length ){
      return;
    }
    const nextStart = Math.max(from + 1, 0);
    //this.c++;
    //Math.min(from + itemPerPage, length - itemPerPage)
    // /this.c++;

    const nextStyle = getSizes(itemSize, itemPerPage, nextStart, length, viewportWidth)
    const animatingOffset = getAnimatingOffset(itemSize, itemPerPage, from, length, viewportWidth, nextStart)
   
     console.log("length",length);
     console.log("itemSize",itemSize);
     console.log("from",from);
     console.log("itemPerPage",itemPerPage);
     console.log("length - itemPerPage",length - itemPerPage);
     console.log("from + itemPerPage", from + itemPerPage);
     console.log("nextStart",nextStart);
     console.log("nextStyle",nextStyle);
     console.log("animatingOffset",animatingOffset);
     console.log("viewportWidth",viewportWidth);
     



    this.list.style.WebkitTransform = `translate3d(-${animatingOffset}px,0,0)`
    this.list.style.transition = 'all 500ms ease-in-out'
    const doSetState = () => {
      this.list.style.transition = 'none'
      this.list.style.WebkitTransform = `translate3d(-${nextStyle.offsetLeft}px,0,0)`
      this.scrollTo(nextStart)
    }

    if (this.lastTransitionendAction) {
      console.log("***************remove listerner : transitionend")
      this.list.removeEventListener("transitionend", this.lastTransitionendAction)
    }
    this.list.addEventListener('transitionend', doSetState)
    this.lastTransitionendAction = doSetState
  }

  render() {
    const { length, itemSize, itemRenderer, containerStyle } = this.props
    const { itemPerPage, from, viewportWidth } = this.state

    const { end, offsetLeft, start, visibleStartIndex } = getSizes(
      itemSize,
      itemPerPage,
      from,
      length,
      viewportWidth
    )

    const style = {
      width: 151 * 50,
      WebkitTransform: `translate3d(-${offsetLeft}px,0,0)`,
      willChange: 'transform'
    }

    let items = []
    for (let i = start; i < end; i++) {
      items.push(itemRenderer(i, i))
    }

    return (
      <div className="slider-container" style={containerStyle}>
        <ul style={style} ref={node => (this.list = node)}>
          {items}
        </ul>
      </div>
    )
  }
}

export default VirtualList