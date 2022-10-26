import { Timestamp } from "firebase/firestore";

export interface LoginDataI {
    email: string
    password: string
}

export interface UserI {
    uid: string
    role: string
    activo: boolean
    createdAt: Timestamp
    dataUser: {
        name: string
        lastname: string
        email: string | null
        adress?: {
            street: string
            num: string
            province: { nombre: string }
            departament: { nombre: string }
            location: { nombre: string, geo: { lat: number, lon: number } }
        }
        tel?: { num: string, contact: string }
        wApp?: { num: string, contact: string }
    }
}