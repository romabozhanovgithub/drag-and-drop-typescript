namespace App {
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
    export class ProjectState extends State<Project> { // ProjectState class, which manages the state of the projects
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
            this.updateListeners(); // call the updateListeners() method
        }

        moveProject(projectId: string, newStatus: ProjectStatus) { // move a project to a new status
            const project = this.projects.find(prj => prj.id === projectId); // find the project with the given id
            if (project && project.status !== newStatus) { // if project exists and its status is not the same as the new status
                project.status = newStatus; // change the status of the project
                this.updateListeners(); // call the updateListeners() method
            }
        }

        private updateListeners() { // call all the listener functions with the projects array as an argument, so that they can update their UI
            for (const listenerFn of this.listeners) { // call all the listener functions with the projects array as an argument, so that they can update their UI
                listenerFn(this.projects.slice()); // slice() is used to create a copy of the projects array, so that the original array is not modified
            }
        }
    }

    export const projectState = ProjectState.getInstance(); // create a new instance of the ProjectState class
}
