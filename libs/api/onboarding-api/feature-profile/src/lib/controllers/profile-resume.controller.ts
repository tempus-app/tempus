import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Certification, Education, Experience, ResumeComponentsDto, Skill, SkillType } from '@tempus/shared-domain';
import { ApiTags } from '@nestjs/swagger';
import { CertificationEntity, EducationEntity, ExperienceEntity, SkillEntity } from '@tempus/api/shared/entity';
import {
	CreateEducationDto,
	CreateExperienceDto,
	CreateSkillDto,
	CreateCertificationDto,
	UpdateEducationDto,
	UpdateExperienceDto,
	UpdateCertificationDto,
} from '@tempus/api/shared/dto';
import { JwtAuthGuard, PermissionGuard } from '@tempus/api/shared/feature-auth';
import { EducationService } from '../services/education.service';
import { ExperienceService } from '../services/experience.service';
import { SkillsService } from '../services/skill.service';
import { CertificationService } from '../services/certificate.service';

@ApiTags('Profile Resume Components')
@Controller('profileresume')
export class ProfileResumeController {
	constructor(
		private educationService: EducationService,
		private skillService: SkillsService,
		private certificationService: CertificationService,
		private experienceService: ExperienceService,
	) {}

	// CREATE DATA (only relevant when on main table page and creating)
	@UseGuards(JwtAuthGuard, PermissionGuard)
	@Post('/education/:userId')
	async createEducation(
		@Param('userId') userId: number,
		@Body() createEducationData: CreateEducationDto,
	): Promise<Education> {
		let educationEntity = EducationEntity.fromDto(createEducationData);
		educationEntity = await this.educationService.createEducation(userId, educationEntity);
		return educationEntity;
	}

	@UseGuards(JwtAuthGuard, PermissionGuard)
	@Post('/experience/:userId')
	async createExperience(
		@Param('userId') userId: number,
		@Body() createExperienceData: CreateExperienceDto,
	): Promise<Experience> {
		let experienceEntity = ExperienceEntity.fromDto(createExperienceData);
		experienceEntity = await this.experienceService.createExperience(userId, experienceEntity);
		return experienceEntity;
	}

	@UseGuards(JwtAuthGuard, PermissionGuard)
	@Post('/skill/:userId')
	async createSkill(@Param('userId') userId: number, @Body() createSkillData: CreateSkillDto): Promise<Skill> {
		let skillEntity = SkillEntity.fromDto(createSkillData);
		skillEntity = await this.skillService.createSkill(userId, skillEntity);
		return skillEntity;
	}

	@UseGuards(JwtAuthGuard, PermissionGuard)
	@Post('/certification/:userId')
	async createCertification(
		@Param('userId') userId: number,
		@Body() createCertificationData: CreateCertificationDto,
	): Promise<Certification> {
		let certificationEntity = CertificationEntity.fromDto(createCertificationData);
		certificationEntity = await this.certificationService.createCertification(userId, certificationEntity);
		return certificationEntity;
	}

	// UPDATE DATA (only relevant when on main table page and editing)
	@UseGuards(JwtAuthGuard)
	@Patch('/education')
	async editEducation(@Body() updateEducationData: UpdateEducationDto): Promise<Education> {
		const updatedEducationEntity = await this.educationService.editEducation(updateEducationData);
		return updatedEducationEntity;
	}

	@UseGuards(JwtAuthGuard)
	@Patch('/experience')
	async editExperience(@Body() updateExperienceData: UpdateExperienceDto): Promise<Experience> {
		const updatedExperienceEntity = await this.experienceService.editExperience(updateExperienceData);
		return updatedExperienceEntity;
	}

	@UseGuards(JwtAuthGuard)
	@Patch('/cerification')
	async editCertification(@Body() updatedCertificationData: UpdateCertificationDto): Promise<Certification> {
		const updatedCertificationEntity = await this.certificationService.editCertification(updatedCertificationData);
		return updatedCertificationEntity;
	}

