/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import {
	ForbiddenException,
	forwardRef,
	Inject,
	Injectable,
	InternalServerErrorException,
	Logger,
	UnauthorizedException,
} from '@nestjs/common';
import {
	TokensDto,
	User,
	JwtPayload,
	JwtRefreshPayloadWithToken,
	AuthDto,
	PasswordReset,
	PasswordResetStatus,
	ResetPasswordDto,
} from '@tempus/shared-domain';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { getManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordResetEntity, UserEntity } from '@tempus/api/shared/entity';
import { ConfigService } from '@nestjs/config';
import { CommonService } from '@tempus/api/shared/feature-common';
import { v4 as uuidv4 } from 'uuid';
import { EmailService } from '@tempus/api/shared/feature-email';
import { UpdateUserDto } from '@tempus/api/shared/dto';
import { UserService } from '@tempus/onboarding-api/feature-account';

@Injectable()
export class AuthService {
	private readonly logger = new Logger(AuthService.name);

	constructor(
		private jwtService: JwtService,
		private emailService: EmailService,
		@InjectRepository(UserEntity)
		private userRepository: Repository<UserEntity>,
		@InjectRepository(PasswordResetEntity)
		private passwordResetRepository: Repository<PasswordResetEntity>,
		private configService: ConfigService,
		private commonService: CommonService,
		@Inject(forwardRef(() => UserService))
		private userService: UserService,
	) {}

	async login(user: User): Promise<AuthDto> {
		const tokens = await this.createTokens(user);
		await this.updateRefreshTokenHash(user, tokens.refreshToken);
		const partialUser: UserEntity = { ...user };
		partialUser.password = null;
		partialUser.refreshToken = null;
		const result = new AuthDto(partialUser, tokens.accessToken, tokens.refreshToken);
		this.logger.log(`${partialUser.email} logged in as ${partialUser.roles}`);
		return result;
	}

	async resetPassword(resetPasswordDto: ResetPasswordDto) {
		const data = await this.passwordResetRepository.find({
			where: { token: resetPasswordDto.token },
			relations: ['user'],
		});
		if (data.length === 0) {
			throw new Error('Invalid token provided');
		}
		const passwordResetDetails = data[0];

		if (passwordResetDetails.user.email !== resetPasswordDto.email) {
			throw new Error('Invalid token or email provided');
		}

		if (this.isTokenValid(passwordResetDetails)) {
			// reset password
			const updateUserDto = new UpdateUserDto(passwordResetDetails.user.id);
			updateUserDto.password = resetPasswordDto.newPassword;
			await this.userService.updateUser(updateUserDto);
			this.passwordResetRepository.save({ ...passwordResetDetails, status: PasswordResetStatus.INVALID });
		}
		this.logger.log(`${resetPasswordDto.email} has successfully changed their password`);
	}

	private isTokenValid(passwordResetDetails: PasswordResetEntity) {
		if (passwordResetDetails.expiry.getTime() < Date.now()) {
			this.passwordResetRepository.save({ ...passwordResetDetails, status: PasswordResetStatus.INVALID });
			throw new Error('Reset link has expired');
		} else if (passwordResetDetails.status !== PasswordResetStatus.VALID) {
			throw new Error('Invalid reset link');
		} else {
			return true;
		}
	}

	async forgotPassword(userEmail: string): Promise<void> {
		const user = await this.commonService.findByEmail(userEmail); // if user does not exist, will throw error
		const token = uuidv4();

		// expire in 24 hours
		const currentDate = new Date();
		const expiryDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);

		const passwordReset: PasswordReset = new PasswordResetEntity(
			null,
			user,
			expiryDate,
			token,
			PasswordResetStatus.VALID, // valid on reaction
		);
		await this.saveResetDetailsAndSendEmail(passwordReset);
		this.logger.log(`${user.email} has requested a password change`);
	}

	async saveResetDetailsAndSendEmail(passwordResetDetails: PasswordResetEntity) {
		return getManager().transaction(async manager => {
			const oldRequests = await manager.getRepository(PasswordResetEntity).find({
				where: { user: passwordResetDetails.user },
			});
			// if the user repeatedly sends reset reuqests, we want the last one to be valid
			oldRequests.forEach(async request => {
				await manager
					.getRepository(PasswordResetEntity)
					.save({ ...request, status: PasswordResetStatus.INVALID });
			});
			await manager.getRepository(PasswordResetEntity).save(passwordResetDetails);
			try {
				await this.emailService.sendResetEmail(passwordResetDetails);
			} catch (err) {
				throw new Error('Email unable to be sent.');
			}
		});
	}

	async logout(token: JwtPayload) {
		const user = await this.commonService.findByEmail(token.email);
		await this.updateRefreshTokenHash(user, null);
		this.logger.log(`${user.email} logged out`);
	}

	async refreshToken(payload: JwtRefreshPayloadWithToken) {
		const user = await this.commonService.findByEmail(payload.email);
		if (!user.refreshToken) {
			throw new ForbiddenException('User not logged in');
		}
		if (AuthService.compareData(payload.refreshToken, user.refreshToken)) {
			const tokens = await this.createTokens(user);
			await this.updateRefreshTokenHash(user, tokens.refreshToken);
			return tokens;
		}
		throw new ForbiddenException('Access Denied');
	}

	async validateUser(email: string, password: string): Promise<User> {
		const user = await this.userService.findByEmail(email);
		if (!user) {
			console.log(`User not found: ${email}`);
			throw new UnauthorizedException('Incorrect credentials.');
		}
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			console.log(`Password mismatch for user: ${email}`);
			throw new UnauthorizedException('Incorrect credentials.');
		}
		return user;
	}

	private static compareData(data: string, hashedData: string): boolean {
		try {
			return bcrypt.compare(data, hashedData);
		} catch (e) {
			throw new InternalServerErrorException(e);
		}
	}

	private async updateRefreshTokenHash(user: User, refreshToken: string) {
		const tokenOwner = user;
		const salt = await bcrypt.genSalt(this.configService.get('saltSecret'));

		// logging user out by setting their refreshToken to null
		if (!refreshToken) {
			tokenOwner.refreshToken = null;
		} else {
			const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);
			tokenOwner.refreshToken = hashedRefreshToken;
		}
		await this.userRepository.save(tokenOwner);
	}

	private async createTokens(user: User): Promise<TokensDto> {
		const accessToken = await this.jwtService.signAsync(
			{
				email: user.email,
				roles: user.roles,
			},
			{
				secret: this.configService.get('jwtAccessSecret'),
				expiresIn: 60 * 15,
			},
		);
		const refreshToken = await this.jwtService.signAsync(
			{
				email: user.email,
			},
			{
				secret: this.configService.get('jwtRefreshSecret'),
				expiresIn: 60 * 120,
			},
		);
		const tokens = new TokensDto(accessToken, refreshToken);
		return tokens;
	}
}
