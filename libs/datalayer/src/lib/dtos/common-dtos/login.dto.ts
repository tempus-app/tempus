export class LoginDto {
  email: string
  password: string

  constructor(email?: string, password?: string) {
    this.email = email ?? null
    this.password = password ?? null
  }
}
