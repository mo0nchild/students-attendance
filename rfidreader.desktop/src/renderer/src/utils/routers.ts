import { createBrowserRouter } from 'react-router-dom';
import { createElement } from 'react';

import StudentPage from '@pages/StudentPage';
import DisciplinePage from '@pages/DisciplinePage';
import LessonPage from '@pages/LessonPage';
import GroupPage from '@pages/GroupPage';
import AttendancePage from '@pages/AttendancePage';
import GroupTablePage from '@pages/GroupTablePage';
import ImportingPage from '@pages/ImportingPage';

export function getPreviousPagePath(): string {
    const paths = document.referrer.split('/')
    let result = ''
    for(const item of paths.splice(3)) {
        result = `${result}/${item}`
    }
    return result
}
export const routers = createBrowserRouter([
    {
        path: '/groups',
        element: createElement(GroupPage)
    },
    {
        path: '/students/:groupId/:groupName',
        element: createElement(StudentPage)
    },
    {
        path: '/',
        element: createElement(DisciplinePage)
    }, 
    {
        path: '/lessons/:disciplineId',
        element: createElement(LessonPage)
    },
    {
        path: '/attendance/:lessonId/:disciplineId',
        element: createElement(AttendancePage)
    },
    {
        path: '/groupTable/:disciplineId/:groupId',
        element: createElement(GroupTablePage)
    },
    {
        path: '/importing/:groupId',
        element: createElement(ImportingPage)
    }
])