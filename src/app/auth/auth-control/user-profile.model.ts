export class UserProfileData {
  constructor(
    public authType: string,
    public displayName: string,
    public email: string,
    public localId: string,
    public userPhotoURL: string,
    public phoneNumber: string,
  ) {}
}
