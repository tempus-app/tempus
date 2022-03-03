import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResourceService } from '@tempus/api-onboarding-api-feature-account';
import { Certification, CertificationEntity, UpdateCertificationDto } from '@tempus/shared-domain';
import { Repository } from 'typeorm';

@Injectable()
export class CertificationService {
	constructor(
		@Inject(forwardRef(() => ResourceService))
		private resourceService: ResourceService,
		@InjectRepository(CertificationEntity)
		private certificationRepository: Repository<CertificationEntity>,
	) {}

	// create ceritifcation for a specific resource
	async createCertification(resourceId: number, certification: CertificationEntity): Promise<Certification> {
		const resourceEntity = await this.resourceService.getResourceInfo(resourceId);
		const newCertification = certification;
		newCertification.resource = resourceEntity;
		return this.certificationRepository.save(newCertification);
	}

	// return all certifications by resource
	async findCertificationByResource(resourceId: number): Promise<Certification[]> {
		const certificationEntities = await this.certificationRepository.find({
			where: { resource: { id: resourceId } },
			relations: ['resource'],
		});
		return certificationEntities;
	}

	// return certification by id
	async findCertificationById(certificationId: number): Promise<Certification> {
		const certificationEntity = await this.certificationRepository.findOne(certificationId, {
			relations: ['resource'],
		});
		if (!certificationEntity) {
			throw new NotFoundException(`Could not find certification with id ${certificationId}`);
		}
		return certificationEntity;
	}

	// edit certification
	async editCertification(updatedCertificationData: UpdateCertificationDto): Promise<Certification> {
		const updatedCertification = updatedCertificationData;
		const existingCertificationEntity = await this.certificationRepository.findOne(updatedCertification.id, {
			relations: ['resource'],
		});
		if (!existingCertificationEntity) {
			throw new NotFoundException(`Could not find certification with id ${existingCertificationEntity.id}`);
		}

		// Safe guards to prevent data from being overwritten as null
		Object.entries(updatedCertification).forEach(entry => {
			if (!entry[1]) {
				delete updatedCertification[entry[0]];
			}
		});
		Object.assign(existingCertificationEntity, updatedCertification);

		return this.certificationRepository.save(existingCertificationEntity);
	}

	// delete certification
	async deleteCertification(certificationId: number) {
		const certificationEntity = await this.certificationRepository.findOne(certificationId);
		if (!certificationEntity) {
			throw new NotFoundException(`Could not find education with id ${certificationId}`);
		}
		this.certificationRepository.remove(certificationEntity);
	}
}
