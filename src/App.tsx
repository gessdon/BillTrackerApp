import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Provider as PaperProvider} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeScreen from './screens/HomeScreen';
import AddBillScreen from './screens/AddBillScreen';
import StatisticsScreen from './screens/StatisticsScreen';
import OCRScanScreen from './screens/OCRScanScreen';

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({route}) => ({
            tabBarIcon: ({focused, color, size}) => {
              let iconName = 'home';
              
              if (route.name === '首页') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === '添加') {
                iconName = focused ? 'add-circle' : 'add-circle-outline';
              } else if (route.name === '扫描') {
                iconName = focused ? 'scan' : 'scan-outline';
              } else if (route.name === '统计') {
                iconName = focused ? 'stats-chart' : 'stats-chart-outline';
              }
              
              return <Icon name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#6200EE',
            tabBarInactiveTintColor: 'gray',
            headerShown: true,
          })}>
          <Tab.Screen name="首页" component={HomeScreen} />
          <Tab.Screen name="添加" component={AddBillScreen} />
          <Tab.Screen name="扫描" component={OCRScanScreen} />
          <Tab.Screen name="统计" component={StatisticsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
