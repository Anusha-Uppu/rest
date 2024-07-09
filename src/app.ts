import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { User, UserDTO } from "./module";
import { Provider } from "./module";
import { Meter } from "./module";
import { readings } from "./module";
import { plainToClass } from "class-transformer";
import rateLimit from "express-rate-limit";

const app = express()
const port = 3000

const users:User[]=[];
app.use(express.json());
app.use(bodyParser.json());
const rateLimiter=rateLimit({
  windowMs:1 * 60 * 1000,
  max:5,
  message:'too many requests',
 
})
app.use(rateLimiter);
const basicAuth=require('express-basic-auth');
// const protect=basicAuth({
//   users: {'admin':'1'},
//   challenge:true
// })

// const credentials='admin:1';
// const encoded=basicAuth(credentials)
// const user='admin';
// const key='1';
// const auth=basicAuth('apikey', 1);

// const headers={ 'Authorization':f'Basic {user}:{key}'}
// Return all users
app.get('/users', (req, res) => {
  console.log(req.body.page);
  console.log(req.body.limit);
  const page=Number(req.body.page);
  const limit=Number(req.body.limit);
  console.log(users);
  const starIndex=(page-1)*limit;
  const endIndex=page*limit;
  const resultUsers=users.slice(starIndex,endIndex);
  console.log('page :'+page +'limit: '+limit);
  console.log(resultUsers);
  const authHeader=req.headers['authorization'];
 
  if(authHeader==='Bearer 1'){

    console.log("resultusers"+resultUsers);
    const result:UserDTO[]=[];
    for(let i=0;i<resultUsers.length;i++){
      let UserDTO1=plainToClass(UserDTO, resultUsers[i], {excludeExtraneousValues:true})
      result.push(UserDTO1);
    }
    res.json(result);
  }
  else{
    res.send('user not found');
  }
  
  
});

// app.get('/users', (req, res) => {
//   res.send(users);
// });

// Create a user with attributes username, password, email and fullname
app.post('/users', (req, res) => {
  
    let user:User=new User(
       req.body.username,
      req.body.password,
        req.body.email,
        req.body.fullname,
        req.body.id
    )
    users.push(user)
    res.send('hello'+user)
    // use req.body
});

// Return a user with parameter id if not exists return message saying `user not found`
app.get('/users/:id', (req, res) => {
    const id=req.params.id;
   
  const user=users.find((item:any)=>item.id == id)
  console.log('id',id);
  if(!user){
    res.send('user not found');
  }
  else{
    res.send(user);
  }
 
});


// update user information for given id 
app.put('/users/:id', (req, res) => {
    // req.params.id
    const id=req.params.id;
    const user=users.find((item:any)=> item.id == id)
    if(!user){res.send('user not found')}
    else{
        if(req.body.username){user.username=req.body.username}
        if(req.body.email){user.email=req.body.email}
        if(req.body.password){user.password=req.body.password}
        if(req.body.fullname){user.fullname=req.body.fullname}
        if(req.body.id){user.id=req.body.id}
        res.json(user)
        res.send('successfully updated');
    }
    

});


// delete user for given id
app.delete('/users/:id', (req, res) => {
    // req.params.id
    const id=req.params.id;
    const user=users.findIndex((item:any)=> item.id == id);
    if(user==-1){
        res.send('user not found');
    }
   users.splice(user,1);
   res.send(users);
});

//providers
let providers:Provider[]=[];
app.get('/providers',(req,res)=>{
  res.send(providers);
})

app.post('/providers', (req, res) => {

  console.log(req.body.name);
  let provider:Provider=new Provider(
     req.body.id,
     req.body.name,
     req.body.charge
  )
  providers.push(provider)
  res.send('hello'+provider)
  
});

app.get('/providers/:id', (req, res) => {
  const id=req.params.id;
 
const provider=providers.find((item:any)=>item.id == id)
console.log('id',id);
if(!provider){
  res.send('user not found');
}
else{
  res.send(provider);
}

});

app.put('/providers/:id', (req, res) => {
  // req.params.id
  const id=req.params.id;
  const provider=providers.find((item:any)=> item.id == id)
  if(!provider){res.send('user not found')}
  else{
      if(req.body.id){provider.id=req.body.id}
      if(req.body.name){provider.name=req.body.name}
      if(req.body.charge){provider.charge=req.body.charge}
      res.json(provider)
      res.send('successfully updated');
  }
  

});

app.delete('/providers/:id', (req, res) => {
  // req.params.id
  const id=req.params.id;
  const provider=providers.findIndex((item:any)=> item.id == id);
  if(provider==-1){
      res.send('user not found');
  }
 users.splice(provider,1);
 res.send(providers);
});

//task-3
app.put('/subscribe', (req,res)=>{
  const userid=req.body.userid;
  const providerid=req.body.providerid;
  const user=users.find((item:any)=> item.id==userid);
  if(!user){
    res.send('user not found');
  }
  else{
    if(req.body.providerid){user.provider=req.body.providerid}
    res.json(user)
    // res.send(`${userid}`+'successfully subscribed to'+`${providerid}`)
  }
})
//task-4
let meters:Meter[]=[];
app.get('/meters',(req,res)=>{
   res.send(meters);
}) 

app.post('/meters',(req,res)=>{
  const units:readings[]=req.body.readings;
 
  let meter=new Meter(
    req.body.meterid,
    req.body.name,
    units
  )
  meters.push(meter);
  res.send('meter successfully created')
})

