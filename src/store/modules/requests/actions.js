export default {
	async contactCoach(context, payload) {
		// const id = new Date().toISOString()
		const newRequest = {
			// coachId: payload.coachId,
			userEmail: payload.email,
			message: payload.message,
		}

		const response = await fetch(`https://vue-http-demo-168b8.firebaseio.com/requests/${payload.coachId}.json`, {
			method: 'POST',
			body: JSON.stringify(newRequest)
		})

		if(!response.ok) {
			const error = new Error(responseData.message || 'Failed to send request')
			throw error
		}

		const responseData = await response.json()

		newRequest.id = responseData.name
		newRequest.coachId = payload.coachId

		context.commit('addRequest', newRequest)
	},

	async fetchRequest(context, payload) {

		if(!context.getters.shouldUpdate && !payload.forceRefresh) {
			return;
		}

		const coachId = context.rootGetters.userId
		const token = context.rootGetters.token
		const response = await fetch(`https://vue-http-demo-168b8.firebaseio.com/requests/${coachId}.json?auth=`+token)
		const responseData = await response.json()

		if(!response.ok) {
			const error = new Error(responseData.message || 'Failed to fetch request')
			throw error
		}

		const requests = []

		for (const key in responseData) {
			const request = {
				id: key,
				coachId,
				message: responseData[key].message,
				userEmail: responseData[key].userEmail,
			}
			requests.push(request)
		}

		context.commit('setRequests', requests)
		context.commit('setFetchTimestamp')

	}
}