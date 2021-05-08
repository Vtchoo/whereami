class MathUtils {

	static rad(degrees: number) {
		return degrees * Math.PI / 180;
	}
      
	static geoDistanceInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
		const earthRadiusKm = 6371;
      
		const dLat = MathUtils.rad(lat2 - lat1);
		const dLon = MathUtils.rad(lon2 - lon1);
      
		lat1 = MathUtils.rad(lat1);
		lat2 = MathUtils.rad(lat2);
      
		const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		
		return earthRadiusKm * c;
	}
}

export default MathUtils
