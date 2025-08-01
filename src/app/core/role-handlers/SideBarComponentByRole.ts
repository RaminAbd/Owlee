import {AdminNavigationBarComponent} from '../../shared/components/navigation-bars/admin-navigation-bar/admin-navigation-bar.component';
import {
  EducatorNavigationBarComponent
} from '../../shared/components/navigation-bars/educator-navigation-bar/educator-navigation-bar.component';
import {
  StudentNavigationBarComponent
} from '../../shared/components/navigation-bars/student-navigation-bar/student-navigation-bar.component';

export const SideBarComponentByRole = {
  'Admin':AdminNavigationBarComponent,
  'Educator':EducatorNavigationBarComponent,
  'Student':StudentNavigationBarComponent,
};
