import { StatusType } from '../../../enums';

export class CreateLinkDto {
  constructor(firstName: string, lastName: string, expiry: Date, token: string, status: StatusType) {}
}
