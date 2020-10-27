import validator from "validator";
import {UserRegisterInput} from "../entity/input/UserRegister";
import crypto from 'crypto'
import {MutationError} from "../entity/interfaces/IMutationResponse";

export const validateRegister = (data: UserRegisterInput): MutationError[] => {
    const errors: MutationError[] = []
    if (data.age < 10 || data.age > 108) {
        errors.push({msg: "Edad debe estar entre 10 y 107 anios!", path: "age"})
    }
    if (validator.isEmpty(data.email) || !validator.isEmail(data.email)) {
        errors.push({msg: "No es un email valido!", path: "email"})
    }
    if (validator.isEmpty(data.name) || !validator.isLength(data.name, {min: 10, max: 100})) {
        errors.push({msg: "Tu nombre debe tener entre 10 y 100 caracteres!", path: "name"})
    }
    if (validator.isEmpty(data.password) || !validator.isLength(data.password, {min: 5, max: 30})) {
        errors.push({msg: "La contrasena debe tener entre 5 y 30 caracteres!", path: "password"})
    }
    return errors
}

export const getEncryptedCredentials = (password: string): { password: string, salt: string } => {
    const salt = crypto.randomBytes(16).toString('base64')
    const encryptedPassword = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha1')
        .toString('base64')
    return {salt, password: encryptedPassword}
}

interface IVerifyPassword {
    inputPassword: string,
    encryptedPassword: string,
    salt: string
}
export const verifyPassword = ({inputPassword, encryptedPassword, salt}: IVerifyPassword) : boolean  => {
    const encryptedInputPass = crypto.pbkdf2Sync(inputPassword, salt, 10000, 64, 'sha1')
        .toString('base64')
    console.log({inputPassword, encryptedInputPass, encryptedPassword})
    return encryptedPassword === encryptedInputPass
}
