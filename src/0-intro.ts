// Observables: 
//     - The observables are like data/event generators with some logic stored inside
//     - the data they generate can have various sources like ann array values, DOM events, Http requests, timers, 
//         actually anything you want, can be converted into an observable
//     - now we need to execute it somehow, so it starts generating the data
//     - to run the code placed inside of an observable, we need to subscribe to it

// what we can do with the data emitted by the observables
//     - in most cases you will want to consume the data emitted by an observable and run a logic that you would like to run for each emitted value
//     and if something goes wrong you can provide some error handling logic 
    

// In simple words, Observables are like functions, which generate some values once we subscribe to them

// An observable is like a function which we can execute and which then runs its logic and can return multiple values at various points of time

// recommendation: add $ at the end of the name of observable like --> name$








import { Observable } from 'rxjs'


const name$ = new Observable(subscriber => subscriber.next(2))


name$.subscribe((value) => {
  console.log(value)
})
//by calling subscribe we made this name$ observable, run its code and possibly emit some values
//however we did not provide the handler for those values, so we could not see any effect


// each time we call subscribe() on it, it generates and emits that value instantly


// sometimes we need to make an Http request to a server to store some data and we need to provide the data we want to store
// we can also do this using the observables

const storeDataOnServer = () => new Observable(subscriber => subscriber.next(2))
//the observable returned by this function will simulate storing some data on the server
//calling this function will just create and return a new observable, which it's logic will be able to store out value on the server
//however we still need to execute this returned observable to make this happen
//by calling .subscribe(), the logic stored inside of the returned observable will be executed
storeDataOnServer().subscribe(value => console.log(value))




// what about error-handling
//to show how to handle the errors, 
const storeDataOnServerError = () => new Observable(subscriber => subscriber.next(2))
//deprecated version
storeDataOnServerError().subscribe(
  value => console.log(value),
  err => console.log('Error when saving: ', err)
)
//in this version, we can provide handlers for each notification type
storeDataOnServerError().subscribe({
  next: value => console.log(value),  //next notification which are used to emit the values
  error: err => console.log('Error when saving: ', err)  //now we are handling error by registering habler for error notifications
})


//you could see that the observables are like functions with some logic stored inside
//the difference is that they can emit any number of the values at various points of time
//the observables on their own dont do anything, 
//we need to call subscribe() on them to execute them
//we can react to the values they emit by providing a handler


// 3 main topic in rxjs
// 1- Observables
// 2- Subscrptions 
// 3- Observers 
// 4- Creation Functions
// 5- Pipeable Operators
// 6- Subjects

