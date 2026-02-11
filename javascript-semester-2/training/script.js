/*
const logHello1 = function () {
  console.log("Hello");
}

logHello1();


const logHello = () => {
  console.log("Hello World!")
}

logHello()


const sum = (a, b) => {
  console.log(a + b)

}

sum(3, 5)


const actionBefore = () => {
  console.log("Action Before")
}

const actionAfter = () => {
  console.log("Action After")
}


const logMassage = (actionBefore, actionAfter) => {
  actionBefore()
  console.log("что-то")
  actionAfter()
}

logMassage(actionBefore, actionAfter)

const validate = (hasAccess) => {
  if (hasAccess) {
    console.log(hasAccess)
  } else {
    console.log(!hasAccess)
  }
}

validate(false)


const user = {
  password: "123456",
  name: "John",
}

user.hasAccess = true;
user.name = "Ann"
delete user.password
console.log(user.name)
console.log(user.password)
console.log(user['hasAccess'])






const obj1 = {name: "John"};
const obj2 = obj1
console.log(obj2)

*/

/*
const object1 = {
  name: "John",
  age: 5,
}

const object2 = {
  name: "John",
  age: 5,
}


const areObjectsEqual = (object1, object2) => {
  const keys1 = Object.keys(object1)
  const keys2 = Object.keys(object2)

  if (keys1.length !== keys2.length) {
    return false
  }


  for (const key in object1) {
    const value1 = object1[key]
    const value2 = object2[key]

    const areValueObjects = typeof value1 === 'object' && value1 === 'object'


    if (areValueObjects) {
      return areObjectsEqual(value1, value2)
    }
    if (value1 !== value2) {
      return false
    }
    return true

  }
}

console.log(areObjectsEqual(object1, object2))*/


/*const object1 = {
  name: 'John', height: '180cm', Intelligence: '100iq'
}

const object2 = {}

for (const key in object1) {
  object2[key] = object1[key]
}

object2.width = '180cm'

console.log(object2)

const object3 = Object.assign({}, object2)

const object4 = {...object1}*/


const guest1 = {
  name: 'John',
  height: '180cm',
  Intelligence: '100iq',
  orderInfo: {
    room: 394, 
    stayDates: {
      from: 3, 
      to: 3,
    }
  }
}


const guest2 = {
  name: 'Ann',
  height: '148cm',
}

// const logGuestInfo = (guest) => {
//   console.log(`
//     Name:  ${guest.name}
//     height: ${guest.height}
//     To: ${guest.orderInfo?.stayDates?.to ?? `none`}
//     `)
// }
//
// logGuestInfo(guest1)
// logGuestInfo(guest2)

const  {
  Intelligence,
  height,
  name,
} = guest1

console.log(name)
console.log(height)
console.log(Intelligence)