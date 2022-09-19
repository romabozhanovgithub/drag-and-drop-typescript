// Drag and Drop Interfaces
// Drag & Drop Interfaces
// export, so we can use it in other files
export interface Draggable { // interface for draggable objects
    dragStartHandler(event: DragEvent): void; // dragStartHandler method, which takes a DragEvent as an argument and returns void
    dragEndHandler(event: DragEvent): void; // dragEndHandler method, which takes a DragEvent as an argument and returns void
}

export interface DragTarget { // interface for drag targets
    dragOverHandler(event: DragEvent): void; // dragOverHandler method, which takes a DragEvent as an argument and returns void
    dropHandler(event: DragEvent): void; // dropHandler method, which takes a DragEvent as an argument and returns void
    dragLeaveHandler(event: DragEvent): void; // dragLeaveHandler method, which takes a DragEvent as an argument and returns void
}
