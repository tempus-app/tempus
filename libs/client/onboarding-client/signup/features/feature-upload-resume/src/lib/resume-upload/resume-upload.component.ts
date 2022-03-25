import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Country } from 'country-state-city';
import {
	createResumeUpload,
	SignupState,
	createUserDetails,
	createWorkExperienceDetails,
	createTrainingAndSkillDetails,
} from '@tempus/client/onboarding-client/signup/data-access';
import { Store } from '@ngrx/store';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ParsedEducation, ParsedResume, RawResume, ParsedWorkExperience } from '@tempus/shared/util';
import {
	ICreateLocationDto,
	ICreateExperienceDto,
	ICreateEducationDto,
	ICreateCertificationDto,
	ICreateSkillDto,
	ICreateSkillTypeDto,
} from '@tempus/shared-domain';

@Component({
	selector: 'tempus-resume-upload',
	templateUrl: './resume-upload.component.html',
	styleUrls: ['./resume-upload.component.scss'],
})
export class ResumeUploadComponent {
	fileData = new FormControl(null, { validators: [Validators.required] });

	fileType = 'application/pdf,application/msword,.doc,.docx,text/plain';

	fileUploaded = false;

	fileParsed = false;

	resumeParsed = false;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private store: Store<SignupState>,
		private http: HttpClient,
	) {}

	onChange(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const { files } = input;
		if (files) {
			const firstFile = files.item(0);
			if (firstFile) {
				this.onUpload(firstFile);
				input.value = ''; // allows onchange to trigger for same file
			}
		}
	}

	async parseFile(file: File) {
		// Simple POST request with a JSON body using fetch
		const params = new HttpParams();

		const formData = new FormData();
		formData.append('file', file);

		return this.http.post('python-api/parse', formData);
	}

	async onUpload(file: File) {
		(await this.parseFile(file)).subscribe((event: any) => {
			if (typeof event === 'object') {
				console.log(JSON.parse(event.body));
				this.createUserDetails(JSON.parse(event.body));
				this.createWorkDetails(JSON.parse(event.body));
				this.createTrainingandSkilsDetails(JSON.parse(event.body));
				this.fileParsed = false;
				this.resumeParsed = true;
			}
		});
		this.fileData.patchValue(file);
		this.fileData.markAsDirty();
		this.fileUploaded = true;
		this.fileParsed = true;
	}

	createTrainingandSkilsDetails(parsedResumeJSON: ParsedResume) {
		const skillsList = parsedResumeJSON.summary.skills.split(',');
		this.store.dispatch(
			createTrainingAndSkillDetails({
				skillsSummary: '',
				educationsSummary: '',
				educations: parsedResumeJSON.schools.map((qualification: ParsedEducation) => {
					let formattedStartDate;
					let formattedEndDate;
					// Add a 0 in front of the month if it's under 10 to follow date standard format
					if (qualification.start) {
						formattedStartDate = `${qualification.start.year}-${`0${qualification.start.month}`.slice(-2)}-01`;
					}
					if (qualification.end) {
						formattedEndDate = `${qualification.end.year}-${`0${qualification.end.month}`.slice(-2)}-01`;
					}
					return {
						degree: qualification.degree,
						institution: qualification.org,
						startDate: formattedStartDate || undefined,
						endDate: formattedEndDate || undefined,
						location: {
							country: '',
							city: '',
							province: '',
						} as ICreateLocationDto,
					} as ICreateEducationDto;
				}),
				skills: skillsList.map(skill => {
					return {
						skill: {
							name: skill,
						} as ICreateSkillTypeDto,
					} as ICreateSkillDto;
				}),
				certifications: [],
			}),
		);
	}

	createWorkDetails(parsedResumeJSON: ParsedResume) {
		this.store.dispatch(
			createWorkExperienceDetails({
				experiencesSummary: '',
				experiences: parsedResumeJSON.positions.map((workExperience: ParsedWorkExperience) => {
					let formattedStartDate;
					let formattedEndDate;
					// Add a 0 in front of the month if it's under 10 to follow date standard format
					if (workExperience.start) {
						formattedStartDate = `${workExperience.start.year}-${`0${workExperience.start.month}`.slice(-2)}-01`;
					}
					if (workExperience.end) {
						formattedEndDate = `${workExperience.end.year}-${`0${workExperience.end.month}`.slice(-2)}-01`;
					}
					return {
						title: workExperience.title,
						company: workExperience.org,
						location: {
							country: '',
							province: '',
							city: '',
						} as ICreateLocationDto,
						startDate: formattedStartDate || undefined,
						endDate: formattedEndDate || undefined,
						summary: '',
						description: [workExperience.summary],
					} as ICreateExperienceDto;
				}),
			}),
		);
	}

	createUserDetails(parsedResumeJSON: ParsedResume) {
		const splitNames = parsedResumeJSON.names[0].split(' ');
		let country;
		if (parsedResumeJSON.location.address) {
			country = Country.getCountryByCode(parsedResumeJSON.location.address.CountryCode)?.name;
		}
		this.store.dispatch(
			createUserDetails({
				firstName: splitNames[0],
				lastName: splitNames[1],
				phoneNumber: parsedResumeJSON.phones[0].value.substring(1),
				linkedInLink: '',
				githubLink: '',
				otherLink: '',
				location: {
					city: '',
					province: '',
					country: country || '',
				},
				profileSummary: parsedResumeJSON.summary.executiveSummary,
			}),
		);
	}

	onDelete() {
		this.fileData.setValue(null);
		this.fileData.markAsDirty();

		this.fileUploaded = false;
	}

	nextStep() {
		this.fileData?.markAllAsTouched();
		if (this.resumeParsed) {
			this.store.dispatch(
				createResumeUpload({
					resume: this.fileData.value,
				}),
			);
			this.router.navigate(['../myinfoone'], { relativeTo: this.route });
		}
	}
}
