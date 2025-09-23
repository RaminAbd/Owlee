export class MeetingRequestModel {
  id:string;
  date: string;
  groupId: string;
  subtopics: string[] = [];
  link?: string;
  duration: number;
  courseId: string;
}