	// GET DATA (only relevant when on main table page when getting OR if we ever need one specifically)
	@UseGuards(JwtAuthGuard)
	@Get('/education/:educationId')
	async getEducation(@Param('educationId') educationId: number): Promise<Education> {
		const educationEntity = await this.educationService.findEducationById(educationId);
		return educationEntity;
	}

	@UseGuards(JwtAuthGuard)
	@Get('/experience/:experienceId')
	async getExperience(@Param('experienceId') experienceId: number): Promise<Experience> {
		const experienceEntity = await this.experienceService.findExperienceById(experienceId);
		return experienceEntity;
	}

	@UseGuards(JwtAuthGuard)
	@Get('/skill/:skillId')
	async getSkill(@Param('skillId') skillId: number): Promise<Skill> {
		const skillEntity = await this.skillService.findSkillById(skillId);
		return skillEntity;
	}

	@UseGuards(JwtAuthGuard)
	@Get('/cerification/:certificationId')
	async getCertification(@Param('certificationId') certificationId: number): Promise<Certification> {
		const certificationEntity = await this.certificationService.findCertificationById(certificationId);
		return certificationEntity;
	}

	// Expected to be used on many pages
	@UseGuards(JwtAuthGuard)
	@Get('/skillTypes')
	async getAllSkillTypes(): Promise<SkillType[]> {
		const skillTypeEntities = await this.skillService.findAllSkillTypes();
		return skillTypeEntities;
	}

	@UseGuards(JwtAuthGuard, PermissionGuard)
	@Get('/education/all/:userId')
	async getAllEducationsByResource(@Param('userId') userId: number): Promise<Education[]> {
		const educationEntities = await this.educationService.findEducationByResource(userId);
		return educationEntities;
	}

	@UseGuards(JwtAuthGuard, PermissionGuard)
	@Get('/experience/all/:userId')
	async getAllExperiencesByUser(@Param('userId') userId: number): Promise<Experience[]> {
		const experienceEntities = await this.experienceService.findExperienceByResource(userId);
		return experienceEntities;
	}

	@UseGuards(JwtAuthGuard, PermissionGuard)
	@Get('/certification/all/:userId')
	async getAllCertificationsByUser(@Param('userId') userId: number): Promise<Certification[]> {
		const certificationEntities = await this.certificationService.findCertificationByResource(userId);
		return certificationEntities;
	}

	@UseGuards(JwtAuthGuard, PermissionGuard)
	@Get('/skill/all/:userId')
	async getAllSkillsByUser(@Param('userId') userId: number): Promise<Skill[]> {
		const skillEntities = await this.skillService.findSkillsByResource(userId);
		return skillEntities;
	}

	@UseGuards(JwtAuthGuard, PermissionGuard)
	@Get('/:userId')
	async getAllResumeComponentsByUser(@Param('userId') userId: number): Promise<ResumeComponentsDto> {
		const skillEntities = await this.skillService.findSkillsByResource(userId);
		const certificationEntities = await this.certificationService.findCertificationByResource(userId);
		const experienceEntities = await this.experienceService.findExperienceByResource(userId);
		const educationEntities = await this.educationService.findEducationByResource(userId);

		return new ResumeComponentsDto(educationEntities, experienceEntities, skillEntities, certificationEntities);
	}

	// DELETES only to be used on the main table page (no delete capability on views)
	@UseGuards(JwtAuthGuard)
	@Delete('/education/:educationId')
	async deleteEducation(@Param('educationId') educationId: number): Promise<void> {
		return this.educationService.deleteEducation(educationId);
	}

	@UseGuards(JwtAuthGuard)
	@Delete('/experience/:experienceId')
	async deleteExperience(@Param('experienceId') experienceId: number): Promise<void> {
		return this.experienceService.deleteExperience(experienceId);
	}

	@UseGuards(JwtAuthGuard)
	@Delete('/certification/:certificationId')
	async deleteCertification(@Param('certificationId') certificationId: number): Promise<void> {
		return this.certificationService.deleteCertification(certificationId);
	}

	@UseGuards(JwtAuthGuard)
	@Delete('/skill/:skillId')
	async deleteSkill(@Param('skillId') skillId: number): Promise<void> {
		return this.skillService.deleteSkill(skillId);
	}
}
