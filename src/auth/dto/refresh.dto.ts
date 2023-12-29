import { ApiProperty } from '@nestjs/swagger';

export class RefreshDto {
  @ApiProperty()
  refresh_token: string;
  constructor(refresh_token: string) {
    this.refresh_token = refresh_token;
  }
}
