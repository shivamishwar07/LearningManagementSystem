export interface student{
    userName:string,
    fName:string,
    email:string,
    phoneNumber:string,
    userCourse:string;
    userSub:string;
    cpassword:string;
    password:string;
    gender:string;
    dob:string;
    id:number;
}
export interface faculty{
    userName:string,
    department:string,
    email:string,
    phoneNumber:number,
    course:string;
    age:number
    cpassword:string;
    password:string;
    gender:string;
    id:number;
}
export interface Login{
    email:string,
    password:string
}