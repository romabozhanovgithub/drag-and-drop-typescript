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
type Listener<T> = (items: T[]) => void;

// State
class State<T> { // State class, which is a generic class that takes a type T
    protected listeners: Listener<T>[] = []; // Array of projects, which is an array of objects of type Project, and it can be accessed from classes that extend this class

    addListener(listenerFn: Listener<T>) { // listenerFn is a function that takes an array of projects as an argument and returns void
        this.listeners.push(listenerFn); // push the listener function to the listeners array
    }
}

// Proejct State Management
class ProjectState extends State<Project> { // ProjectState class, which manages the state of the projects
    private projects: Project[] = [];
    private static instance: ProjectState;

    private constructor() { // private constructor, so that no one can create new instance of this class
        super();
    }

    static getInstance() { // static method, so that we can call this method without creating new instance of this class
        if (this.instance) { // if instance already exists, return it
            return this.instance;
        }
        this.instance = new ProjectState(); // if instance does not exist, create a new instance and return it
        return this.instance;
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

// Component Base Class
abstract class Component<T extends HTMLElement, U extends HTMLElement> { // abstract class, so that it can only be inherited, not instantiated, and it can have abstract methods
    templateElement: HTMLTemplateElement;
    hostElement: T; // T is the type of the host element
    element: U; // U is the type of the element

    constructor( // constructor, which takes the id of the template element, the id of the host element, and the position of the element as arguments
        templateId: string, // id of the template element
        hostElementId: string, // id of the host element
        insertAtStart: boolean, // position of the element
        newElementId?: string // id of the new element
    ) {
        this.templateElement = document.getElementById(templateId)! as HTMLTemplateElement; // get the template element
        this.hostElement = document.getElementById(hostElementId)! as T; // get the host element
        // importNode is a method of the document object, it takes two arguments,
        // the first is the content of the template element, the second is a boolean value,
        // if true, it will import all the child nodes of the template element,
        // if false, it will only import the template element itself
        const importedNode = document.importNode(this.templateElement.content, true); // import the content of the template element
        this.element = importedNode.firstElementChild as U; // get the first element of the imported node, and store it in the element property
        if (newElementId) { // if newElementId is provided, set the id of the element to newElementId
            this.element.id = newElementId; // set the id of the element to newElementId
        }
        this.attach(insertAtStart); // attach the element to the host element
    }

    private attach(insertAtBeginning: boolean) { // attach the element to the host element
        this.hostElement.insertAdjacentElement(insertAtBeginning ? 'afterbegin' : 'beforeend', this.element); // insert the element at the beginning or end of the host element
    }

    abstract configure(): void; // abstract method, which is implemented in the subclasses
    abstract renderContent(): void; // abstract method, which is implemented in the subclasses
}

// Drag & Drop Interfaces
interface Draggable { // interface for draggable objects
    dragStartHandler(event: DragEvent): void; // dragStartHandler method, which takes a DragEvent as an argument and returns void
    dragEndHandler(event: DragEvent): void; // dragEndHandler method, which takes a DragEvent as an argument and returns void
}

// Project Item Class
class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable { // ProjectItem class, which extends the Component class, and implements the Draggable interface
    private project: Project; // project property, which stores the project

    get persons() { // getter, which returns the number of people
        if (this.project.people === 1) { // if the number of people is 1, return '1 person'
            return '1 person';
        } else { // if the number of people is not 1, return 'x people'
            return `${this.project.people} people`;
        }
    }

    constructor(hostId: string, project: Project) { // constructor, which takes the id of the host element and the project as arguments
        super('single-project', hostId, false, project.id); // call the constructor of the Component class
        this.project = project; // store the project in the project property
        this.configure(); // call the configure method
        this.renderContent(); // call the renderContent method
    }

    @autobind // autobind decorator
    dragStartHandler(event: DragEvent) { // dragStartHandler method, which takes the drag event as an argument
        event.dataTransfer!.setData('text/plain', this.project.id); // set the data of the drag event
        event.dataTransfer!.effectAllowed = 'move'; // set the effect of the drag event
    }

    @autobind // autobind decorator
    dragEndHandler(_: DragEvent) { // dragEndHandler method, which takes the drag event as an argument
        console.log('DragEnd');
    }

    configure() { // configure method, which is called in the constructor
        this.element.addEventListener('dragstart', this.dragStartHandler); // add a dragstart event listener to the element, which calls the dragStartHandler method
        this.element.addEventListener('dragend', this.dragEndHandler); // add a dragend event listener to the element, which calls the dragEndHandler method
    }
    
    renderContent() { // renderContent method, which is called in the constructor
        this.element.querySelector('h2')!.textContent = this.project.title; // set the text content of the h2 element to the title of the project
        this.element.querySelector('h3')!.textContent = this.persons + ' assigned'; // set the text content of the h3 element to the number of people assigned to the project
        this.element.querySelector('p')!.textContent = this.project.description; // set the text content of the p element to the description of the project
    }
}

// ProjectList class
class ProjectList extends Component<HTMLDivElement, HTMLElement> { // ProjectList class, which inherits from the Component class
    assignedProjects: Project[];

    constructor(private type: 'active' | 'finished') { // private type: 'active' | 'finished' means that type can only be active or finished
        super('project-list', 'app', false, `${type}-projects`); // call the constructor of the Component class
        this.assignedProjects = [];

        this.configure();
        this.renderContent();
    }

    configure(): void { // configure the event listeners, which are called when the component is initialized
        projectState.addListener((projects: Project[]) => { // add a listener to the projectState
            const relevantProjects = projects.filter(prj => { // filter the projects array and return only the projects that have the same type as this.type
                if (this.type === 'active') {
                    return prj.status === ProjectStatus.Active;
                }
                return prj.status === ProjectStatus.Finished;
            });
            this.assignedProjects = relevantProjects; // assign the relevant projects to the assignedProjects array
            this.renderProjects(); // render the projects
        });
    }

    renderContent() { // render the content of the element
        const listId = `${this.type}-projects-list`;
        this.element.querySelector('ul')!.id = listId;
        this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
    }

    private renderProjects() { // render the projects
        const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
        listEl.innerHTML = ''; // clear the list
        for (const prjItem of this.assignedProjects) { // for each project in the assignedProjects array, create a new <li> element and append it to the <ul> element
            new ProjectItem(this.element.querySelector('ul')!.id, prjItem); // create a new ProjectItem object, which takes the id of the <ul> element and the project as arguments
        }
    }
}

// ProjectInput Class
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> { // ProjectInput class, which inherits from the Component class
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

const prjInput = new ProjectInput();
const activePrjList = new ProjectList('active');
const finishedPrjList = new ProjectList('finished');
