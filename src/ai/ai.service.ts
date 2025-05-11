
import { ConfigService } from '@nestjs/config';
import {
  Injectable,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import axios, { AxiosError } from 'axios';

@Injectable()
export class AiService {
  private readonly apiKeyMessage: string;
  private readonly apiUrlMessage: string;
  private readonly apiKeyImage: string;
  private readonly apiUrlImage: string;

  constructor(private configService: ConfigService) {
    this.apiKeyMessage = this.configService.get<string>('GEMINI_API_KEY') || '';
    this.apiUrlMessage = this.configService.get<string>('GEMINI_API_URL') || '';
    this.apiKeyImage = this.configService.get<string>('HUGGING_FACE_API_KEY') || '';
    this.apiUrlImage = this.configService.get<string>('IMAGE_API_URL') || '';

  }

  async generateText(prompt: string): Promise<string> {
    try {
      const response = await axios.post(
        `${this.apiUrlMessage}?key=${this.apiKeyMessage}`,
        {
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const candidates = (response.data as { candidates: { content: { parts: { text: string }[] } }[] }).candidates;
      if (candidates && candidates.length > 0 && candidates[0].content?.parts?.[0]?.text) {
        return candidates[0].content.parts[0].text;
      }

      throw new InternalServerErrorException('No response from Gemini API');

    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;

        // Usamos un mensaje más específico si el error tiene un campo 'error' en 'data'
        const message =
          typeof data === 'object' && data.error
            ? data.error
            : 'Failed to generate text from Gemini API';

        // Lanzamos la excepción con el código de estado HTTP y el mensaje de error
        throw new HttpException(message, status);
      } else {
        // Si no hay respuesta HTTP, lanzamos un error genérico del servidor
        throw new InternalServerErrorException('Failed to generate text due to a server issue');
      }
    }
  }

  async generateImage(prompt: string): Promise<string> {
    try {
      const response = await axios.post(this.apiUrlImage, { prompt }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const imageUrl = response.data.images?.[0];

      if (!imageUrl) {
        throw new InternalServerErrorException('Image URL was not found in the API response.');
      }

      return imageUrl;

    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;

        if (axiosError.response) {
          const status = axiosError.response.status;

          switch (status) {
            case 400:
              throw new BadRequestException('Invalid request to the image generation API.');
            case 401:
            case 403:
              throw new UnauthorizedException('You are not authorized to generate images.');
            case 404:
              throw new NotFoundException('The image generation service was not found.');
            default:
              throw new HttpException(`External service error: ${axiosError.response.statusText}`, status);
          }
        }

        // If no response (e.g., timeout, DNS error)
        throw new HttpException('Could not reach the image generation API.', HttpStatus.SERVICE_UNAVAILABLE);
      }

      // Unknown or internal error
      console.error('Unexpected error generating image:', error);
      throw new InternalServerErrorException('An unexpected error occurred while generating the image.');
    }
}

}

