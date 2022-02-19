import { Injectable, NotImplementedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Certification } from '../models/certification.model'
import { CertificationEntity } from '../entities/certification.entity'

@Injectable()
export class CertificationService {
  constructor(
    @InjectRepository(CertificationEntity)
    private certificationRepository: Repository<CertificationEntity>,
  ) {}

  // create ceritifcation for a specific resource
  createCertification(resourceId: number, certification: Omit<Certification, 'id'>): Promise<CertificationEntity> {
    throw new NotImplementedException()
  }

  // return all certifications by resource
  findCertificationByResource(resourceId: number): Promise<CertificationEntity[]> {
    throw new NotImplementedException()
  }

  // return certification by id
  findCertificationById(certificationId: number): Promise<CertificationEntity> {
    throw new NotImplementedException()
  }

  // edit certification
  editCertification(certification: Certification): Promise<CertificationEntity> {
    throw new NotImplementedException()
  }

  // delete certification
  deleteCertification(certificationId: number) {
    throw new NotImplementedException()
  }
}
