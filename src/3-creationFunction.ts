//# Creation Functions

import axios from "axios";
import { eventNames } from "process";
import { Observable, combineLatest, forkJoin, from, fromEvent, interval, of, timer } from "rxjs";


// of:   just emits the value provided as arguments and completes
// from:   converts things like arrays, promises, iterables into an Observable
// fromEvent:   allows us to create an observable from some event target, subscribing and unsubscribing works here like 'add' and 'removeEventListener'
// interval/timer:  will generate an observable which emits notifications with some delay or in intervals
// forkJoin:    accepts an array of Observables as input, after all these observables complete, it emits a set of the latest values emitted by each of them
// very useful if you need to wait for the result of a couple of Http calls

// combineLatest:  accepts multiple input observables. each time any of them emits something new, a combined set of the latest values will be emitted as an array




//1- of
of('Alice', 'Ben')
// .subscribe({
//   next: val => console.log(val),
//   complete: () => console.log('completed')
// })

//what observable returns from 'of' creation function 
const ofObservable$ = new Observable<string>((subscriber) => {
  subscriber.next('Alice')
  subscriber.next('Ben')
  subscriber.complete()
})

// ofObservable$
//.subscribe({
//   next: val => console.log(val),
//   complete: () => console.log('completed')
// })

//what happens inside 'of' creation function
const ofCreationFunc = (...values: string[]): Observable<string> => {
  return new Observable((subscriber) => {
    for (const val of values) {
      subscriber.next(val)
    }
    subscriber.complete()
  })
}

ofCreationFunc("Alice", "Ben")
// .subscribe({
//   next: val => console.log(val),
//   complete: () => console.log('completed')
// })




//2- from:  converts arrays, iterables and other types into observable 
// ** another usage is to create an observable from "Promise", Promise's resolve value will be emitted as a next notification, and it will complete 
//    if the promise gets rejected, the observable will emit an error

const fromObservableFromArray$ = from(["Alice", "Ben"])   //using from with array, creates a Cold observable which emits the values and completes every time we subscribe to it
// fromObservable$.subscribe({
//   next: val => console.log(val),
//   complete: () => console.log('completed')
// })


//converting a promise into an observable:  its useful when we already have some code or API exposed as a promise, 
//and we would like to use this promise in the observable world to be able to use all of the tools provided by rxjs
//or to combine it with other observables

// const somePromise = new Promise((resolve, reject) => {
//   console.log('promise executed')
//   resolve("salam")
// })

// const fromObservableFromPromise$ = from(somePromise)
// fromObservableFromPromise$.subscribe({
//   next: val => console.log(val),
//   error: err => console.log('Error: ', err),
//   complete: () => console.log('completed')
// })
//the newely created observable's logic will use the 'then' method to get the resolved value and emit it as next




//3- fromEvent:  creates an observable from various event sources, it supports multiple event targets, incl 
//DOM event targets
//Node.js EventEmitter
//jQuery Events

//this is useful to create an observable which will emit events each time the user clicks on the btn, put something into a form, or resizes the window for example
//.subscribe() will work like 'addEventListener'
//.unsubscribe() will work like 'removeEventListener'

//** the observables made from 'fromEvent' never complete, just .unsubscribe() to stop receiving from them 
//** observable created using the fromEvent is hot, because the resource, the actual producer of data is placed outside of the observable itself
//** in our case the source is the DOM elements and click events emitted by it,



// const triggerBtn = document.querySelector('button#trigger')
// fromEvent<MouseEvent>(triggerBtn, "click")
// .subscribe({
//   next: event => console.log(event)
// })


// const triggerClick$ = new Observable<MouseEvent>(subscriber => {
//   const handler = event => {
//     console.log('Event handler has executed')
//     subscriber.next(event as MouseEvent)
//   }
//   triggerBtn.addEventListener('click', handler)

//   return () => {
//     triggerBtn.removeEventListener("click", handler)
//   }
// })




//4- timer:   creates an observable which will wait some time and emits a value and completes, like  setTimeout function
timer(2000)
// .subscribe({
//   next: val => console.log(val),
//   error: err => console.log('Error: ', err),
//   complete: () => console.log('completed')
// })


const timer$ = new Observable(subscriber => {
  const id = setTimeout(() => {
    console.log('timeout executed')
    subscriber.next(0)
    subscriber.complete()
  }, 2000)

  return () => {
    clearTimeout(id)
  }
})

// const subscription1 = timer$
// .subscribe({
//   next: val => console.log(val),
//   error: err => console.log('Error: ', err),
//   complete: () => console.log('completed')
// })

// setTimeout(() => {
//   subscription1.unsubscribe()
// }, 1000)



//5- interval: its similar to setInterval

// const subscription = interval(1000).subscribe({
//   next: val => console.log(val),
//   error: err => console.log('Error: ', err),
//   complete: () => console.log('completed')
// })


