import { MultilingualNameModel } from '../../../../core/models/multilingual-name.model';
import {FileModel} from '../../../../core/models/File.model';

export class KnownLanguagesRequestModel {
  name: MultilingualNameModel = new MultilingualNameModel();
  icon:FileModel = new FileModel();
}
