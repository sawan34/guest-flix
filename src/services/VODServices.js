import Method from './services'
import {API_INTERFACE} from '../constants'

export default class VODService {
	constructor(endpointUrl) {
		this.endpointUrl = endpointUrl;
	}
	getData() {
		return Method.get(this.endpointUrl+'movies','')
		.then(response =>
			response.status === 200 ? response.data : []
		)
		.catch(error =>
			console.log(error)
		);
	}
}