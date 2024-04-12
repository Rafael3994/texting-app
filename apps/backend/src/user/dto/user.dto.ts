export class UserDTO {
  readonly id?: string;
  readonly name: string;
  readonly email: string;
  password?: string;
  readonly createdTime?: Date;
}
