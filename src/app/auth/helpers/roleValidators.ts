import { UserI } from "../../shared/interfaces/auth.interface";

export class RoleValidator {
    isSAdmin(user: UserI): boolean {
        return user.role === 'SADMIN';
    }

    isAdmin(user: UserI): boolean {
        return user.role === 'ADMIN';
    }

    isCliente(user: UserI): boolean {
        return user.role === 'CLIENTE';
    }
}