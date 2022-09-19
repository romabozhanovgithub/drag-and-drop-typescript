import { Component } from "./base.js";
import { autobind } from "../decorators/autobind.js";
import { Validatable, validate } from "../utils/validation.js";
import { projectState } from "../state/project_state.js";

// ProjectInput Class
export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> { // ProjectInput class, which inherits from the Component class
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElements: HTMLInputElement;

    constructor() {
        super('project-input', 'app', true, 'user-input'); // call the constructor of the Component class
        this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
        this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
        this.peopleInputElements = this.element.querySelector('#people') as HTMLInputElement;

        this.configure();
    }

    configure() { // this is a good place to add event listeners
        this.element.addEventListener('submit', this.submitHandler);
        // this.element.addEventListener('submit', this.submitHandler.bind(this)); // bind this to the submitHandler method, so that this will refer to the class instance
        // another way to do this is to use decorators, which is a feature of typescript
    }

    renderContent() {} // we need to implement this method, because it is abstract in the Component class

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
            value: +enteredPeople, // + is a type casting operator, it converts the string to a number
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
            projectState.addProject(title, description, people);
            this.clearInputs();
        }
    }

    private clearInputs() { // this is a good place to clear the input fields
        this.titleInputElement.value = '';
        this.descriptionInputElement.value = '';
        this.peopleInputElements.value = '';
    }
}
