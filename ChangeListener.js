class ChangeListener {
    constructor(message, eventTypeName, triggerValue, handler, ...args) {
        this.message = message;
        this.eventType = eventTypeName;
        this.triggerValue = triggerValue;
        this.handler = () => handler.apply(null, args);
        this.handlerName = handler.name;
        this.handlerArgs = args;
        this.operationCounter = 0;
        this.executed = false;
    }

    executeAction() {
        console.log(`${this.message} because new ${this.eventType} value ${window[eventTypes[this.eventType].variable]} >= ${this.triggerValue}`);
        this.operationCounter++;
        this.handler();
        this.executed = true;
    }
}