import { Injectable, NotImplementedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Link, LinkEntity } from '..'
import { StatusType } from '../models/status'

@Injectable()
class LinkService {
  constructor(
    @InjectRepository(LinkEntity)
    private linkEntity: Repository<LinkEntity>,
  ) {}

  createLink(link: Omit<Link, 'id'>): Promise<LinkEntity> {
    throw new NotImplementedException()
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
