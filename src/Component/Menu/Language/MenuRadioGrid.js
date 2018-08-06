/**
* Summary: Extending Radio Grid
* Description: Extending Radio Grid For Key Issue
* @author Sawan Kumar
* @date  02.08.2018
*/
import React from 'react';
import RadioGrid from '../../FocusElement/RadioGrid';


class MenuRadioGrid extends RadioGrid{
    constructor(props) {
      super(props);
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
      * Description: Setting Active Radio for Focus
      * @param {null} 
      * @return {null}
      */
    componentDidMount(){
      super.componentDidMount();
      let focusColumn = 0,focusRow=0;
      if(this.props.preSelectedLangIndex > 0){
        focusRow =  this.props.preSelectedLangIndex % this.numberOfLangColumn;
        focusColumn = Math.floor(this.props.preSelectedLangIndex / this.numberOfLangColumn);
        this.setState({
          selectedItemIndex:focusRow-1,
          selectedRow:focusColumn
        });
    
      }
     
    }
  }

  export default MenuRadioGrid;