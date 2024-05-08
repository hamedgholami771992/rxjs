// #Pipeable Obsrvables:  
//they allow us to transform the notifications emitted by an observable in countless ways
//we can filter and map the emitted values
//provide the fallback for error scenarios
//even start new inner subscription to some other observables

import { EMPTY, Observable, catchError, debounceTime, filter, fromEvent, map, of, tap } from "rxjs";

//in other words, 
// the pipeable operators enables us to write complex async logic with just a few lines of code, 
// making it easy to read and work with




//1- filter: filters the emitted values and passes them through or not
//2- map: takes the emitted values and can transform them into some other values
//3- tap: allows us to cause side effects without changing the notifications, 
//      its useful for debugging and learning purposes, for example we can log the emitted values at any stage of the pipeline of operators if we use multiple operators stacked

//4- debounceTime: is useful if the source obsrevable emits lots of values and settles down, this is often used with that input from the user
// an example can be a scenario in which the user types in some value into an input field and recalculations triggered by each keystroke takes some time and are slow
//   by using this operator, we can debounce the events coming from the input and let the user type in the values without slow-down
//   then after the user stops typing, their recalculation code would be triggered only once

//pipeable operators can use a completely new observable as its output, and an example of that is the "CatchError" operator

//5- catchError:  error notification emitted by the source observable, this operator will not pass this error through but instead 
//            it will use provided fallback observable as the new source




//6- concat/switch/mergeMap:  they take the emitted value and map it into another observable 


//-----------------------------------------------------------------------------
//SOURCE_OBSERVABLE ==> pipe_operator_A ==> pipe_operator_B => ... => OBSERVABLE


//1- filter: if a value emitted by the source, this operator will either pass it thorugh to the output, or not based on the condition that we provide to it

//how filter affect each notification:
//1- next:  for each emitted value filter can act in 2 ways, it can either pass the value further if it meets the condition provided by us to the filter operator
//              and if it doesnt, the value wont be re-emitted further
//****  the filter affect the next notifications only so error will always emitted

//2- error: will always be re-emitted further unchanged
//3- complete: will always be re-emitted further unchanged


interface NewsItem {
  category: "Business" | "Sports",
  content: string
}

const newsFeed$ = new Observable<NewsItem>(subscriber => {
  console.log('newsFeed observable excuted')
  const id1 = setTimeout(() => subscriber.next({ category: "Business", content: "A" }), 1000)
  const id2 = setTimeout(() => subscriber.next({ category: "Sports", content: "B" }), 3000)
  const id3 = setTimeout(() => subscriber.next({ category: "Business", content: "C" }), 4000)
  const id4 = setTimeout(() => subscriber.next({ category: "Sports", content: "D" }), 6000)
  const id5 = setTimeout(() => subscriber.next({ category: "Business", content: "E" }), 7000)
  const id6 = setTimeout(() => subscriber.next({ category: "Sports", content: "F" }), 10000)
  const id7 = setTimeout(() => subscriber.next({ category: "Business", content: "G" }), 12000)

  return () => {
    console.log('newsFeed observable teardown')
    clearInterval(id1)
    clearInterval(id2)
    clearInterval(id3)
    clearInterval(id4)
    clearInterval(id5)
    clearInterval(id6)
    clearInterval(id7)
  }
})


// newsFeed$
// .subscribe({
//     next: item => {
//         //we can use if statements to just process our own desired values, but rxjs has better tools for that
//     }
// })




newsFeed$
  .pipe(  //allows to provide the pipeable operators we want to apply here and will connect all these operators together and returns the final output observable
    filter(item => item.category === "Sports")
  )
// .subscribe({
//     next: item => {
//         console.log(item)
//     }
// })


const sportsNewsFeed$ = newsFeed$
  .pipe(  //allows to provide the pipeable operators we want to apply here and will connect all these operators together and returns the final output observable
    filter(item => item.category === "Sports")
  )



//2- map:  for each emitted value, the map can provide a new value, 
//    like filter operator, the map operator is not interested in the error|complete notifications which are also re-emitted to the output-observable unchanged

const mapSource$ = new Observable<number>(subscriber => {
  for (const val of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
    subscriber.next(val)
  }
  subscriber.complete()
})

const doubledOutputObservable = mapSource$
  .pipe(
    map((val, index) => val * 2)
  )

