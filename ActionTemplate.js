class ActionTemplate {
    constructor(options) {
        this.entityName = options.entityName;
        this.actionName = options.actionName;
        this.parmNames = options.parmNames;
        this.parmValues = new Array(options.parmNames.length);
    }

    createAction = () => {
        const entity = window[this.entityName] || window;
        // console.log(this.areParmsNedeed);
        if (this.parmNames.length) {
            // console.log(this);
            // const bindedFunction = () => {
            //     entity[this.actionName].apply(null, this.props);
            // }
            // return bindedFunction;
            this.parmNames.forEach((parmName, index) => {
                // if (typeof currentOptions[parmName].value ==='function') {
                this.parmValues[index] = currentOptions[parmName].value.call(null, currentOptions[parmName].parms);
                // console.log(this.parmValues);
                // } else {
                    // this.parmValues[index] = currentOptions[parmName].value;
                // }
            });
            // console.log(this.parmNames);
            return entity[this.actionName].bind(null, ...this.parmValues);
        } else {
            return entity[this.actionName];
        }

    }
}
