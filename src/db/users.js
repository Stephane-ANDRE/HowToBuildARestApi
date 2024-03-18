"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.deleteUser = exports.createUser = exports.getUserById = exports.getUserBySessionToken = exports.getUserByEmail = exports.getUsers = exports.UserModel = void 0;
var mongoose_1 = require("mongoose");
// setting up UserSchema
var UserSchema = new mongoose_1.default.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    authentification: {
        password: { type: String, required: true, select: false },
        salt: { type: String, selected: false },
        sessionToken: { type: String, select: false },
    },
});
exports.UserModel = mongoose_1.default.model("User", UserSchema);
//method to find All users
var getUsers = function () { return exports.UserModel.find(); };
exports.getUsers = getUsers;
//method to find One user By Email
var getUserByEmail = function (email) { return exports.UserModel.findOne({ email: email }); };
exports.getUserByEmail = getUserByEmail;
//method to find One user By his Session
var getUserBySessionToken = function (sessionToken) { return exports.UserModel.findOne({
    "authentification.sessionToken": sessionToken,
}); };
exports.getUserBySessionToken = getUserBySessionToken;
//method to find One user By Id
var getUserById = function (id) { return exports.UserModel.findById(id); };
exports.getUserById = getUserById;
//method to create a New user
var createUser = function (values) { return new exports.UserModel(values)
    // Once the user is saved successfully, convert the user to a plain JavaScript object and return it
    .save().then(function (user) { return user.toObject(); }); };
exports.createUser = createUser;
/*export const createUser = async (values: Record<string, any>) => {
    const user = new UserModel(values);
    await user.save();
    return user.toObject();
}; */
//method to delete One user
var deleteUser = function (id) { return exports.UserModel.findOneAndDelete({ _id: id }); };
exports.deleteUser = deleteUser;
//method to update One user
var updateUser = function (id, values) { return exports.UserModel.findByIdAndUpdate(id, values); };
exports.updateUser = updateUser;
