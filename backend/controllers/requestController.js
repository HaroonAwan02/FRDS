import Request from "../models/Request.js";

/* create request */

export const createRequest = async(req,res)=>{
try{

const request = new Request(req.body);

await request.save();

res.json(request);

}catch(err){

console.log(err);

res.status(500).json({message:"Server error"});

}
};


/* get requests of one needy */

export const getMyRequests = async(req,res)=>{

try{

const requests = await Request.find({needyId:req.params.needyId});

res.json(requests);

}catch(err){

console.log(err);

res.status(500).json({message:"Server error"});

}

};


/* get all requests for NGO */

export const getAllRequests = async(req,res)=>{

try{

const requests = await Request.find().sort({createdAt:-1});

res.json(requests);

}catch(err){

console.log(err);

res.status(500).json({message:"Server error"});

}

};
export const approveRequest = async(req,res)=>{

try{
  const {id}=req.params;
  const updated = await Request.findByIdAndUpdate(
    id,
    {status:"approved"},
    {new:true}
  );
  res.json(updated);
}catch(error){
    res.status(500).json({message:"eroor updating status"});
}
};

