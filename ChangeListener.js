class ChangeListener {
    constructor(eventType, triggerValue, handler, ...args) {
        this.eventType = eventType;
        this.triggerValue = triggerValue;
        this.handler = () => handler.apply(null, args);
        this.handlerName = handler.name;
        this.handlerArgs = args;
        this.operationCounter = 0;
    }

    executeAction() {
        // console.log('execute');
        this.operationCounter++;
        this.handler();
    }
}