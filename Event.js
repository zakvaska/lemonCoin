const events = [];

class Event {
    constructor(type, newValue) {
        this.type = type;
        this.newValue = newValue;
        events.push(this);
        this.informListeners();
    }

    informListeners() {
        const interestedListeners = currentOptions[`${this.type}Listeners`]
        .filter((listener) => listener.triggerValue === this.newValue);
        // console.log(currentOptions[`${this.type}Listeners`]);
        // console.log(currentOptions[`${this.type}Listeners`][0].triggerValue);
        // console.log(this.newValue);
        // console.log(interestedListeners);

        interestedListeners.forEach((listener) => listener.executeAction());
        this.informedListener = interestedListeners;
    }
}
