import React from "react";
import { Button } from "../ui/button";

const HeaderButton = ({ name, icon }) => {
  return (
    <Button
      variant="secondary"
      className="rounded-[30px] pl-1 pr-3 text-lg bg-white"
    >
      <div className="bg-[#e5e5e5] rounded-full text-2xl p-2">{icon}</div>
      {name}
    </Button>
  );
};

export default HeaderButton;
