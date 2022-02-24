import { Injectable, NotFoundException, NotImplementedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { EmailService } from '@tempus/api-email'
import { CreateLinkDto, LinkEntity, StatusType, UpdatelinkDto } from '@tempus/datalayer'
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

  async findLinkById(linkId: number): Promise<LinkEntity> {
    const linkEntity = await this.linkRepository.findOne(linkId)
    if (!linkEntity) {
      throw new NotFoundException(`Could not find education with id ${linkId}`)
    }
    if (!this.isLinkValid(linkEntity)) {
      await this.editLinkStatus(linkId, StatusType.INACTIVE)
    }
    return linkEntity
  }

  async findLinkByToken(token: string): Promise<LinkEntity> {
    //should be unique
    const links = await this.linkRepository.find({ where: { token: token } })
    const linkEntity = links[0]
    if (!linkEntity) {
      throw new NotFoundException(`Could not find link with token ${token}`)
    }
    if (!this.isLinkValid(linkEntity)) {
      await this.editLinkStatus(linkEntity.id, StatusType.INACTIVE)
    }
    return linkEntity
  }

  async editLink(updatelinkDto: UpdatelinkDto): Promise<LinkEntity> {
    return this.editLinkStatus(updatelinkDto.id, updatelinkDto.status)
  }

  async editLinkStatus(linkId: number, newStatus: StatusType): Promise<LinkEntity> {
    let existingLinkEntity = await this.linkRepository.findOne(linkId)

    if (!existingLinkEntity) {
      throw new NotFoundException(`Could not find link with id ${existingLinkEntity.id}`)
    }

    existingLinkEntity.status = newStatus

    return this.linkRepository.save(existingLinkEntity)
  }

  //compares link expiry with current time
  isLinkValid(linkEntity: LinkEntity): boolean {
    if (linkEntity.expiry.getTime() <= Date.now()) {
      return false
    }
    return true
  }
}
