import Component from "./base";
import { Project, ProjectStatus } from "../models/project_model";
import { DragTarget } from "../models/drag_drop_interfaces";
import { autobind } from "../decorators/autobind";
import { ProjectItem } from "./project_item";
import { projectState } from "../state/project_state";

// ProjectList class
export class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget { // ProjectList class, which inherits from the Component class
    assignedProjects: Project[];

    constructor(private type: 'active' | 'finished') { // private type: 'active' | 'finished' means that type can only be active or finished
        super('project-list', 'app', false, `${type}-projects`); // call the constructor of the Component class
        this.assignedProjects = [];

        this.configure();
        this.renderContent();
    }

    @autobind
    dragOverHandler(event: DragEvent) { // dragOverHandler method, which takes the drag event as an argument
        if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') { // if the dataTransfer property of the drag event is not null and the type of the data is text/plain
            event.preventDefault(); // prevent the default action of the drag event
            const listEl = this.element.querySelector('ul')!; // get the ul element
            listEl.classList.add('droppable'); // add the droppable class to the ul element
        }
    }

    @autobind
    dropHandler(event: DragEvent) { // dropHandler method, which takes the drag event as an argument
        const prjId = event.dataTransfer!.getData('text/plain'); // get the data of the drag event
        projectState.moveProject(prjId, this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished); // move the project to the active or finished list
        const listEl = this.element.querySelector('ul')!; // get the ul element
        listEl.classList.remove('droppable'); // remove the droppable class from the ul element
    }

    @autobind
    dragLeaveHandler(_: DragEvent) { // dragLeaveHandler method, which takes the drag event as an argument
        const listEl = this.element.querySelector('ul')!; // get the ul element
        listEl.classList.remove('droppable'); // remove the droppable class from the ul element
    }

    configure(): void { // configure the event listeners, which are called when the component is initialized
        this.element.addEventListener('dragover', this.dragOverHandler); // add a dragover event listener to the element, which calls the dragOverHandler method
        this.element.addEventListener('drop', this.dropHandler); // add a drop event listener to the element, which calls the dropHandler method
        this.element.addEventListener('dragleave', this.dragLeaveHandler); // add a dragleave event listener to the element, which calls the dragLeaveHandler method
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
