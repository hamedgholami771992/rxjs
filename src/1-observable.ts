//#stream:
// whats a stream:
// the data can come at various points of time and the number of emitted values might ne theoretically infinite

import { Observable, Observer } from "rxjs";

//the items in a stream can come at various points of time, 
//lets imagin we entered a grocry store and we go further and see some products
//first we see a lemon, we can react somehow to it or not. we can take this lemon and put it into our shopping basket if it was on our shopping-list
//then we move further, time passes
//we see a coconut, we can take it or not, we take the action at the time we see this product
//later we might find an onion, again we can do something with it or not
//and even later, we could see a mushroom, and of course, this kind of mushroom shouldnt be found in the store, so if something like this happen, we might react to it by calling the store manager
//if we would go further, there might or might not be more products that we will see
//if we would like to name this stream, we could say its a stream of products
//each time we enter the grocery store, we would notice different products at different points of time


//As you can see, the stream approach is more about reacting to the things as they show up, 
//we dont know the nest value and whether it will appear at all, we just provide some code which will react to the emitted datain case it shows up
//this approach is called reactive programming, and the observables are based around this idea


//some other examples

//1- we might have a stream, which would emit the latest mouse position every time it changes

//2- we might have a streaem representing the latest value of the text input data

//3- when we send a request to some server, we have to wait some time and then response will come
// --------------------------------------------------------------------------------------


//#observable
//the idea aroud an observable is very simple, its based around a single callback function with a set of rules and guarantees regarding the interface and behavior
//in short, once the observables is executed, it can emit some notifications, and there are 3 types of notifications [next, error, complete]
//next notification allows us to emit values
//let have a look at the code below
const observable$ = new Observable(subscriber => {
  subscriber.next('Alice')
  subscriber.next('Ben')
})
//**** we pass the logic of the observable as a callback function



//#observer
//lets see how an observer object might looks like
const observer = {
  next: value => console.log(value)
}
//notice that 'next' is used in both, our Observer object and the Observable's logic 
//the next function in the Observer provides the behavior for the next notifications emitted by the Observable

//now how we can connect our Observer to our Observable
//the observable on its own does not run any code, its just a special object which has some callback function stored inside 
//the observer just describes the reaction to each emitted value
//we need to somehow run the callback inside this observable and pass our observer to it to make it work


//#Subscription
//the subscription is what executes the observable, it runs the callback inside the observable and passes our observer object to it
//each observable exposes the subscribe method, so to start a new subscription we simply call the .subscribe() on the observable
//and we can pass the obserevr as an argument
observable$.subscribe(observer)



//lets see what would happen if we run the code that we have on the screen right now
// 1- .subscribe() gets called on our observable => new subscription is made =>  which means that the callback in the Observable run 
// 2- which means that the callback in the Observable run => with the provided Observer converted into a subscriber object   // Observer ===> subscriber
// 3- each time the next method is used on the subscriber, the next handler of our Observer is called 
// 4- and our Observer just console.log each emitted value
// ---------------------------------------------------------

// **the observable does not do anything by itself, it just has some logic inside and we need to subscribe to it to make it work
//this creates a new subscription, which we executes the Observable with the provided Observer
//so each time a next notification is emitted by the Observable, the next callback is run on the Observer
//and this would go on and on as long as the subscription is active


//closing a subscription
//***its imporatnt to make sure that the subscriptions that we dont use anymore, are closed, 
//so they wont cause any unwanted side effects or memory leaks
//the subscription can end in a few ways
//1- it can get closed automatically by the Observable's logic itself by emitting "error" | "complete" notifications 
//2- we can cancel the subscription on our own by unsubscribing,
//   unsubscribing can be compared to saying: "I dont want to receive any more data"
//   and this can be acheived by calling .unsubscribe() on the subscribtion
//*** subscribtion is the returned value of .subscribe() on the observable



const observable1$ = new Observable<string>(subsriber => {
  console.log('Observable executed')
  subsriber.next('Hamed')
  setTimeout(() => subsriber.next('Ali'), 2000)
  setTimeout(() => { subsriber.next('Asghar') }, 4000)
})

//observable1$.subscribe()  //observable will be executed but we are not doing with the emitted values


const oberver = {
  next: value => console.log(value)
}


observable1$.subscribe(observer)
observable1$.subscribe(observer)  //
//***when we subscribe, our observer gets wrapped into a subscriber object 
//and this is done to provide some of the Observable interface guarantees like 
// not delivering notifications after the subscribtion gets closed
// providing default handlers for the notification types which are not covered by observer  
//to put it in a simple way, its a transparent step which makes the observables more predictable and easier to use
//and thats done automatically by rxjs, so we dont need to worry about that step



