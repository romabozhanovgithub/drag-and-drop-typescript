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

    private submitHandler(event: Event) {
        event.preventDefault();
        console.log(this.titleInputElement.value);
    }

    private configure() { // this is a good place to add event listeners
        this.element.addEventListener('submit', this.submitHandler.bind(this)); // bind this to the submitHandler method, so that this will refer to the class instance
        // another way to do this is to use decorators, which is a feature of typescript
    }

    private attach() { // this is a good place to attach the element to the DOM
        this.hostElement.insertAdjacentElement('afterbegin', this.element);
    }
}

const prjInput = new ProjectInput();
