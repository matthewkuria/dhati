'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import {
  UserCircleIcon,
  HomeIcon,
  WindowIcon,
  BanknotesIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Home', href: '/member-dashboard', icon: HomeIcon },
  {
    name: 'My Details',
    href: '/member-dashboard/my-details',
    icon: UserCircleIcon,
  },
  {
    name: 'My Contributions',
    href: '/member-dashboard/my-contributions',
    icon: BanknotesIcon,
  },
  {
    name: 'My Groups',
    href: '/member-dashboard/my-groups',
    icon: UsersIcon,
  },
   { name: 'Events', href: '/member-dashboard/events', icon: WindowIcon },
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
