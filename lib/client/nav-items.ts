import { createElement } from 'react';
import {
  IconLayout, IconList, IconPlus, IconBell, IconStar, IconUser, IconHelp,
  IconUsers, IconTriangleAlert, IconBuilding, IconFile,
} from '@/components/Icons';
import type { SidebarItem } from '@/components/AppShell';

export const citizenNav: SidebarItem[] = [
  { key: 'c-dashboard', label: 'Dashboard', icon: createElement(IconLayout, { size: 17 }), href: '/citizen/dashboard' },
  { key: 'c-complaints', label: 'My Complaints', icon: createElement(IconList, { size: 17 }), href: '/citizen/complaints' },
  { key: 'c-report', label: 'Report a Problem', icon: createElement(IconPlus, { size: 17 }), href: '/citizen/report' },
  { key: 'c-notifications', label: 'Notifications', icon: createElement(IconBell, { size: 17 }), href: '/citizen/notifications' },
  { key: 'c-feedback', label: 'Feedback', icon: createElement(IconStar, { size: 17 }), href: '/citizen/feedback' },
  { key: 'c-profile', label: 'Profile', icon: createElement(IconUser, { size: 17 }), href: '/citizen/profile' },
  { key: 'c-help', label: 'Help', icon: createElement(IconHelp, { size: 17 }), href: '/citizen/help' },
];

export const authorityNav: SidebarItem[] = [
  { key: 'a-dashboard', label: 'Dashboard', icon: createElement(IconLayout, { size: 17 }), href: '/authority/dashboard' },
  { key: 'a-complaints', label: 'My Assigned', icon: createElement(IconList, { size: 17 }), href: '/authority/complaints' },
  { key: 'a-profile', label: 'Profile', icon: createElement(IconUser, { size: 17 }), href: '/authority/profile' },
];

export const deptAdminNav: SidebarItem[] = [
  { key: 'd-overview', label: 'Overview', icon: createElement(IconLayout, { size: 17 }), href: '/dept-admin/overview' },
  { key: 'd-complaints', label: 'Complaints', icon: createElement(IconList, { size: 17 }), href: '/dept-admin/complaints' },
  { key: 'd-authorities', label: 'Authorities', icon: createElement(IconUsers, { size: 17 }), href: '/dept-admin/authorities' },
  { key: 'd-escalations', label: 'Escalations', icon: createElement(IconTriangleAlert, { size: 17 }), href: '/dept-admin/escalations' },
];

export const superAdminNav: SidebarItem[] = [
  { key: 's-overview', label: 'Overview', icon: createElement(IconLayout, { size: 17 }), href: '/super-admin/overview' },
  { key: 's-departments', label: 'Departments', icon: createElement(IconBuilding, { size: 17 }), href: '/super-admin/departments' },
  { key: 's-deptadmins', label: 'Department Admins', icon: createElement(IconUsers, { size: 17 }), href: '/super-admin/dept-admins' },
  { key: 's-audit', label: 'Audit Logs', icon: createElement(IconFile, { size: 17 }), href: '/super-admin/audit' },
];
