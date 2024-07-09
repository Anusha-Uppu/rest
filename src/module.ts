import { Exclude, Expose } from "class-transformer";
import e from "express";
export class User{
    username:string;
    password:string;
    email:string;
    fullname:string;
    id:number;
    provider?:number;
    meterid?:number;
    constructor(username:string, password:string, email:string, fullname:string,id:number){
        this.username=username;
        this.password=password;
        this.email=email;
        this.fullname=fullname;
        this.id=id;
    }
}
export class Provider{
    id:number;
    name:string;
    charge:number;
    constructor(id:number, name:string, charge:number){
        this.id=id;
        this.name=name;
        this.charge=charge;
    }
}
export class readings{
    units:number;
    date: Date;
    constructor(units:number, date:Date){
        this.units=units;
        this.date=date;
    }
}
export class Meter{
    meterid:number;
    name:string;
    readings:readings[];
    constructor(meterid:number, name:string, readings:readings[]){
        this.meterid=meterid;
        this.name=name;
        this.readings=readings;
    }
}

export class UserDTO{
   @Expose()
   username!:string;

   @Exclude()
   password!:string;

   @Expose()
   email!:string;

   @Expose()
   fullname!:string;

   @Expose()
   id!:number;

}
   
