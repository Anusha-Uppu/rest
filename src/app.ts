import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { User } from "./module";
import { Provider } from "./module";
import { Meter } from "./module";
import { readings } from "./module";
const app = express()
const port = 3000

const users:User[]=[];
app.use(express.json());
app.use(bodyParser.json());
// Return all users
app.get('/users', (req, res) => {
  res.send(users);
});

// Create a user with attributes username, password, email and fullname
app.post('/users', (req, res) => {

    console.log(req.body.username);
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
  let meter=new Meter(
    req.body.meterid,
    req.body.name,
    req.body.readings
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
app.listen(port, () => {
    console.log(`server is running on port http://localhost:${port}`)
})