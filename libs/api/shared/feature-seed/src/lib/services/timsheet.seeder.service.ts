import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateTimesheetDto } from "@tempus/api/shared/dto";
import { ProjectEntity, ResourceEntity, TimesheetEntity, UserEntity } from "@tempus/api/shared/entity";
import { Repository } from "typeorm";
import { TimesheetService } from '@tempus/onboarding-api/feature-timesheet';



@Injectable()
export class TimesheetSeederService {
    
    constructor (
        @InjectRepository(TimesheetEntity)
        private timesheetRepository : Repository<TimesheetEntity>,
        private timesheetService : TimesheetService,
    ){}

    async clear() {
		await this.timesheetRepository.query('DELETE from timesheet_entity Cascade');
	}


    async seedTimesheets(supervisors: UserEntity[], resources: ResourceEntity[], projects: ProjectEntity[]) : Promise<TimesheetEntity[]> {

        const createdTimesheets: TimesheetEntity[] = [];
        for (let i = 0; i < 8; i++) {
            const createTimesheet: CreateTimesheetDto = new CreateTimesheetDto(
                supervisors[getRandomInt(0, supervisors.length - 1)].id,
                resources[getRandomInt(0, resources.length - 1)].id,
                projects[getRandomInt(0, projects.length - 1)].id,
                new Date(2023, 3, 2),
                new Date(2023, 3, 8),
                false,
                false,
                "comment",
                "comment",
                false,
                false,
                null,
            )
            const timesheet = await this.timesheetService.createTimesheet(createTimesheet);
            createdTimesheets.push(timesheet);
        }

        return createdTimesheets;
    }
}

function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }