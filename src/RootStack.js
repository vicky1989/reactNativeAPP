import LoginScreen from "./pages/LoginScreen";
import DashboardScreen from "./pages/DashboardScreen";
import { createStackNavigator } from "react-navigation";

export default (RootStack = createStackNavigator(
  {
    Login: LoginScreen,
    Dashboard: DashboardScreen
  },
  {
    initialRouteName: "Login"
  }
));
