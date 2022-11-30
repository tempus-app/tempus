import { ResourceEntity } from '@tempus/api/shared/entity';
import { View, ViewType } from '@tempus/shared-domain';

export const SampleView: View = {
	id: 0,
	locked: true,
	createdAt: null,
	createdBy: null,
	profileSummary:
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
	skillsSummary:
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
	educationsSummary: null,
	experiencesSummary:
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
	type: '',
	certifications: [
		{
			id: 1,
			title: 'Certification 1',
			institution: 'Udemy',
			summary: 'summary 1',
			resource: null,
		},
	],
	skills: [
		{
			id: 1,
			skill: { name: 'Random Skill 1' },
			resource: null,
		},
		{
			id: 2,
			skill: { name: 'Random Skill 2' },
			resource: null,
		},
		{
			id: 3,
			skill: { name: 'Random Skill 3' },
			resource: null,
		},
		{
			id: 4,
			skill: { name: 'Random Skill 4' },
			resource: null,
		},
		{
			id: 5,
			skill: {
				name: 'Random Long Skill Lorem Ipsum Dosom Dolor Set Lorem Ipsum Dosot Dolor Set Lorem Ipsum Dosot Dolor Set',
			},
			resource: null,
		},
		{
			id: 6,
			skill: { name: 'Random Skill 6' },
			resource: null,
		},
	],
	experiences: [
		{
			id: 1,
			title:
				'SAP S/4 Solutions Architect Long Name Long Name Long Name Long Name Long Name Long Name Long Name Long Name Long Name Long Name Long Name Long Name',
			description: null,
			startDate: new Date('2010/10/09'),
			company: 'string',
			endDate: null,
			location: {
				id: 1,
				city: 'Ottawa',
				province: 'Ontario',
				country: 'Canada',
			},
			resource: null,
		},
		{
			id: 2,
			title: 'SAP Solutions Architect',
			company: 'string',
			description: [
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
				'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
			],
			startDate: new Date(),
			endDate: new Date(),
			location: {
				id: 2,
				city: 'Toronto',
				province: 'Ontario',
				country: 'Canada',
			},
			resource: null,
		},
		{
			id: 3,
			title: 'Principal Software Engineer',
			company: 'string',
			description: [
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
				'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
				'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
			],
			startDate: new Date(),
			endDate: new Date(),
			location: {
				id: 3,
				city: 'Toronto',
				province: 'Ontario',
				country: 'Canada',
			},
			resource: null,
		},
	],
	educations: [
		{
			id: 1,
			institution: 'University of Ottawa',
			degree: 'BASc Software Engineering',
			startDate: new Date(),
			endDate: new Date(),
			location: {
				id: 4,
				city: 'Ottawa',
				province: 'Ontario',
				country: 'Canada',
			},
			resource: null,
		},
		{
			id: 2,
			institution: 'Ryerson University',
			degree: 'Masters Degree in Electrical Engineering',
			startDate: new Date(),
			endDate: null,
			location: {
				id: 5,
				city: 'Toronto',
				province: 'Ontario',
				country: 'Canada',
			},
			resource: null,
		},
	],
	resource: {
		...new ResourceEntity(),
		firstName: 'John',
		lastName: 'Doe',
		email: 'johndoe@gmail.com',
		phoneNumber: '123-456-7890',
	},
	viewType: ViewType.PRIMARY,
};
