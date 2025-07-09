"use client";

import * as React from "react";
import Link from "next/link";
import { CircleCheckIcon, CircleHelpIcon, CircleIcon } from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";

export default function NavigationMenuDemo() {
  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <Link href="/">Home</Link>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <Link
                    className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-2 no-underline outline-hidden select-none focus:shadow-md"
                    href="/"
                  >
                    <img
                      src="/assets/pinggu.jpg"
                      alt="Placeholder"
                      className="w-full h-auto rounded mb-4"
                    />
                    {/* <div className="mt-4 mb-2 text-lg font-medium">
                      Web Logo
                    </div> */}
                    <p className="text-muted-foreground text-sm leading-tight">
                      cute pengguin
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <ListItem href="/" title="Recommended Movies">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ut,
                placeat dolore! Ratione iure reiciendis porro officia quae?
                Veritatis assumenda nisi sequi inventore at quaerat et obcaecati
                laudantium! Aperiam, pariatur molestiae.
              </ListItem>
              <ListItem
                href="/docs/installation"
                title="Movies you might also like"
              >
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ut,
                placeat dolore! Ratione iure reiciendis porro officia quae?
                Veritatis assumenda nisi sequi inventore at quaerat et obcaecati
                laudantium! Aperiam, pariatur molestiae.{" "}
              </ListItem>
              <ListItem
                href="/docs/primitives/typography"
                title="People's Reviews"
              >
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ut,
                placeat dolore! Ratione iure reiciendis porro officia quae?
                Veritatis assumenda nisi sequi inventore at quaerat et obcaecati
                laudantium! Aperiam, pariatur molestiae.{" "}
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <Link href="/recommended">My Favorites</Link>
          </NavigationMenuTrigger>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>With Icon</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[200px] gap-4">
              <li>
                <NavigationMenuLink asChild>
                  <Link href="#" className="flex-row items-center gap-2">
                    <CircleHelpIcon />
                    Backlog
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link href="#" className="flex-row items-center gap-2">
                    <CircleIcon />
                    To Do
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link href="#" className="flex-row items-center gap-2">
                    <CircleCheckIcon />
                    Done
                  </Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
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
