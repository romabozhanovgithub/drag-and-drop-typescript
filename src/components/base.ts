namespace App {
    // Component Base Class
    export abstract class Component<T extends HTMLElement, U extends HTMLElement> { // abstract class, so that it can only be inherited, not instantiated, and it can have abstract methods
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
}
