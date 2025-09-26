import {Injectable} from '@angular/core';
import {Camera, CameraResultType, CameraSource} from '@capacitor/camera';
import {HttpClient} from '@angular/common/http';
import {API_CONSTANTS} from "../models/constants";

@Injectable({providedIn: 'root'})
export class PhotoService {
  constructor(private http: HttpClient) {
  }

  async takeOrSelectPhoto(source: CameraSource, mascotaId?: number) {
    try {
      const image = await Camera.getPhoto({
        quality: 70,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: source // CameraSource.Camera o CameraSource.Photos
      });

      const base64Image = image.base64String;
      const format = image.format?.toLowerCase() || 'jpeg'; // ej: 'jpeg' o 'png'
      const extension = format === 'jpeg' ? 'jpg' : format;

      const formData = new FormData();
      formData.append('foto', 'data:image/' + format + ';base64,' + base64Image);
      formData.append('id_mascota', (mascotaId || 0).toString());
      formData.append('extension', extension);

      await this.http.post(API_CONSTANTS.BASE_URL + 'adopciones.php?action=foto', formData).toPromise();
      alert('📤 Foto subida con éxito');
      return true;
    } catch (error) {
      console.error('❌ Error al capturar foto', error);
    }
    return false;
  }
}
