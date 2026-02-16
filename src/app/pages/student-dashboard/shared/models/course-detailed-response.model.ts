import {EducatorsResponseModel} from '../../../educators/shared/models/educators-response.model';
import {TopicRequestModel} from '../../../dashboard/shared/models/topic-request.model';

export class CourseDetailedResponseModel {
  id: string
  educatorId: string
  systemLanguageId: string
  image: string
  name: string
  description: string
  language: string
  educator: EducatorsResponseModel = new EducatorsResponseModel()
  topics: TopicRequestModel[]=[]
  rating: any;
  startDate: any;
  endDate: any;
  takenSeats: any;
  maximumSeats: any;
  minimumSeats: any;
  takenSeatsPercentage: any;
  price: any;
  learningPoints: any[]=[];
}
