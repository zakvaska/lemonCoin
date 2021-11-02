class ActionTemplate {
    constructor(options) {
        this.entityName = options.entityName;
        this.actionName = options.actionName;
        this.areParmsNedeed = options.areParmsNedeed;
        this.parmNames = options.parmNames;
        this.parmValues = new Array(options.parmNames.length);
    }

    createAction = (globalOptions) => {
        const entity = window[this.entityName] || window;
        // console.log(this.areParmsNedeed);
        if (this.areParmsNedeed) {
            // const bindedFunction = () => {
            //     entity[this.actionName].apply(null, this.props);
            // }
            // return bindedFunction;
            this.parmNames.forEach((parmName, index) => {
                if (typeof globalOptions[parmName] ==='function') {
                    this.parmValues[index] = globalOptions[parmName]();
                } else {
                    this.parmValues[index] = globalOptions[parmName];
                }
            });
            // console.log(this.parmNames);
            return entity[this.actionName].bind(null, ...this.parmValues);
        } else {
            return entity[this.actionName];
        }

    }
}