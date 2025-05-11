import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { ValidRoles } from '../auth/interfaces/valid-roles';
import { PromptDto } from './dto/ai.dto';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('generate-text')
  @Auth(ValidRoles.admin, ValidRoles.manager, ValidRoles.client)
  async generateText(@Body() promptDto: PromptDto) {
    return this.aiService.generateText(promptDto.prompt);
  }

  @Post('generate-image')
  @Auth(ValidRoles.admin, ValidRoles.manager, ValidRoles.client)
  async generate(@Body() promptDto: PromptDto) {
    return this.aiService.generateImage(promptDto.prompt);
  }

}
