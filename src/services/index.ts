import crypto from "crypto"

//secret key used for hashing
const SECRET = "process.env.SECRET";


export const random = () => crypto.randomBytes(128).toString('base64');

//performing authentification using salt and password
export const authentication = (salt:string, password: string) => {
    // Create an HMAC (Hash-based Message Authentication Code) with SHA-256 algorithm
    // Concatenate salt and password to create the HMAC key
    return crypto.createHmac("sha256",[salt,password].join("/"))
     // Update the HMAC with the SECRET key
    .update(SECRET)
    // Generate the HMAC digest as a hexadecimal string
    .digest("hex")
};
