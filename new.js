let a= 7
let arr = [1,5,6,4,-1,5,10]


let arr1=[]
    let arr2=[]
    let arr3=[]
// for(let i=0; i<a; i++){
//     if(!arr1.includes(arr[i])){
//         arr1.push(arr[i])
//     }
// }
let count =0
for(let i=0; i<arr.length; i++){
    for(let j=i; j<arr.length; j++){
        let arr1 = []
        if(i!=j){
            arr1.push(arr[i],arr[j])
            if(!arr2.includes(arr1)){
                arr2.push(arr1)
            }
            
        }
    }
}

for(let i=0; i<arr2.length; i++){
    if(arr.includes(arr2[i][0] + arr2[i][1])){
        if(!arr3.includes(arr2[i])  && !arr3.includes(arr2[i].reverse())){
            count++
            console.log ()
            arr3.push(arr2[i])
        }
    }
}
console.log ( arr2,count,arr3)