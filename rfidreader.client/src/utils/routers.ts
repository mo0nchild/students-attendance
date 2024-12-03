import { createBrowserRouter } from 'react-router-dom';
import { createElement } from 'react';

import HomePage from '@pages/HomePage';
import StudentPage from '@pages/StudentPage';
import LecturerPage from '@pages/LecturerPage';
import DisciplinePage from '@pages/DisciplinePage';
import LessonPage from '@pages/LessonPage';
import GroupPage from '@pages/GroupPage';

export const routers = createBrowserRouter([
    {
        path: '/',
        element: createElement(HomePage)
    }, 
    {
        path: '/groups',
        element: createElement(GroupPage)
    },
    {
        path: '/students/:groupId',
        element: createElement(StudentPage)
    },
    {
        path: '/lecturers',
        element: createElement(LecturerPage)
    }, 
    {
        path: '/disciplines',
        element: createElement(DisciplinePage)
    }, 
    {
        path: '/lessons/:discipline',
        element: createElement(LessonPage)
    }
])