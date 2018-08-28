import React, { Component } from "react"
import { render } from "react-dom"
import KeyMap from '../constants/keymap.constant';

import VirtualSlider from "./VirtualList"

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomColor() {
  const red = getRandomIntInclusive(0, 255)
  const green = getRandomIntInclusive(0, 255)
  const blue = getRandomIntInclusive(0, 255)

  return `rgb(${red}, ${green}, ${blue})`
}

const styles = {
  item: {
    width: 151,
    height: 188,
    display: "inline-block"
  },
  container: {
    overflow: "hidden"
  }
}

class Demo extends Component {
  constructor(){
    super();
    this.c = 0;
  }

  componentWillMount() {
    document.addEventListener("keydown", this.handleKey.bind(this));
  }    

  /**
     * Description: Handling the key event.
     * @param {event} 
     * @return {null}
     */
    handleKey(event) {
      const keycode = event.keyCode;
          switch(keycode){
              case KeyMap.VK_LEFT:
                this.handlePrev();
              break;
              case KeyMap.VK_RIGHT:
                this.handleNext();
              break;
              case KeyMap.VK_BACK:
              break;

              default:
          }
      
  }

  renderItem = (index, key) => {
    return (
      <li  style={{ ...styles.item, backgroundColor: "red",border:"1px solid #000" }}>
        {index}
      </li>
    )
  }

  handlePrev = () => {
    this.slider.goBack()
  }

  handleNext = () => {
  //  this.slider.scrollTo(this.c++)

   this.slider.goNext()
  }

  goToFirst = () => {
    this.slider.scrollTo(0)
  }

  goto = position => {
    this.slider.scrollTo(position)
  }

  handleStart = () => {
    console.log("start")
  }

  handleEnd = () => {
    console.log("end")
  }

  render() {
    const itemN = 50;
    return (
      
      <div>
        <h1>TOTAL: {itemN} items</h1>
        <VirtualSlider
          ref={slider => (this.slider = slider)}
          itemRenderer={this.renderItem}
          itemSize={151}
          length={itemN}
          containerStyle={styles.container}
          startAction={this.handleStart}
          endAction={this.handleEnd}
        />

        <button onClick={this.handlePrev}>Prev</button>
        <button onClick={this.handleNext}>Next</button>
        <button onClick={this.goToFirst}>FIRST</button>
        <button onClick={this.goto.bind(null, 500)}>500th item</button>
      </div>
    )
  }
}

export default Demo;
