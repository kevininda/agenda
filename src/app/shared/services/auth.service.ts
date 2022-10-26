import { Injectable } from '@angular/core';
import { Auth, AuthError, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, user, UserCredential } from '@angular/fire/auth';
import { collection, collectionData, doc, docData, Firestore, orderBy, query, setDoc, Timestamp } from '@angular/fire/firestore';
import { sendPasswordResetEmail, User } from 'firebase/auth';
import { EMPTY, Observable, of, switchMap } from 'rxjs';
import { RoleValidator } from '../../auth/helpers/roleValidators';
import { LoginDataI, UserI } from '../interfaces/auth.interface';

interface userDataI {
  name: string,
  lastname: string,
  role: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService extends RoleValidator {

  public user$: Observable<UserI | null> = EMPTY;

  constructor(private readonly _auth: Auth, private readonly _fs: Firestore) {
    super();
    this.user$ = user(_auth).pipe(
      switchMap((user: User | null) =>
        user
          ? this._getUserByUid(user.uid)
          : of(null)
      )
    );
  }

  login({ email, password }: LoginDataI): Promise<UserCredential> {
    return signInWithEmailAndPassword(this._auth, email, password);
  }

  async register({ email, password }: LoginDataI, { name, lastname, role }: userDataI): Promise<void> {
    const credential = await createUserWithEmailAndPassword(this._auth, email, password);
    return this._updateProfile(credential, { name, lastname, role });
  }

  private async _updateProfile(credential: UserCredential, { name, lastname, role }: userDataI): Promise<void> {
    const user: UserI = {
      uid: credential.user.uid,
      dataUser: {
        name,
        lastname,
        email: credential.user.email
      },
      role,
      activo: true,
      createdAt: Timestamp.fromMillis(Date.now())
    }

    await setDoc(doc(this._fs, 'users', `${user.uid}`), user);
  }

  logout(): Promise<void> {
    return signOut(this._auth);
  }

  resetPassword(email: string): Promise<void> {
    return sendPasswordResetEmail(this._auth, email);
  }

  //Users Methods
  private _getUserByUid(uid: string): Observable<UserI> {
    const usersRef = doc(this._fs, `users/${uid}`);
    return docData(usersRef) as Observable<UserI>;
  }

  getUsers(): Observable<UserI[]> {
    const usersRef = collection(this._fs, 'users');
    const queryRef = query(usersRef, orderBy('createdAt', 'desc'));
    return collectionData(queryRef) as Observable<UserI[]>;
  }

  handleErrorCodes(error: AuthError): string {
    switch (error.code) {
      case ('auth/email-already-in-use'):
        var mjs = 'El usuario ya existe';
        console.error(mjs);
        return mjs;

      case ('auth/invalid-email'):
        var mjs = 'El usuario debe ser un email válido';
        console.error(mjs);
        return mjs;

      case ('auth/weak-password'):
        var mjs = 'La contraseña debe contener al menos 6 caracteres.';
        console.error(mjs);
        return mjs;

      case ('auth/wrong-password'):
        var mjs = 'La contraseña es incorrecta.';
        console.error(mjs);
        return mjs;

      case ('auth/user-not-found'):
        var mjs = 'El usuario no existe.';
        console.error(mjs);
        return mjs;
    }
    return 'Ocurrió un error desconocido.';
  }

}