class ChangeListener {
    constructor(message, eventType, triggerValue, handler, ...args) {
        this.message = message;
        this.eventType = eventType;
        this.triggerValue = triggerValue;
        this.handler = () => handler.apply(null, args);
        this.handlerName = handler.name;
        this.handlerArgs = args;
        this.operationCounter = 0;
    }

    executeAction() {
        console.log(`${this.message} ${this.eventType} with value ${this.triggerValue}`);
        this.operationCounter++;
        this.handler();
    }
}