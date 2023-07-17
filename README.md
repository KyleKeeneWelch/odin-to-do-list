# odin-to-do-list
This project is a project undertaken as part of `The Odin Project` learning web course teaching `HTML`, `CSS` and `JavaScript` skills. It involved putting into practice the teachings of `Modules', 'OOP' and 'Webpack' to develop a To-Do-List application with optimized performance, storage and use of good coding practices.

The project aims to provide the user with the functionality required in creating projects, tasks and notes for a project and see which tasks are due today or this week. It provides a simplistic user interface, exported classes to represent each data structure, and DOM methods to provide the interactivity between the user and the application.

To provide manipulation of dates and a sense of schedule within the application, `Date-fns` an imported library was used and its obtained functions integrated to return values for much of the conditionals relating to date input. These included `isToday()`, `isThisWeek()` and `isPast()`.

The To-Do-List accesses Local Storage to obtain the saved object from a previous session. New users have their object set to null which in turn causes the application to instantiate a new `ToDoList` object with the default projects. Every time a meaningful change is to be made to the To-Do-List, the application will access the related method within the `Storage` module that obtains the `ToDoList` object, makes the change, then saves the change to storage. The `Storage` module has access to imported functions from the classes of the objects it changes and so makes calls to these methods alongside save operations rather than the methods themselves. 

The page is generated with `HTML Webpack Plugin` and the modules are passed as entry points that produce a single script to be injected into the page. The application is optimized and the size reduced using the `devtool` option provided by webpack and this is set to `eval`.

## Features

- **Modular** - Makes use of JavaScript ES6 import syntax to import methods belonging to classes of application data structures. Modules are standalone and can be tested by themselves before integrated with the rest of the application.

- **JavaScript Validation API** - Modal forms and edit forms are handled through the JavaScript Validation API and produce coherrant error messages when the user provides invalid input. 

- **Date-fns Integration** - The application imports functions part of the Date-fns package which are used in conditionals to validate user date input.

- **Webpack Optimization** - Utilizies Webpack devtool to optimize performance and reduce application size. HTML Webpack Plugin is used to generate the page with the required script and stylesheet injected.

- **Local Storage** - Uses the browser's local storage cache to store and access the state of the ToDoList object and updates are made when a meaningful change has been met. 