import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Message } from '@tempus/api-interfaces'
import { Repository } from 'typeorm'
import { RoleType, ResourceEntity, UserEntity } from '@tempus/datalayer'
import { PdfGeneratorService } from '@tempus/pdfgenerator'

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(ResourceEntity) private resourceRepo: Repository<ResourceEntity>,
    private pdfGeneratorService: PdfGeneratorService,
  ) {}
  getData(): Message {
    return { message: 'Welcome to api!' }
  }

  createUser() {
    const newUser = new UserEntity()
    // newUser.firstName = 'test'
    // newUser.lastName = 'test'
    // // newUser.isActive = true
    // this.userRepo.save(newUser)

    const newResource = new ResourceEntity()
    newResource.email = 'email'
    const resRoles = [RoleType.AVAILABLE_RESOURCE, RoleType.SUPERVISOR]
    newResource.roles = resRoles

    this.resourceRepo.save(newResource)
  }

  async getUser() {
    const users = await this.resourceRepo.find()
    const usersRoles = []
    users.forEach((user) => {
      usersRoles.push(user.roles)
    })
    return await { data: users, roles: usersRoles }
  }

  getPdf(res: Response) {
    this.pdfGeneratorService.createPDF(res)
  }
}