doubledOutputObservable
// .subscribe({
//   next: item => {
//     console.log(item)
//   }
// })




//3- tap:  works like a spy and allows us to cause some side effects without interacting with the notifications
//its useful if we have multiple operators stocked and we would like to observe the notifications at any stage of this operator's pipeline, for example console.logs them
//** it doesnt notifications in anyways => all the notifications will be re-emitted to the output observable unchanged
//** it just allows us to do side-effect on each notification

of(1,2,3,4,5,6,7,8,9,10)
.pipe(
  filter(val => val > 5),
  tap({
    next: val => console.log('spy: ', val),
    complete: () => console.log('spy complete'),
    error: (err) => console.log('err: ', err)
  }),
  map(val => val*2),

)
// .subscribe(val => console.log('Output: ', val))


//4- debounceTime:  introduces the time dimension, its about the debouncing the incoming values,
// if we provide 2 seconds as the debounced time and our source observable emits quickly 3 values, 
//  the debouncedTime operators wait for the emissions to settle down, and after 2 seconds of no new emissions, it would emit just the latest value

//** this is useful to avoid putting excessive pressure on some calculation logic to avoid performance issues,
//     for example, to reduce the frequency of HTTP requests sent to the server

// error|complete notifications are delayed and are passed through immediately

//example: lets have some notifications coming from observer A through debouncedTime operator(2 sec)
//A emits a value x-1, the debounced-time operator gets the value and wait for 2 secs, if no more value gets emitted, x-1 will emitted at the later 2-secs
//if A emits a value x-2 after 1 seconds the x-1 received by debouncedTime operator, debouncedTime operator will forget the x-1 and wait for another 2-sec
//if no other value gets emitted in this 2 secs, x-2 will emitted through debouncedTime operator


// const sliderInput = document.querySelector('input#slider')

// fromEvent(sliderInput, "input")
// .pipe(
//   debounceTime(2000),
//   map(event => event.target["value"])
// )
// .subscribe(val => console.log(val))



//5- catchError: it can be used to provide the fallback source in case the original source fails and emits error, 
//        so this wont change complete|next notifications., it will just pass them through unchanged

//if the source observable emits an error, this operator wont emit that error, 
// instead it use the fallback observable and create an inner subscription to fallback-observable
//at this point, everything that gets emitted by this fallback-observable will passed to the output, including an error|complete notifications
  // so if the fallback-observable emits error, it will be the final error ending the main subscription
  


//******** any time an error gets emitted, and not handled by the subscriber with registering handler for that, it cause crashing the app

const failingHttpRequest$ = new Observable(subscriber => {
  setTimeout(() => {
    subscriber.error(new Error('Timeout'))
  }, 3000)
})

failingHttpRequest$
.pipe(
  catchError(error => of('fallback value'))   
  //when an error is emitted, catchError catches it, 
  // runs the func we provided, then it subscribes to the observable returned by this function
  //anything emitted by this observable returned by this function, will passed to the next operator
)
// .subscribe(val => console.log(val))



//6- EMPTY:  sometimes we dont want to provide any fallback value if something fails, but instead we want to catch the error and not show anything
// once you subscrine to it, it doesnt emit any values, it will immediately complete instead
// this complete notification will be emitted to the observer and cause the finishing the subscription

// this is useful if you want to hide the error from your observer, but dont want to provide the fallback value

failingHttpRequest$
.pipe(
  catchError(error => EMPTY)     //it catches errors and emits complete
)
.subscribe({
  next: val => console.log(val),
  complete: () => console.log('complete'),
  error: (err) => console.log('Error: ', err)
})




//7- Flatening Operators: they acts like catchError operator but they catch only next notifications and return an observable which act on those next values
// these operators include
  //concatMap
  //switchMap
  //mergeMap
  //exhaustMap
  //these differ in the way how they handle concurrency, however the genral idea is the same

  //*** concatMap is the safest choice if you dont know which one to choose

//these operators creates new inner subscription to the provided observables generated based on the value received from the source
//then they pass the emitted values from those inner subscription to the output

//an example: 
// the source observable might be the search query input emitting text values
// anytime the user changes it, the flattening operators will send a request to the server with that query  
// and the response will be emitted to the output  
//**** if the source observable emit complete|error, it will re-emit them to the output  

//05-09
