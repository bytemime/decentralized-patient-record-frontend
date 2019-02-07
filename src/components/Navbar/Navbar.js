import React from "react";
import {
  Navbar,
  Alignment,
  NavbarGroup,
  NavbarHeading,
  Colors
} from "@blueprintjs/core";
const NavBar = () => {
  return (
    <Navbar color={Colors.BLACK}>
      <NavbarGroup align={Alignment.LEFT}>
        <NavbarHeading>
          <h3>MediBlock</h3>
        </NavbarHeading>
      </NavbarGroup>
    </Navbar>
  );
};

export default NavBar;
