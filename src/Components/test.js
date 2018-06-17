class ExampleComponent extends React.Component {
  
    componentDidMount(){
       document.addEventListener("keydown", this._handleKeyDown.bind(this));
    }
    
     _handleKeyDown (event) {
           console.log(event.keyCode);
         if(this._handleKeyDownScreen){
           this._handleKeyDownScreen(event)
         }
           
         
      }
    
  }
  
  class RenderComponent extends ExampleComponent {
    
    constructor(){
       super()
    }
    
    componentDidMount(){
            super.componentDidMount()
            console.log("ComponentDidMount")
    }
    
    _handleKeyDownScreen(e){
      console.log("Handle Screen Key:"+event.keyCode)
      
    }
    
    componentDidUpdate(){
        console.log("ComponentDidUpdate")
    }
    
    
    render () {
      return(
        <div>
          
            Click me!
          
        </div>
      )
    }  
  }
  
  ReactDOM.render(
    <RenderComponent />, 
    document.getElementById('app')
  )