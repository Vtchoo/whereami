import logo from './logo.svg';
import './App.css';
import { GoogleMapsProvider, Panorama } from './contexts/GoogleMaps';

function App() {
	return (
		<GoogleMapsProvider
			apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
		>
			<Panorama
				options={{
				position: { lat: 46.9171876, lng: 17.8951832 },
				addressControl: false,
				showRoadLabels: false,
				}}
				style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center' }}
			>
				{/* <div className="App"> */}
				{/* <button style={{ position: 'absolute', top: 0, left: 0, zIndex: 100 }}>Teste</button> */}
				{/* <header style={{ zIndex: 2, position: 'absolute', backgroundColor: 'rgba(255,255,255,.25)' }} className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<p>
						Edit <code>src/App.js</code> and save to reload.
        			</p>
					<a
						className="App-link"
						href="https://reactjs.org"
						target="_blank"
						rel="noopener noreferrer"
					>
						Learn React
        			</a>
				</header> */}
				{/* </div> */}
			</Panorama>
		</GoogleMapsProvider>
	)
}

export default App;
