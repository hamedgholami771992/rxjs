
// A- Cold Observable
//      we have seen some observables that emits some sets of values when an observer subscribes into it, 
//      in this case, for each new subscribtion, the observable produced a new set of values



// B- Hot Observable
//      where the observable's logic connects to some common, shared resource, for example a DOM event like a click on a button,
//      so, if we would have multiple subscribtion to the same observable, each active subscribtion would receive the same value at the same time



//A- Cold Observables examples
//1- Intervals
//2- Http Requests
import { Observable, } from "rxjs";
import { ajax } from 'rxjs/ajax'

//ajax is a helper function provided by rxjs, such helper fuction is called creation-function or creation-operation, in short these function creates an observable for us
const httpObsevable$ = ajax({
  url: "https://random-data-api.com/api/name/random_name"
})

// httpObsevable$.subscribe({
//   next: val => { console.log('httpObsevable   subscriber   value: ', val) },
//   complete: () => console.log('httpObsevable   subscriber  completed'),
//   error: (err) =>  console.log('httpObsevable   subscriber  err: ', err),
// })
// httpObsevable$.subscribe({
//   next: val => { console.log('httpObsevable   subscriber   value: ', val) },
//   complete: () => console.log('httpObsevable   subscriber  completed'),
//   error: (err) =>  console.log('httpObsevable   subscriber  err: ', err),
// })
//each subscribtion make a seperate http call


//B- Hot Observables examples
//1- DOM events
//2- State
//3- Subjects   ==> can be used to multicast notifications, 
//** A subject is observable and observer at the same time, we can subscribe to it multiple times in various parts of our app, 
//     and then call the .next() on it from any place to multicast some value to all active subscribtions


// there might also be some observables which behave as Hot and Cold at the same time, 
// for example such Observable might emit some values specific to each new Subscribtion, which is cold behavior,
//     and then go on with multicasting some other source, which is hot behavior


// there might be an observable which at first is cold and then becomes hot
// an observable which counts the active subscribtions
// so for the first subscribtion, it might initialize a connection to the database, which is cold behavior
// and the following subscriptions will reuse the same connection, which is hot behavior

//these are just a small part of whats available in the rxjs world
const helloButton = document.querySelector('button#hello')
const helloClickObservableGenerator = () => {
  let listenerHasBeenRegistered = false
  return new Observable<MouseEvent>(subscriber => {
    console.log('helloButtonObservable   subscriber  executer')
    const handler = (event) => {
      subscriber.next(event)
    }
    if (!listenerHasBeenRegistered) {

      (<any>helloButton).addEventListener("click", handler)
      listenerHasBeenRegistered = true
    }

    return () => {
      helloButton.removeEventListener("click", handler)
    }
  })
}

const helloButtonObservable$ = helloClickObservableGenerator()
helloButtonObservable$.subscribe({
  next: val => { console.log('helloButtonObservable   subscriber   value: ', val) },
  complete: () => console.log('helloButtonObservable   subscriber  completed'),
  error: (err) => console.log('helloButtonObservable   subscriber  err: ', err),
})