// Project Status
enum ProjectStatus {
    Active,
    Finished
}

// Project Type
class Project {
    constructor(
        public id: string,
        public title: string,
        public description: string,
        public people: number,
        public status: ProjectStatus
    ) {}
}

// Listener type
type Listener = (items: Project[]) => void;

// Proejct State Management
class ProjectState { // ProjectState class, which manages the state of the projects
    private listeners: Listener[] = [];
    private projects: Project[] = [];
    private static instance: ProjectState;

    private constructor() {} // private constructor, so that no one can create new instance of this class

    static getInstance() { // static method, so that we can call this method without creating new instance of this class
        if (this.instance) { // if instance already exists, return it
            return this.instance;
        }
        this.instance = new ProjectState(); // if instance does not exist, create a new instance and return it
        return this.instance;
    }

    addListener(listenerFn: Listener) { // listenerFn is a function that takes an array of projects as an argument and returns void
        this.listeners.push(listenerFn); // push the listener function to the listeners array
    }

    addProject(title: string, description: string, numOfPeople: number) { // add a new project to the projects array, and call all the listener functions
        const newProject = new Project( // create a new project
            Math.random().toString(), // generate a random id
            title, // title
            description, // description
            numOfPeople, // number of people
            ProjectStatus.Active // status
        );
        this.projects.push(newProject); // push the new project to the projects array
        for (const listenerFn of this.listeners) { // call all the listener functions with the projects array as an argument, so that they can update their UI
            listenerFn(this.projects.slice()); // slice() is used to create a copy of the projects array, so that the original array is not modified
        }
    }
}

const projectState = ProjectState.getInstance(); // create a new instance of the ProjectState class

// autobind decorator
const autobind = (_: any, _2: string, descriptor: PropertyDescriptor) => { // _ is unused, _2 is the name of the method, descriptor is the property descriptor
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

// Validation interface
interface Validatable {
    value: string | number;
    required?: boolean; // ? means optional
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
}

// Validation
function validate(validatableInput: Validatable) {
    let isValid = true;
    if (validatableInput.required) {
        isValid = isValid && validatableInput.value.toString().trim().length !== 0; // trim() removes whitespace
    }
    if (validatableInput.minLength != null && typeof validatableInput.value === 'string') {
        isValid = isValid && validatableInput.value.length >= validatableInput.minLength;
    }
    if (validatableInput.maxLength != null && typeof validatableInput.value === 'string') {
        isValid = isValid && validatableInput.value.length <= validatableInput.maxLength;
    }
    if (validatableInput.min != null && typeof validatableInput.value === 'number') {
        isValid = isValid && validatableInput.value >= validatableInput.min;
    }
    if (validatableInput.max != null && typeof validatableInput.value === 'number') {
        isValid = isValid && validatableInput.value <= validatableInput.max;
    }
    return isValid;
}

// ProjectList class
class ProjectList {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLElement;
    assignedProjects: Project[];

    constructor(private type: 'active' | 'finished') { // private type: 'active' | 'finished' means that type can only be active or finished
        this.templateElement = document.getElementById('project-list')! as HTMLTemplateElement;
        this.hostElement = document.getElementById('app')! as HTMLDivElement;
        this.assignedProjects = [];

        const importedNode = document.importNode(this.templateElement.content, true); // true means deep clone, false means shallow clone
        this.element = importedNode.firstElementChild as HTMLElement;
        this.element.id = `${this.type}-projects`; // this.element.id = `${this.type}-projects` means that the id of the element will be active-projects or finished-projects

        projectState.addListener((projects: Project[]) => { // add a listener to the projectState
            this.assignedProjects = projects; // store the projects array in the assignedProjects array
            this.renderProjects(); // render the projects
        });

        this.attach();
        this.renderContent();
    }

    private renderProjects() { // render the projects
        const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
        for (const prjItem of this.assignedProjects) { // for each project in the assignedProjects array, create a new <li> element and append it to the <ul> element
            const listItem = document.createElement('li');
            listItem.textContent = prjItem.title;
            listEl.appendChild(listItem);
        }
    }

    private renderContent() { // render the content of the element
        const listId = `${this.type}-projects-list`;
        this.element.querySelector('ul')!.id = listId;
        this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
    }

    private attach() {
        this.hostElement.insertAdjacentElement('beforeend', this.element); // insert the element into the DOM, beforeend means that the element will be inserted as the last child of the hostElement
    }
}

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

    private configure() { // this is a good place to add event listeners
        this.element.addEventListener('submit', this.submitHandler);
        // this.element.addEventListener('submit', this.submitHandler.bind(this)); // bind this to the submitHandler method, so that this will refer to the class instance
        // another way to do this is to use decorators, which is a feature of typescript
    }

    private attach() { // this is a good place to attach the element to the DOM
        this.hostElement.insertAdjacentElement('afterbegin', this.element); // insertAdjacentElement is a method of the Element interface, it takes two arguments, the first is a string, the second is an element
    }
}

const prjInput = new ProjectInput();
const activePrjList = new ProjectList('active');
const finishedPrjList = new ProjectList('finished');
