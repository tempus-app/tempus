import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createMock } from '@golevelup/ts-jest';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { TimesheetEntity } from '@tempus/api/shared/entity';
import { TimesheetService } from '../../services';
import { createTimesheetMock, timesheetEntityMock, createTimesheetEntity, dbTimesheet, submittedTimesheetEntityMock, approveTimesheetDto, updateTimesheetMock, billedTimesheetEntityMock } from '../mocks/timesheet.mock';
import { TimesheetRevisionType } from '@tempus/shared-domain';
import { ResourceService, UserService } from '@tempus/onboarding-api/feature-account';
import { ProjectService } from '@tempus/onboarding-api/feature-project';




const mockTimesheetRepository = createMock<Repository<TimesheetEntity>>();
const mockResourceService = createMock<ResourceService>();
const mockProjectService = createMock<ProjectService>();
const mockUserService = createMock<UserService>();

const dateToday = new Date();
dateToday.setHours(0, 0, 0, 0);

describe('TimesheetService', () => {
    let moduleRef: TestingModule;
    let timesheetService: TimesheetService;

    beforeEach(async () => {
        jest.resetModules();
        moduleRef = await Test.createTestingModule({
            providers:[
                TimesheetService,
                {
                    provide: getRepositoryToken(TimesheetEntity),
                    useValue: mockTimesheetRepository,
                },
                {
                    provide: UserService,
                    useValue: mockUserService,
                },
                {
                    provide: ResourceService,
					useValue: mockResourceService,
                },
                {
                    provide: ProjectService,
                    useValue: mockProjectService,
                },
            ],
        }).compile();

        timesheetService = moduleRef.get<TimesheetService>(TimesheetService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Creating Timesheet', () => {
        it('should successfully create a timesheet', async () => {

            const createdTimesheet = {
                ...createTimesheetEntity
            }
			mockTimesheetRepository.findOne.mockResolvedValue(undefined);
            mockTimesheetRepository.save.mockResolvedValue(createTimesheetEntity)

            const res = await timesheetService.createTimesheet(createTimesheetEntity);

            expect(res.status).toEqual(TimesheetRevisionType.NEW);
        });

        it('should successfully fail to create a timesheet for a date that exists', async () => {

            let error;
			mockTimesheetRepository.findOne.mockResolvedValue(createTimesheetEntity);
            try{
                await timesheetService.createTimesheet(createTimesheetEntity);
            } catch (e) {
                error = e;
            }
            expect(error.message).toBe('There already exists a timesheet in that date range');
        });
    });

    describe('Get Timesheet', () => {
        it('should get a timesheet by id', async () => {
            mockTimesheetRepository.findOne.mockResolvedValue(timesheetEntityMock);
            const res = await timesheetService.getTimesheet(timesheetEntityMock.id);
            expect(mockTimesheetRepository.findOne).toHaveBeenCalled();
            expect(res).toEqual({...timesheetEntityMock})
        });

        it('should throw error getting timesheet that does not exist', async () => {
            mockTimesheetRepository.findOne.mockRejectedValue(new NotFoundException('Timesheet does not exist'));
            let error;
            try {
                await timesheetService.getTimesheet(100);
            } catch(e){
                error = e;
            }
            expect(mockTimesheetRepository.findOne).toBeCalledWith(100);
            expect(error).toBeInstanceOf(NotFoundException);
			expect(error.message).toEqual('Timesheet does not exist');
        });
        it('should get all the timesheets of a user', async () => {
            mockTimesheetRepository.find.mockResolvedValue([dbTimesheet]);

            const res = await timesheetService.getAllTimesheetsforUser(timesheetEntityMock.resource.id);

            expect(mockTimesheetRepository.find).toBeCalledWith({where: {resource: {id: timesheetEntityMock.resource.id}}, relations: ['resource']});
            expect(res[0]).toEqual(timesheetEntityMock);
        });

        it('should get all the timesheets of a user that are submitted', async () => {
            mockTimesheetRepository.find.mockResolvedValue([submittedTimesheetEntityMock]);
           
            const res = await timesheetService.getAllSubmittedTimesheetsforUser(submittedTimesheetEntityMock.resource.id);

            expect(mockTimesheetRepository.find).toBeCalled();
            expect(res[0]).toEqual(submittedTimesheetEntityMock);
        });

        it('should get all the timesheets of a project', async () => {

            mockTimesheetRepository.find.mockResolvedValue([dbTimesheet]);

            const res = await timesheetService.getAllTimesheetsforProject(timesheetEntityMock.project.id);
            expect(mockTimesheetRepository.find).toBeCalledWith({where: {project: {id: timesheetEntityMock.project.id}}, relations: ['project']});
            expect(res[0]).toEqual(timesheetEntityMock);
        });

        it('should get all the timesheets of a project that are submitted', async () => {
            mockTimesheetRepository.find.mockResolvedValue([submittedTimesheetEntityMock]);
           
            const res = await timesheetService.getAllSubmittedTimesheetsforProject(submittedTimesheetEntityMock.project.id);

            expect(mockTimesheetRepository.find).toBeCalled();
            expect(res[0]).toEqual(submittedTimesheetEntityMock);
        });

        it('should get all the timesheets for a supervisor', async () => {
            const returnedTimesheets = [timesheetEntityMock, submittedTimesheetEntityMock];
            mockTimesheetRepository.findAndCount.mockResolvedValue([returnedTimesheets, 2]);

            const res = await timesheetService.getAllTimesheetsBySupervisorId(timesheetEntityMock.supervisor.id,0,1000);
            
            expect(mockTimesheetRepository.findAndCount).toHaveBeenCalledWith({
                where: {supervisor: {id: timesheetEntityMock.supervisor.id,},}, 
                relations: ['supervisor', 'project', 'resource'],
                take: Number(1000),
				skip: Number(0) * Number(1000),
            });
            expect(res.timesheets).toEqual(returnedTimesheets);
        });
    });

    describe('Submitting Timesheet', () => {
        it('should submit timesheet successfully', async () => {

            const newTimesheetEntity = timesheetEntityMock;
            mockTimesheetRepository.findOne.mockResolvedValue(newTimesheetEntity);

            const res = await timesheetService.submitTimesheet(newTimesheetEntity.id);
            newTimesheetEntity.status = TimesheetRevisionType.SUBMITTED;

            expect(mockTimesheetRepository.findOne).toHaveBeenCalled();
            expect(mockTimesheetRepository.save).toHaveBeenCalledWith(newTimesheetEntity);
        });
    });
    describe('Approve/Deny timesheet', () => {
        it('should approve timesheet successfully', async () => {

            const approvedTimesheetEntity = submittedTimesheetEntityMock
            mockTimesheetRepository.findOne.mockResolvedValue(submittedTimesheetEntityMock);
            const res = await timesheetService.approveOrRejectTimesheet(submittedTimesheetEntityMock.id, approveTimesheetDto);
            approvedTimesheetEntity.status = TimesheetRevisionType.APPROVED;
            expect(mockTimesheetRepository.findOne).toHaveBeenCalledWith(submittedTimesheetEntityMock.id);
            expect(mockTimesheetRepository.save).toHaveBeenCalledWith(approvedTimesheetEntity);

        });
        it('should deny timesheet successfully', async () => {
            const rejectedTimesheetEntity = submittedTimesheetEntityMock
            mockTimesheetRepository.findOne.mockResolvedValue(submittedTimesheetEntityMock);
            const res = await timesheetService.approveOrRejectTimesheet(submittedTimesheetEntityMock.id, approveTimesheetDto);
            rejectedTimesheetEntity.status = TimesheetRevisionType.REJECTED;
            expect(mockTimesheetRepository.findOne).toHaveBeenCalledWith(submittedTimesheetEntityMock.id);
            expect(mockTimesheetRepository.save).toHaveBeenCalledWith(rejectedTimesheetEntity);
        });
    });
    describe('Updating Timesheet', () => {
        it('should update timesheet successfully', async () => {
            mockTimesheetRepository.findOne.mockResolvedValue(dbTimesheet);
            mockTimesheetRepository.save.mockResolvedValue({...dbTimesheet, mondayHours:5});
            updateTimesheetMock.mondayHours = 5;
            
            const res = await timesheetService.updateTimesheet(updateTimesheetMock);
            expect(mockTimesheetRepository.save).toBeCalledWith({...dbTimesheet, mondayHours:5});
            expect(res).toEqual({...dbTimesheet, mondayHours:5});
        });
        it("should fail to update timesheet that doesn't exist", async () => {
            mockTimesheetRepository.findOne.mockResolvedValue(undefined);
            let error;
            try{
                await timesheetService.updateTimesheet(updateTimesheetMock);
            } catch (e) {
                error = e;
            }
            expect(mockTimesheetRepository.save).not.toBeCalled();
            expect(error.message).toBe(`Could not find timesheet with id 3`);
			expect(error).toBeInstanceOf(NotFoundException);
        });
        it('should fail to update timesheet that has been billed', async () => {
            mockTimesheetRepository.findOne.mockResolvedValue(billedTimesheetEntityMock);
            let error;
            try{
                await timesheetService.updateTimesheet(updateTimesheetMock);
            } catch (e) {
                error = e;
            }
            expect(mockTimesheetRepository.save).not.toBeCalled();
            expect(error.message).toBe(`This timesheet has already been billed and can't be modified`);
			expect(error).toBeInstanceOf(ForbiddenException);
        });
    });

    describe('Deleting Timesheet', () => {
        it('should delete timesheet successfully', async () => {
            mockTimesheetRepository.findOne.mockResolvedValue(dbTimesheet);
			mockTimesheetRepository.remove.mockResolvedValue(dbTimesheet);
			await timesheetService.deleteTimesheet(dbTimesheet.id);
			expect(mockTimesheetRepository.findOne).toBeCalledWith(dbTimesheet.id);
			expect(mockTimesheetRepository.remove).toBeCalledWith({ ...dbTimesheet });
        });
    });

});