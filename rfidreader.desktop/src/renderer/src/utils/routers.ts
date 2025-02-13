import { createHashRouter } from 'react-router-dom';
import { createElement } from 'react';

import StudentPage from '@pages/StudentPage';
import DisciplinePage from '@pages/DisciplinePage';
import LessonPage from '@pages/LessonPage';
import GroupPage from '@pages/GroupPage';
import AttendancePage from '@pages/AttendancePage';
import ImportingPage from '@pages/ImportingPage';

export function getPreviousPagePath(): string {
    const paths = document.referrer.split('/')
    let result = ''
    for(const item of paths.splice(3)) {
        result = `${result}/${item}`
    }
    return result
}
export const routers = createHashRouter([
    {
        path: '/groups',
        element: createElement(GroupPage)
    },
    {
        path: '/students/:groupId/:groupName/:studentId?',
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
        path: '/attendance/:disciplineId/:groupId',
        element: createElement(AttendancePage)
    },
    {
        path: '/importing/:groupId',
        element: createElement(ImportingPage)
    }
])