//const subscribtion = observable1$.subscribe(val => console.log('last subscibtion =>', val))    //instead of passing oberver object containing several handlers, we can pass just a callback as a next handler
//subscribtion.unsubscribe()  //the subscribtion gets closed before the setTimeout gets executed and returned to the oberver, but it will be executed behind the scene
//*** but we should cancel the remaining setTimeout in the observable logic after unsubscribing, because we dont want side-effects and memory-leaks */


//if we call .subscribe() for the same observer on the same observable, the logic will be executed multiple times independently

//notifications
//1- next ---> emits value(s) to the subscriber, can be called infinit amount of times 
//2- complete --> indicates that observable's logic execution for a subscriber is finished and no more values get emitted
//3- error --> indicates that observable's logic execution for a subscriber is ended because of an error
//*** if some unhandled error would happen inside of the observable, it would automatically emitted as an error notification
//*** subscribtion gets closed in case of error/complete notification, so no more values can get emitted to subscriber




//#Subscribtion lifecycle
//** any notification emitted inside the obervable's logic will be passed as an argument to its corresponding handler on the subscriber|observer obj
//** if error|complete notification gets emitted, subscribtion gets closed, and teardown logic provided by observer will be run,
//     in this optional teardown logic, the observable can clean up after itself, 
//         it can release the resources it was using
//         cancel timers or intervals
//         close a connection to the server if that was the source of the observable

//**  there might be some observables which never complete or error, like an infinit interval counter  ===> so the only reason for ending the subscribtion is calling .unsubscribe() on the subscribtion
//1- notEmittingObservable
const notEmittingObservable$ = new Observable((subscriber) => {
  console.log('notEmittingObservable  executed')
})

const subscribtion1 = notEmittingObservable$.subscribe({
  next: val => { console.log('notEmittingObservable   subscriber   value: ', val) }
})

//2- singleEmittingObsevable
const singleEmittingObsevable$ = new Observable<string>((subscriber) => {    //in this case: subscribing into observable and running the observable and receving values inside subscriber is a sync task
  console.log('singleEmittingObsevable  executed')
  subscriber.next('hello, by')
  subscriber.complete()  //if we dont call complete(), the subscribtion wont get completed and ended

  return () => {  //teardown logic which is executed on the subscribtion end,  is useful for clean-up logic, for cancelling timeout and releasing resources
    console.log('singleEmittingObsevable  teardown')
  }
})

console.log('Before singleEmittingObsevable\'s subscribtion')
const subscribtion2 = singleEmittingObsevable$.subscribe({
  next: val => { console.log('singleEmittingObsevable   subscriber   value: ', val) },
  complete: () => console.log('singleEmittingObsevable   subscriber  completed')
})
console.log('After singleEmittingObsevable\'s subscribtion')


//3- multipleEmittingObsevable
const multipleEmittingObsevable$ = new Observable<string>((subscriber) => {
  console.log('multipleEmittingObsevable  executed')
  subscriber.next("1")   //"1", "2" gets emitted sync
  subscriber.next("2")
  setTimeout(() => subscriber.error(new Error('something is wrong')), 2000)  //"3" gets emitted async
  setTimeout(() => {  //any value emitted after error|completed will be ignored, becau
    subscriber.next("3")
    subscriber.complete()
  }, 4000)  

  return () => {
    console.log('multipleEmittingObsevable  teardown')
    subscriber.next('4')
  }
})
const subscribtion3 = multipleEmittingObsevable$.subscribe({
  next: val => { console.log('multipleEmittingObsevable   subscriber   value: ', val) },
  complete: () => console.log('multipleEmittingObsevable   subscriber  completed'),
  error: (err) =>  console.log('multipleEmittingObsevable   subscriber  err: ', err),
})
//**** after ending the subscribtion in case of error|complete, no more values will passed to the observer,
//this happens because the intermediate subscriber object, created automatically by rxjs, checks whether the subscribtion is still alive before passing the notifications
//so this subscriber object works like a safety fuse and ensures that observables and subscribtions always work in a way that we designed, which means no notification after subscribtion ends



//4- cancellingObsevable
const cancellingObsevable$ = new Observable<string>((subscriber) => {
  console.log('cancellingObsevable  executed')
  const id = setInterval(() => {
    console.log('cancellingObsevable  interval execution')
    subscriber.next("salam")
  }, 1000)


  return () => {
    console.log('cancellingObsevable  teardown')
    clearInterval(id)  //if we dont clear setInterval, the task will be continued being executed for ever
  }
})
const subscribtion4 = cancellingObsevable$.subscribe({
  next: val => { console.log('cancellingObsevable   subscriber   value: ', val) },
  complete: () => console.log('cancellingObsevable   subscriber  completed'),
  error: (err) =>  console.log('cancellingObsevable   subscriber  err: ', err),
})
setTimeout(() => {
  subscribtion4.unsubscribe()

}, 2000)