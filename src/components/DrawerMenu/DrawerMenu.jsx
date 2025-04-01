import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Link } from "react-router";

import React from "react";
import { Menu } from "lucide-react";

const DrawerMenu = ({ isOpen, toggleMenu }) => {
  return (
    <Drawer open={isOpen} onOpenChange={toggleMenu}>
      <DrawerTrigger asChild>
        <Menu className="block lg:hidden">☰</Menu>
      </DrawerTrigger>
      <DrawerContent className="bg-[#ffffff] text-[#131313] shadow-lg ">
        <DrawerHeader className="flex items-center justify-between">
          <DrawerTitle className="text-2xl">Menu</DrawerTitle>
          <DrawerClose onClick={toggleMenu} />
        </DrawerHeader>
        <DrawerDescription className="flex flex-col gap-4 p-4 text-[#131313] text-center">
          <Link to="/" onClick={toggleMenu}>
            <p className="text-lg ">Home</p>
          </Link>
          <Link to="/instructors" onClick={toggleMenu}>
            <p className="text-lg">Instructors</p>
          </Link>
          <Link to="/login" onClick={toggleMenu}>
            <p className="text-lg">Login</p>
          </Link>
        </DrawerDescription>
        <DrawerFooter></DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default DrawerMenu;
