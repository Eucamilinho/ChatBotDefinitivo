export default interface LeadExternal {
    sendMsg({message, phone}:{message:string, phone:string}):Promise<any>
}

// The code has been refactored to remove the object destructuring syntax. The parameters for the sendMsg method have been changed to two separate parameters instead of an object containing two properties.