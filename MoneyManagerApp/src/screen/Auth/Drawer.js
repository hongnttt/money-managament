import { createDrawerNavigator } from '@react-navigation/drawer';

import Account from './Account';
const Drawer = createDrawerNavigator();

export default function MyDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Tài khoản" component={Account} />
    </Drawer.Navigator>
  );
}