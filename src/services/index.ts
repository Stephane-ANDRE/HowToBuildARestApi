import crypto from "crypto"

//secret key used for hashing
const SECRET = "STEPHANE-REST-API";


//performing authentification using salt and password
export const authentification = (salt:string, password: string) => {
    // Create an HMAC (Hash-based Message Authentication Code) with SHA-256 algorithm
    // Concatenate salt and password to create the HMAC key
    return crypto.createHmac("sha256",[salt,password].join("/"))
     // Update the HMAC with the SECRET key
    .update(SECRET)
    // Generate the HMAC digest as a hexadecimal string
    .digest("hex")
}
//function to generate a random string: generate octets then transformed into characteres randomly
export const random = () => crypto.randomBytes(128).toString("base64");