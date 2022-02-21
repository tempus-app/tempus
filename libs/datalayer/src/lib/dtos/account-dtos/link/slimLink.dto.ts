import { StatusType } from '../../../enums'

export class SlimLinkDto {
  constructor(id?: number, firstName?: string, lastName?: string, expiry?: Date, token?: string, status?: StatusType) {}
}
