// autobind decorator
const autobind = (_: any, _2: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    const adjDescriptor: PropertyDescriptor = {
        configurable: true,
        get() {
            const boundFn = originalMethod.bind(this);
            return boundFn;
        }
    };
    return adjDescriptor;
};

// Validation interface
interface Validatable {
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
}

// Validation
const validate = (validatableInput: Validatable) => {
    let isValid = true;
    if (validatableInput.required) {
        isValid = isValid && validatableInput.value.toString().trim().length !== 0;
    }
    if (validatableInput.minLength != null && typeof validatableInput.value === 'string') {
        isValid = isValid && validatableInput.value.length > validatableInput.minLength;
    }
    if (validatableInput.maxLength != null && typeof validatableInput.value === 'string') {
        isValid = isValid && validatableInput.value.length < validatableInput.maxLength;
    }
    if (validatableInput.min != null && typeof validatableInput.value === 'number') {
        isValid = isValid && validatableInput.value > validatableInput.min;
    }
    if (validatableInput.max != null && typeof validatableInput.value === 'number') {
        isValid = isValid && validatableInput.value < validatableInput.max;
    }
    return isValid;
};

// ProjectInput Class
class ProjectInput {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLFormElement;
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElements: HTMLInputElement;

    constructor() {
        this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement; // ! is a non-null assertion operator
        this.hostElement = document.getElementById('app')! as HTMLDivElement;

        // importNode is a method of the document object, it takes two arguments,
        // the first is the content of the template element, the second is a boolean value,
        // if true, it will import all the child nodes of the template element,
        // if false, it will only import the template element itself
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild as HTMLFormElement; // firstElementChild is a property of the Node interface
        this.element.id = 'user-input';

        this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
        this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
        this.peopleInputElements = this.element.querySelector('#people') as HTMLInputElement;

        this.configure();
        this.attach();
    }

    private gatherUserInput(): [string, string, number] | void { // tuple type, an array with a fixed number of elements
        const enteredTitle = this.titleInputElement.value;
        const enteredDescription = this.descriptionInputElement.value;
        const enteredPeople = this.peopleInputElements.value;

        const titleValidatable: Validatable = { // object literal, type is inferred
            value: enteredTitle,
            required: true
        };
        const descriptionValidatable: Validatable = { // object literal, type is inferred
            value: enteredDescription,
            required: true,
            minLength: 5
        };
        const peopleValidatable: Validatable = { // object literal, type is inferred
            value: +enteredPeople,
            required: true,
            min: 1,
            max: 5
        };
        
        if (
            !validate(titleValidatable) ||
            !validate(descriptionValidatable) ||
            !validate(peopleValidatable)
        ) {
            alert('Invalid input, please try again!');
            return;
        } else {
            return [enteredTitle, enteredDescription, +enteredPeople]; // + is a type casting operator, it converts the string to a number
        }
    }

    @autobind
    private submitHandler(event: Event) {
        event.preventDefault();
        const userInput = this.gatherUserInput();
        if (Array.isArray(userInput)) {
            const [title, description, people] = userInput;
            console.log(title, description, people);
            this.clearInputs();
        }
    }

    private clearInputs() { // this is a good place to clear the input fields
        this.titleInputElement.value = '';
        this.descriptionInputElement.value = '';
        this.peopleInputElements.value = '';
    }

    private configure() { // this is a good place to add event listeners
        this.element.addEventListener('submit', this.submitHandler);
        // this.element.addEventListener('submit', this.submitHandler.bind(this)); // bind this to the submitHandler method, so that this will refer to the class instance
        // another way to do this is to use decorators, which is a feature of typescript
    }

    private attach() { // this is a good place to attach the element to the DOM
        this.hostElement.insertAdjacentElement('afterbegin', this.element);
    }
}

const prjInput = new ProjectInput();
