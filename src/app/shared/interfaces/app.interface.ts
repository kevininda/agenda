export interface clienteI {
    uid?: string
    nombre: string
    apellido: string
    sucursales: sucursalI[]
    email: string
    wapp: string
}

interface sucursalI {
    nombre: string
    calle: string
    num: string
    localidad: string
    provincia?: string
    observacion?: string
    geo?: { lat: string, lng: string }
}


////////////// Reservas Collection

interface reservaI {
    id?: string
    fecha: number //Fecha donde se realizó la reserva.
    cliente: string
    reserva: {
        suc: sucursalI
        dia: number
        turno: string
    }


}