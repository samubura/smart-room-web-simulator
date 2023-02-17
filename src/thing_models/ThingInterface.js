class ThingInterface {
  
  actionStack = [];
  currentAction = undefined;

  //every tick an action is performed, if the action takes more ticks to be peformed it waits and decrease the tick counter
  tick() {
    if(this.currentAction){
      this.currentAction.ticks = this.currentAction.ticks - 1
      if(this.currentAction.ticks == 0){
        this._executeCurrentAction();
        this.currentAction = undefined
        return
      }
    }
    if(!this.currentAction && this.actionStack.length > 0){
      //pop a new action from the stack
      this.currentAction = this.actionStack.pop();
      if(this.currentAction.ticks == 0) {
        //an instant action is executed immediately and a new one is consumed
        this._executeCurrentAction();
        this.currentAction = undefined;
        this.tick();
        return
      }
      else if(this.currentAction.ticks - 1 > 0){
        this.currentAction.ticks = this.currentAction.ticks - 1
        return;
      } else {
        //the action was exactly 1 tick long so it's peformed when popped
        this._executeCurrentAction();
        this.currentAction = undefined;
        return;
      }
    }
  }

  //abstract
  _executeCurrentAction() { };
}

module.exports = ThingInterface