'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import {
  UserCircleIcon,
  HomeIcon,
  BanknotesIcon,
  ArrowLeftStartOnRectangleIcon,
  PhoneIcon,
  
  BellIcon
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
    name: 'My Taxes',
    href: '/member-dashboard/taxes',
    icon: BanknotesIcon,
  },
  {
    name: 'Notifications',
    href: '/member-dashboard/notifications',
    icon: BellIcon,
  },
  {
    name: 'Logout',
    href: '/logout',
    icon: ArrowLeftStartOnRectangleIcon,

  }
  
  
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
              "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-xs font-medium hover:bg-secondary hover:text-quaternary md:flex-none md:justify-start md:p-2 md:px-3",
              {
                'bg-quaternary text-secondary': pathname === link.href,
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
