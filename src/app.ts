/// <reference path="components/project_input.ts" />
/// <reference path="components/project_list.ts" />

namespace App {
    new ProjectInput();
    new ProjectList('active');
    new ProjectList('finished');
}
