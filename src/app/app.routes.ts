import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Profile } from './profile/profile';
import { Expenses } from './expenses/expenses';

export const routes: Routes = [
    {
        path: '',
        component: Home,
        title: 'Home page'
    },
    {
        path: 'profile',
        component: Profile,
        title: 'Profile page'
    },
    {
        path: 'expenses',
        component: Expenses,
        title: 'Expenses page'
    }
];
