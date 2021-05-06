import logo from './logo.svg';
import './App.css';
import { GoogleMapsProvider, Panorama } from './contexts/GoogleMaps';
import { AuthProvider } from './contexts/AuthContext';
import MainNavigation from './navigation';

function App() {
	return (
		<AuthProvider>
			<GoogleMapsProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
				<MainNavigation />
			</GoogleMapsProvider>
		</AuthProvider>

		// <GoogleMapsProvider
		// 	apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
		// >
		// 	<Panorama
		// 		options={{
		// 			position: { lat: 46.9171876, lng: 17.8951832 },
		// 			addressControl: false,
		// 			showRoadLabels: false,
		// 		}}
		// 		style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center' }}
		// 	>
		// 	</Panorama>
		// </GoogleMapsProvider>
	)
}

export default App;
