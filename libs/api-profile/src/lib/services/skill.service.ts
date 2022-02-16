import { Injectable, NotImplementedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Skill, SkillTypeEntity } from "..";
import { SkillEntity } from "../entities/skill.entity";

@Injectable()
export class SkillsService {
    constructor(
        @InjectRepository(SkillEntity)
        private skillsRepository: Repository<SkillEntity>,
        private skillTypeRepository: Repository<SkillTypeEntity>
    ) {}

    // create skill
    createSkill(name: string): Promise<Skill> {
        throw new NotImplementedException();
    }

    // return all skills from database
    findAll(): Promise<SkillEntity> {
        throw new NotImplementedException();    
    }

    // return skills by user
    findSkillsByResource(userId: string) {
        throw new NotImplementedException();
    }

    // edit skill
    editSkill(skill: Skill) {
        throw new NotImplementedException();
    }

    // delete skill
    deleteSkill(skillId) {
        throw new NotImplementedException();
    }



}