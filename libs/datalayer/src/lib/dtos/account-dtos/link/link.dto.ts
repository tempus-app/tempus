import { StatusType } from '../../../enums'

export class LinkDto {
  constructor(id?: number, firstName?: string, lastName?: string, expiry?: Date, token?: string, status?: StatusType) {}
}