// setTimeout(() => {
//   console.log('unsubscribe')
//   subscription.unsubscribe()
// }, 4000)


const interval$ = new Observable<number>(subscriber => {
  const id = setInterval(() => {
    console.log('interval executed')
    subscriber.next(0)
    subscriber.complete()
  }, 2000)

  return () => {
    clearInterval(id)
  }
})
// interval$.subscribe({
//   next: val => console.log(val),
//   error: err => console.log('Error: ', err),
//   complete: () => console.log('completed')
// })


//6- forkJoin:  
//you can pass an array of observables to it, 
//underneath it will create subscriptions to all provided input obsrvables
//then it will wait for all these observables to complete, and once this happens it will emit a set of the latest values from all of them

//this can be useful if you would like to call multiple http endpoint at the same time and wait for all of them to respond before taking further direction


//for example: 
//lets say that we have 2 observables A , B which calls some http endpoints when we subscribe to them, just as it happened in ajax() 
//we would like to subscribe to both at the same time to start the http request and take some action after we receive response from both
//we can acheive this using 'forJoin' 

//** in case of error inside each of request, it emits an error
//if one of the observable emits error, whole forkJoin emits error and wont wait for other observables and unsubscribes from them

const A$ = new Observable<any>((subscriber) => {

  axios.get("https://random-data-api.com/api/name/random_name")
    .then(data => {
      subscriber.next(data.data)
      subscriber.complete()
    })
    .catch(err => {
      subscriber.error(err)
    })


  return () => {

  }
})


const B$ = new Observable<any>((subscriber) => {

  axios.get("https://random-data-api.com/api/name/random_name")
    .then(data => {
      setTimeout(() => {
        subscriber.next(data.data)
        subscriber.complete()
      }, 2000)  //simulating an error
    })
    .catch(err => {
      subscriber.error(err)
    })


  return () => {

  }
})


// A$
//   .subscribe({
//     next: val => console.log(val),
//     error: err => console.log('Error: ', err),
//     complete: () => console.log('completed')
//   })

// forkJoin([A$, B$])
//   .subscribe({
//     next: responses => console.log(responses),
//     error: err => console.log('Error: ', err),
//     complete: () => console.log('completed')
//   })




const V$ = new Observable(subscriber => {
  setTimeout(() => {
    subscriber.next('A')
    subscriber.complete()
  }, 5000)

  return () => {
    console.log('V teardown')
  }
})


const W$ = new Observable(subscriber => {
  setTimeout(() => {
    subscriber.error('failure!')
  }, 3000)

  return () => {
    console.log('W teardown')
  }
})



forkJoin([V$, W$])  //if one of the observable emits error, whole forkJoin emits error and wont wait for other observables and unsubscribes from them
// .subscribe({
//   next: responses => console.log(responses),
//   error: err => console.log('Error: ', err), 
//   complete: () => console.log('completed')
// })




//7- combineLatest: accepts an array of input observables to which it subscribes underneath, but contrary to forkJoin, combineLatest emits a new set of values
//      each time any of the input observables emits something new

//*** the combineLatest is useful if you need to keep something constantly updated and be a result of the latest values from sources which can change over time
//*** if one of the observables emits error, combineLatest emits error and unsubscribe from other observables



// example: lets say we have observable A and B
// observable A emits a value => the combineLatest wont emit anything at this point as it stil need the value from observable B
// so combineLatest need at least one value from each observable to start emitting
// then observable B emits a value, now combineLatest at this point emits an array of latestValue of A and B
// then observable A emits another value, then combineLatest at this point emits an array of latestValue of A and B
//each time any value emitted by each observable, the combineLatest emits an array of latestValue of A and B
//if one of the observable emits complete, combineLatest wont emits complete because maybe other obsrevables emits value
//if the last observable emits complete, combineLatest emits complete 


const comlat1$ = new Observable(subscriber => {
  const id = setInterval(() => {
    console.log('comlat1 interval executed')
    // subscriber.next(1)
    subscriber.error('something went wrong')
  }, 1000)

  return () => {
    console.log('comlat1 teardown')
    clearInterval(id)
  }
})

const comlat2$ = new Observable(subscriber => {
  const id = setInterval(() => {
    console.log('comlat2 interval executed')
    subscriber.next(2)
  }, 2000)

  return () => {
    console.log('comlat2 teardown')
    clearInterval(id)
  }
})

const comlat3$ = new Observable(subscriber => {
  const id = setInterval(() => {
    console.log('comlat3 interval executed')
    subscriber.next(3)
  }, 10000)

  return () => {
    console.log('comlat3 teardown')
    clearInterval(id)
  }
})


combineLatest([comlat1$, comlat2$, comlat3$])
  .subscribe({
    next: responses => console.log(responses),
    error: err => console.log('Error: ', err),
    complete: () => console.log('completed')
  })