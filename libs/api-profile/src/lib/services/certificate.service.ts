import { Injectable, NotImplementedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Certification, CertificationEntity } from '@tempus/datalayer'
import { Repository } from 'typeorm'

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
