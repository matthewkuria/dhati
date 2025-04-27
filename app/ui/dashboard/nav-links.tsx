'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import {
  UserIcon,
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  BriefcaseIcon,
  WindowIcon,
} from '@heroicons/react/24/outline';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  {
    name: 'Registration',
    href: '/dashboard/members',
    icon: UserIcon,
  },
  { name: 'Groups', href: '/dashboard/groups', icon: UserGroupIcon  },
  { name: 'Attendances', href: '/dashboard/attendances', icon: BriefcaseIcon },
  { name: 'Events', href: '/dashboard/events', icon: WindowIcon },
  { name: 'Inventory', href: '/dashboard/inventory', icon: DocumentDuplicateIcon  },
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-xs font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
              {
                'bg-sky-100 text-blue-600': pathname === link.href,
              }
            )

            }
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
