import { StatusType } from '../../../enums'

export class CreateLinkDto {
  constructor(firstName: string, lastName: string, email:string, expiry: Date, token: string, status: StatusType) {}
}
