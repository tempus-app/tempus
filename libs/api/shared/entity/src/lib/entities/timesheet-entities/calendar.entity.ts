import { Calendar } from '@tempus/shared-domain';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CalendarEntity implements Calendar {
	constructor(id?: number, holidayDates?: string[]) {
		this.id = id;
		this.holidayDates = holidayDates;
	}

	@PrimaryGeneratedColumn()
	id: number;

	@Column({ nullable: true })
	holidayDates: string[];
}
