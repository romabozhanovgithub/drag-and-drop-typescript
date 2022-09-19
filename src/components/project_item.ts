import { Draggable } from '../models/drag_drop_interfaces';
import { Project } from '../models/project_model';
import { Component } from './base';
import { autobind } from '../decorators/autobind';

// Project Item Class
export class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable { // ProjectItem class, which extends the Component class, and implements the Draggable interface
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

    @autobind
    dragStartHandler(event: DragEvent) { // dragStartHandler method, which takes the drag event as an argument
        // dataTransfer is a property of the DragEvent interface, it is used to store data that is dragged, and it is used in the drop event
        // setData is a method of the DataTransfer interface, it takes two arguments, the first is the format of the data, the second is the data itself, it tells the browser what kind of data is being dragged
        // effectAllowed is a property of the DataTransfer interface, it is used to set the allowed effects when an element is dragged, it tells the browser what to do with the dragged data
        event.dataTransfer!.setData('text/plain', this.project.id); // set the data of the drag event
        event.dataTransfer!.effectAllowed = 'move'; // set the effect of the drag event
    }

    @autobind
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
