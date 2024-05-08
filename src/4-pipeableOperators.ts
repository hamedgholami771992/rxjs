// #Pipeable Obsrvables:  
//they allow us to transform the notifications emitted by an observable in countless ways
//we can filter and map the emitted values
//provide the fallback for error scenarios
//even start new inner subscription to some other observables

import { Observable, filter } from "rxjs";

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
.subscribe({
    next: item => {
        //we can use if statements to just process our own desired values, but rxjs has better tools for that
        console.log(item)
    }
})


