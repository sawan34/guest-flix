/**
* Summary: Menu Filter Grid Component
* Description: This is Component form menu Filter
* @author Sawan Kumar
* @date  31.07.2018
*/
import React, { Component } from 'react';
import CheckboxGrid from '../../FocusElement/CheckboxGrid';

class MenuCheckBoxGrid extends CheckboxGrid{
    constructor(props) {
      super(props);
      this.numberOfColumn = this.props.numberOfColumn;
    }
    /**
      * Description: Focus on item by Key Press Right
      * @param {null} 
      * @return {null}
      */
     focusOnRightKey() {
       console.log(this.rowData())
      if (!this.rowData()[this.state.selectedRow][this.state.selectedItemIndex + 1]) {
        return;
      }
    
        if ((this.state.selectedItemIndex < this.props.col - 1)) {
          this.setState({ selectedItemIndex: this.state.selectedItemIndex + 1 });
        }
    }
    componentDidMount(){
      super.componentDidMount();
      let focusColumn = 0,focusRow=0;
      if(this.props.preSelectedLangIndex > 0){
        focusRow =  this.props.preSelectedLangIndex % this.numberOfColumn;
        focusColumn = Math.floor(this.props.preSelectedLangIndex / this.numberOfColumn);
        console.log(focusRow);
        console.log(focusColumn)
        this.setState({
          selectedItemIndex:focusRow-1,
          selectedRow:focusColumn
        });
    
      }
     
    }
  }
  export default MenuCheckBoxGrid;