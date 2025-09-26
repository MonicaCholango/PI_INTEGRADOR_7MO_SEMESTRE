import {Pipe, PipeTransform} from '@angular/core';
import {FormatUtils} from '../utils/format.utils';
import {API_CONSTANTS, APP_CONSTANTS} from "../models/constants";

@Pipe({
  name: 'photo',
  standalone: true
})
export class PhotoPipe implements PipeTransform {

  transform(value?: string): string {
    if (!value) return APP_CONSTANTS.DEFAULT_MASCOTA_IMAGE;
    return `${API_CONSTANTS.BASE_URL}uploads/${value}`;
  }
}
