import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
	createResumeUpload,
	SignupState,
	createUserDetails,
	createWorkExperienceDetails,
	createTrainingAndSkillDetails,
	selectUploadedResume,
} from '@tempus/client/onboarding-client/signup/data-access';
import { Store } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import {
	AppConfig,
	ICreateEducationDto,
	ICreateSkillDto,
	ICreateSkillTypeDto,
	ParsedResume,
} from '@tempus/shared-domain';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs';
import { APP_CONFIG } from '@tempus/app-config';

@Component({
	selector: 'tempus-resume-upload',
	templateUrl: './resume-upload.component.html',
	styleUrls: ['./resume-upload.component.scss'],
})
export class ResumeUploadComponent implements OnInit {
	fileData = new FormControl(null, { validators: [Validators.required] });

	fileType = 'application/pdf,application/msword,.doc,.docx,text/plain';

	fileUploaded = false;

	resumeParsed = false;

	uploadResumePrefix = 'onboardingSignupUploadResume.resumeUpload.';

	url = `${this.appConfig.pythonUrl}`;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private store: Store<SignupState>,
		private http: HttpClient,
		private translateService: TranslateService,
		@Inject(APP_CONFIG) private appConfig: AppConfig,
	) {
		const { currentLang } = translateService;
		// eslint-disable-next-line no-param-reassign
		translateService.currentLang = '';
		translateService.use(currentLang);
	}

	ngOnInit(): void {
		this.store
			.select(selectUploadedResume)
			.pipe(take(1))
			.subscribe((data: File | null) => {
				if (data) {
					this.onUpload(data, false);
				}
			});
	}

	onChange(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const { files } = input;
		if (files) {
			const firstFile = files.item(0);
			if (firstFile) {
				this.onUpload(firstFile, true);
				input.value = ''; // allows onchange to trigger for same file
			}
		}
	}

	async parseFile(file: File) {
		const formData = new FormData();
		formData.append('file', file);
		return this.http.post(`${this.url}/python-api/parse-resume`, formData);
	}

	async onUpload(file: File, makeRequest: boolean) {
		if (makeRequest) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(await this.parseFile(file)).subscribe((event: any) => {
				if (typeof event === 'object') {
					this.createUserDetails(event.body);
					this.createWorkDetails(event.body);
					this.createTrainingandSkilsDetails(event.body);
					this.resumeParsed = true;
				}
			});
		}
		this.fileData.patchValue(file);
		this.fileData.markAsDirty();
		this.fileUploaded = true;
		if (!makeRequest) {
			this.resumeParsed = true;
		}
	}

	createTrainingandSkilsDetails(parsedResumeJSON: ParsedResume) {
		const skillsList: string[] = parsedResumeJSON.skills;
		const education: ICreateEducationDto = {
			degree: parsedResumeJSON.degree,
			institution: '',
			location: {
				city: '',
				province: '',
				country: '',
			},
		};
		this.store.dispatch(
			createTrainingAndSkillDetails({
				skillsSummary: '',
				educationsSummary: '',
				educations: [education],
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
				experiences: [
					{
						title: '',

						summary: '',

						description: [parsedResumeJSON.experience.join()],

						company: '',

						location: {
							city: '',
							province: '',
							country: '',
						},
					},
				],
			}),
		);
	}

	createUserDetails(parsedResumeJSON: ParsedResume) {
		const splitNames = parsedResumeJSON.name.split(' ');
		this.store.dispatch(
			createUserDetails({
				firstName: splitNames[0],
				lastName: splitNames[1],
				phoneNumber: parsedResumeJSON.mobile_number,
				linkedInLink: '',
				githubLink: '',
				otherLink: '',
				location: {
					city: '',
					province: '',
					country: '',
				},
				profileSummary: '',
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
		// this.resumeParsed &&
		if (this.fileData.valid) {
			this.store.dispatch(
				createResumeUpload({
					resume: this.fileData.value,
				}),
			);
			this.router.navigate(['../myinfoone'], { relativeTo: this.route });
		}
	}
}
