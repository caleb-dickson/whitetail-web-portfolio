export class UserAuthData {
  constructor(
    public signInMethod: string,
    public email: string,
    public localId: string,
    private _token: string,
    private _tokenExpirationDate: Date,
    public displayName?: string,
    public firstName?: string,
    public lastName?: string,
    public userPhotoURL?: string,
    public phoneNumber?: string,
  ) {}

  get token() {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return null;
    }
    return this._token;
  }
}

