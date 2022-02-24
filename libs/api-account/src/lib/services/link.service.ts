import { Injectable, NotImplementedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { EmailService } from '@tempus/api-email'
import { CreateLinkDto, LinkEntity, StatusType } from '@tempus/datalayer'
import { Repository } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class LinkService {
  constructor(
    @InjectRepository(LinkEntity)
    private linkRepository: Repository<LinkEntity>,
    private emailService: EmailService,
  ) {}

  createLink(link: LinkEntity): Promise<LinkEntity> {
    const uniqueToken = uuidv4()
    let expiryDate = link.expiry

    //if custom expiry not defined, link expires in a week
    if (!link.expiry) {
      const currentDate = new Date()
      expiryDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 7)
    }
    const fullLink = { ...link, token: uniqueToken, status: StatusType.ACTIVE, expiry: expiryDate }
    this.emailService.sendInvitationEmail(fullLink)
    return this.linkRepository.save(fullLink)
  }

  associateLinkToUser(linkId: number, userId: number): Promise<LinkEntity> {
    throw new NotImplementedException()
  }

  getLink(linkId: number): Promise<LinkEntity> {
    throw new NotImplementedException()
  }

  editLinkStatus(linkId: number, newStatus: StatusType): Promise<LinkEntity> {
    throw new NotImplementedException()
  }

  //compares link expiry with current time
  isLinkValid(linkId: number): boolean {
    throw new NotImplementedException()
  }
}
