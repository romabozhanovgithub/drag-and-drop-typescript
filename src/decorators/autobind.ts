// autobind decorator
export const autobind = (_: any, _2: string, descriptor: PropertyDescriptor) => { // _ is unused, _2 is the name of the method, descriptor is the property descriptor
    const originalMethod = descriptor.value; // store the original method
    const adjDescriptor: PropertyDescriptor = { // adjDescriptor is the adjusted descriptor, which is the descriptor we return
        configurable: true, // we can reconfigure this property
        get() {
            const boundFn = originalMethod.bind(this); // bind the original method to the instance of the class
            return boundFn;
        }
    };
    return adjDescriptor;
};
