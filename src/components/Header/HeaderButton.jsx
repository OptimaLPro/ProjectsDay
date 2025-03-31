import React from "react";
import { Button } from "../ui/button";
import { Link } from "react-router";

const HeaderButton = ({ name, icon, link }) => {
  return (
    <Link to={"/" + link}>
      <Button
        variant="secondary"
        className="rounded-[30px] pl-1 pr-3 text-lg bg-white"
      >
        <div className="bg-[#e5e5e5] rounded-full text-2xl p-2">{icon}</div>
        {name}
      </Button>
    </Link>
  );
};

export default HeaderButton;
