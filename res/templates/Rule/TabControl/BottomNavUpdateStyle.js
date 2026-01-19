// export option #1 using default es6 syntax
export default function BottomNavUpdateStyle(clientAPI) {
  let bottomNav = clientAPI.getPageProxy().getControl("BottomNavigationControl");
  return bottomNav.setStyle('BottomNavStyle');
}