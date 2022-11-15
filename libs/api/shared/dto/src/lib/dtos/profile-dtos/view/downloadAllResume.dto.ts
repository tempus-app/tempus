import { IDownloadAllResumesDto } from '@tempus/shared-domain';

export class DownloadAllResumesDto implements IDownloadAllResumesDto {
	resourceIds?: number[];
}
