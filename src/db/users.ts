import mongoose from "mongoose";

// setting up UserSchema
const UserSchema = new mongoose.Schema({
    username: {type: String, required: true},
    email: {type: String, required:true},
    authentication: {
        password:{type: String, required:true, select:false},
        salt:{type:String, selected:false},
        sessionToken:{type:String, select:false},
    },
});

export const UserModel = mongoose.model("User", UserSchema);

//method to find All users
export const getUsers = () => UserModel.find();

//method to find One user By Email
export const getUserByEmail = (email:string) => UserModel.findOne({email});

//method to find One user By his Session
export const getUserBySessionToken = (sessionToken:string) => UserModel.findOne({
    "authentication.sessionToken": sessionToken,
});

//method to find One user By Id
export const getUserById = (id:string) => UserModel.findById(id);

//method to create a New user
export const createUser = (values:Record<string,any>) => new UserModel(values)
 // Once the user is saved successfully, convert the user to a plain JavaScript object and return it
.save().then((user)=>user.toObject());
/*export const createUser = async (values: Record<string, any>) => {
    const user = new UserModel(values);
    await user.save();
    return user.toObject();
}; */ 

//method to delete One user
export const deleteUserById = (id:string) => UserModel.findOneAndDelete({_id:id});

//method to update One user
export const updateUserById = (id:string, values:Record<string, any>) =>UserModel.findByIdAndUpdate(id, values)