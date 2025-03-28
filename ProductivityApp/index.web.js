import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// Register the app
AppRegistry.registerComponent(appName, () => App);

// Set up the web specific rendering
if (window.document) {
  const rootTag = document.getElementById('root') || document.getElementById('main');
  AppRegistry.runApplication(appName, { rootTag });
} 