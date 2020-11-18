import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Hidden from "@material-ui/core/Hidden";
import Drawer from "@material-ui/core/Drawer";
// @material-ui/icons
import Menu from "@material-ui/icons/Menu";
// core components
import styles from "assets/jss/material-kit-react/components/headerStyle.js";

import HeaderLinks from "./HeaderLinks.js";

const useStyles = makeStyles(styles);

export default function Header(props) {
  const color = "transparent";
  const { brand, fixed, absolute } = props;
  const classes = useStyles();
  const appBarClasses = classNames({
    [classes.appBar]: true,
    [classes[color]]: color,
    [classes.absolute]: absolute,
    [classes.fixed]: fixed
  });

  /** Drawer Toggle */
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  /** Controlling the header effect to change color on scroll */
  React.useEffect(() => {
    window.addEventListener("scroll", headerColorChange);
    return function cleanup() {
      window.removeEventListener("scroll", headerColorChange);
    };
  });

  const headerColorChange = () => {
    const normalColor = color;
    const windowsScrollTop = window.pageYOffset;
    const limitHeight = 400;
    const scrolledColor = "white";
    let classList = document.body.getElementsByTagName("header")[0].classList;
    if (windowsScrollTop > limitHeight) {
      classList.remove(classes[normalColor]);
      classList.add(classes[scrolledColor]);
    } else {
      classList.add(classes[normalColor]);
      classList.remove(classes[scrolledColor]);
    }
  };

  const brandComponent = <Button className={classes.title}>{brand}</Button>;

  return (
    <AppBar className={appBarClasses}>
      <Toolbar className={classes.container}>
        {brandComponent}
        <Hidden smDown implementation="css">
          <HeaderLinks />
        </Hidden>
        <Hidden mdUp>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
          >
            <Menu />
          </IconButton>
        </Hidden>
      </Toolbar>
      <Hidden mdUp implementation="js">
        <Drawer
          variant="temporary"
          anchor={"right"}
          open={mobileOpen}
          classes={{
            paper: classes.drawerPaper
          }}
          onClose={handleDrawerToggle}
        >
          <div className={classes.appResponsive}>
            <HeaderLinks />
          </div>
        </Drawer>
      </Hidden>
    </AppBar>
  );
}

Header.defaultProp = {
  color: "white"
};

Header.propTypes = {
  brand: PropTypes.string,
  fixed: PropTypes.bool,
  absolute: PropTypes.bool,
};
