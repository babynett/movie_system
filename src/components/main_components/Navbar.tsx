"use client";

import * as React from "react";
import Link from "next/link";
import { ChatCircle, User, SignOut, Heart } from "phosphor-react";
import Image from "next/image";
import { useAuth } from "@/app/context/AuthContext";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";

export default function NavigationMenuDemo() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Home</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <Link
                    className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-2 no-underline outline-hidden select-none focus:shadow-md"
                    href="/"
                  >
                    <Image
                      src="/assets/pinggu.jpg"
                      alt="Placeholder"
                      className="w-full h-auto rounded mb-4"
                      height={500}
                      width={500}
                    />
                    <p className="text-muted-foreground text-sm leading-tight">
                      cute pengguin
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <ListItem href="/" title="Recommended Movies">
                Discover personalized movie recommendations based on your
                preferences
              </ListItem>
              <ListItem href="/views/favorites" title="My Favorites">
                View and manage your favorite movies collection
              </ListItem>
              <ListItem href="/views/chat" title="Community Chat">
                Connect with other movie enthusiasts in our community chat
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/views/favorites" className="flex items-center gap-2">
              <Heart size={16} />
              Favorites
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/views/chat" className="flex items-center gap-2">
              <ChatCircle size={16} />
              Chat
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        {isAuthenticated ? (
          <NavigationMenuItem>
            <NavigationMenuTrigger>
              <div className="flex items-center gap-2">
                <User size={16} />
                {user?.username || "Account"}
              </div>
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[200px] gap-4 p-4">
                <li>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/views/profile"
                      className="flex items-center gap-2"
                    >
                      <User size={16} />
                      Profile
                    </Link>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/views/friends"
                      className="flex items-center gap-2"
                    >
                      <User size={16} />
                      Friends
                    </Link>
                  </NavigationMenuLink>
                </li>
                <li>
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <SignOut size={16} />
                    Sign Out
                  </button>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ) : (
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link
                href="/views/auth/signin"
                className="flex items-center gap-2"
              >
                <User size={16} />
                Sign In
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

//comments
{
  /* <NavigationMenuItem>
<NavigationMenuTrigger>
  Practice Space 
</NavigationMenuTrigger>
<NavigationMenuContent>
  <ul className="grid w-[200px] gap-4">
    <li>
      <NavigationMenuLink asChild>
        <Link
          href="/views/practicespace"
          className="flex items-center gap-2"
        >
          <CircleCheckIcon /> UseState
        </Link>
      </NavigationMenuLink>
    </li>
    <li>
      <NavigationMenuLink asChild>
        <Link href="#" className="flex items-center gap-2">
          <CircleCheckIcon /> UseEffect
        </Link>
      </NavigationMenuLink>
    </li>
    <li>
      <NavigationMenuLink asChild>
        <Link href="#" className="flex items-center gap-2">
          <CircleCheckIcon />
          UseContext
        </Link>
      </NavigationMenuLink>
    </li>
    <li>
      <NavigationMenuLink asChild>
        <Link href="#" className="flex items-center gap-2">
          <CircleCheckIcon /> UseReducer
        </Link>
      </NavigationMenuLink>
    </li>
  </ul>
</NavigationMenuContent>
</NavigationMenuItem> */
}
