import { Injectable, NotFoundException, NotImplementedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ResourceService } from '@tempus/api-account'
import { SlimCertificationDto, CertificationEntity, FullCertificationDto } from '@tempus/datalayer'
import { Repository } from 'typeorm'

@Injectable()
export class CertificationService {
  constructor(
    private resourceService: ResourceService,
    @InjectRepository(CertificationEntity)
    private certificationRepository: Repository<CertificationEntity>,
  ) {}

  // create ceritifcation for a specific resource
  async createCertification(resourceId: number, certification: SlimCertificationDto): Promise<FullCertificationDto> {
    let certificationEntity = SlimCertificationDto.toEntity(certification)
    let resourceEntity = await this.resourceService.findResourceById(resourceId)

    certificationEntity.resource = resourceEntity
    certificationEntity = await this.certificationRepository.save(certificationEntity)

    return FullCertificationDto.fromEntity(certificationEntity)
  }

  // return all certifications by resource
  async findCertificationByResource(resourceId: number): Promise<FullCertificationDto[]> {
    let certificationEntities = await this.certificationRepository.find({
      where: { resource: { id: resourceId } },
      relations: ['resource'],
    })
    let fullCertificationDtos = certificationEntities.map((entity) => FullCertificationDto.fromEntity(entity))
    return fullCertificationDtos
  }

  // return certification by id
  async findCertificationById(certificationId: number): Promise<FullCertificationDto> {
    let certificationEntity = await this.certificationRepository.findOne(certificationId, { relations: ['resource'] })
    if (!certificationEntity) {
      throw new NotFoundException(`Could not find certification with id ${certificationId}`)
    }
    return FullCertificationDto.fromEntity(certificationEntity)
  }

  // edit certification
  async editCertification(certification: SlimCertificationDto): Promise<FullCertificationDto> {
    let certificationEntity = await this.certificationRepository.findOne(certification.id)
    if (!certificationEntity) {
      throw new NotFoundException(`Could not find certification with id ${certification.id}`)
    }
    await this.certificationRepository.update(certification.id, SlimCertificationDto.toEntity(certification))
    let updatedEntity = await this.certificationRepository.findOne(certification.id, { relations: ['resource'] })
    return FullCertificationDto.fromEntity(updatedEntity)
  }

  // delete certification
  async deleteCertification(certificationId: number) {
    let certificationEntity = await this.certificationRepository.findOne(certificationId)
    if (!certificationEntity) {
      throw new NotFoundException(`Could not find education with id ${certificationId}`)
    }
    this.certificationRepository.delete(certificationEntity)
  }
}
