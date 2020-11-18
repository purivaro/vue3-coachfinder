export default {
	// requests(state, getters, rootState, rootGetters) {
	requests(state, _, _2, rootGetters) {
		const coachId = rootGetters.userId
		return state.requests.filter(req => req.coachId === coachId)
	},
	// hasRequests(state, getters) {
	hasRequests(_, getters) {
		return getters.requests && getters.requests.length > 0
	},
	shouldUpdate(state) {
		const lastFetch = state.lastFetch
		if(!lastFetch) {
			return true
		}
		const currentTimestamp = new Date().getTime()
		return (currentTimestamp - lastFetch)/1000 > 60
	},
}