app.get('/meters/:id',(req,res)=>{
  const id=req.params.id;
  const meter=meters.find((item:any)=>item.meterid==id)
  if(!meter){res.send('meter not found')}
  else{res.send(meter.readings)}
})
//task -5
app.put('/users',(req,res)=>{
  const userid=req.body.userid;
  const meterid=req.body.meterid;
console.log("yes");
  const user=users.find((item:any)=> item.id==userid);
  if(!user){res.send('user not found')}
  else{
    if(req.body.meterid){user.meterid=req.body.meterid}
    res.json(user);
    // res.send('succussfully updated');
  }
})
app.get('/readings/:id',(req,res)=>{
  const userid=req.params.id;
  const user=users.find((item:any)=> item.id==userid);
  if(!user){res.send('user not found')}
  else{
    const meterid=user.meterid;
    if(!meterid){res.send('user didnot selected the meter yet')}
    else{
      const meter=meters.find((item:any)=>item.id=meterid);
      if(meter?.readings){
        const value=meter.readings;
        let total:number=0;
        value.forEach(element=>{
         total+=Number(element.units);
        })
        res.send('total readings'+total)
      }
      // res.send(meter?.readings)
    }
    
  }
})
app.get('/bill/:id',(req,res)=>{
  const userid=req.params.id;
  const user=users.find((item:any)=> item.id==userid);
  if(!user){res.send('user not found')}
  else{
    const meterid=user.meterid;
    if(!meterid){res.send('user didnot selected the meter yet')}
    else{
      const meter=meters.find((item:any)=>item.id=meterid);
      if(meter?.readings){
        const value=meter.readings;
        let total:number=0;
        value.forEach(element=>{
         total+=Number(element.units);
        })
        const providerid=user.provider;
        if(providerid){
          const provider=providers.find((item:any)=>item.id=providerid)
          const cost=provider?.charge;
          if(cost){
            res.send('bill'+total*cost);
          }
          else{
            res.send('provider doesnot found');
          }
        }
        else{
          res.send('user not subscribed to any provider')
        }
      }
      // res.send(meter?.readings)
    }
    
  }
})


// consumption of past
app.get('/users/:id/consumption/:time', (req, res) => {
  const current=Date();
  const date=new Date();
  let consumption=0;
  console.log('current date'+current);
  console.log(date);
  const no_of_days=Number( req.params.time);
  const user_id=req.params.id;
  const user=users.find((item:any)=>item.id=user_id);
  if(!user){
    res.send('user not found');
  }
  const meter_id=user?.meterid;
  if(!meter_id){
    res.send('user didnot any meter');
  }
  if(meter_id){
    const meter=meters.find((item:any)=>item.meterid=meter_id);
    if(!meter){
      res.send('meter is not found, check the available meters');
    }
    const readings=meter?.readings;
    if(readings){
      let c=0;
     for(let i=readings.length-1;i>=0;i--){
      console.log('anu I am in for loop'+readings[i].date);
      const read=new Date(readings[i].date);
      console.log(typeof readings[i].date)
      if(read.getMonth()==date.getMonth() && c<no_of_days){
          c++;
          console.log("yes entered in the for loop"+c);
        consumption+=Number(readings[i].units);
      }
     }
     res.send('total consumption in'+no_of_days+"is"+consumption);
    }
  }
});
//new bill
app.get('/user/:id/bill/:month',(req,res)=>{
   let total=0;
   let result=0;
   const user_id=req.params.id;
   const month=Number(req.params.month);
   const user=users.find((item:User)=> item.id= Number(user_id));
   if(!user){ res.send('user not found')}
   const meter_id=user?.meterid;
   if(meter_id){
    const meter=meters.find((item:any)=> item.meterid=meter_id);
    const readings=meter?.readings;
    if(readings){
      for(let i=0;i<readings.length;i++){
        if(new Date(readings[i].date).getMonth()==month){
           total+=Number(readings[i].units);
        }
      }
    }
    const provider_id=user.provider;
    const provider=providers.find((item:any)=>item.id=provider_id);
    if(provider){
     const charge=provider.charge;
      result=total*charge;
    }
    res.send('bill is'+result);
   }
})
//top 3 providers

app.get('/bestproviders',(req,res)=>{
  providers.sort((a,b) => a.charge-b.charge )
  console.log(providers);
  let result:Provider[]=[];
  let c:number=0;
  for(let i=0;i<providers.length;i++){
    if(i<3){
      c++;
      result.push(providers[i]);
    }
  }
  res.send(result);
})

// new Date(readings[i].date)== new Date(date.setDate(date.getDate()-c)
app.get('/users/id/consumption',(req,res)=>{
   const current=Date();
   console.log('current date'+current);
   res.send('success');
})
app.listen(port, () => {
    console.log(`server is running on port http://localhost:${port}`)
})


//curl -X POST http://localhost:3000/meters -H "Content-Type:application/json" 
//-d '{"meterid":"1","name":"af12","readings":[{"units":"100","date":"2024-06-15"},
//{"units":"134","date":"2024-06-16"},{"units":"124","date":"22024-06-17"},
//{"units":"65","date":"2024-06-18"},{"units":"28","date":"2024-06-19"}]}'
//curl -X POST http://localhost:3000/users -H "Content-Type:application/json"
// -d '{"username":"Anu","password":"Anusha@123","email":"uppuanusha3@gmail.com","fullname":"Anusha Uppu","id":"1"}'
//curl -X PUT http://localhost:3000/users -H "Content-Type:application/json" -d '{"userid":"1","meterid":"1"}'

//curl -X GET http://localhost:3000/users/1/consumption/7