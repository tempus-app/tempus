import { Injectable, NotImplementedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Experience } from "../models/experience.model";
import { ExperienceEntity } from "../entities/experience.entity";

@Injectable()
export class ExperienceService {
    constructor(
        @InjectRepository(ExperienceEntity)
        private experienceRepository: Repository<ExperienceEntity> 
    ) {}

    // create experience
    createExperience(userId: string, experience: Omit<Experience, 'id'>) {
        throw new NotImplementedException();
    }

    // return experience by user
    findExperienceByResource(userId: string): Promise<ExperienceEntity> {
        throw new NotImplementedException();
    }

    // edit experience
    editEducation(experience: Experience): Promise<Experience> {
        throw new NotImplementedException();
    }

    // delete experience
    deleteExperience(skillId: string) {
        throw new NotImplementedException();
    }



}