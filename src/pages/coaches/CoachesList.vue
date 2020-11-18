<template>
	<div>
		<base-dialog :show="!!error" title="An error occured!" @close="handleError">
			<p>{{error}}</p>
		</base-dialog>
		<section>
			<coach-filter @change-filter="setFilters"></coach-filter>
		</section>
		<section>
			<base-card>
				<div class="controls">
					<base-button mode="outline" @click="loadCoaches(true)">Refresh</base-button>
					<base-button link to="/auth?redirect=register" v-if="!isLoggedIn">Login to Register as Coach</base-button>
					<base-button to="/register" link v-if="!isCoach && !isLoading && isLoggedIn">Register as Coach</base-button>
				</div>
				<div v-if="isLoading">
					<base-spinner></base-spinner>
				</div>
				<div v-else-if="hasCoaches">
					<h2>List of Coaches</h2>
					<ul>
						<coach-item
							v-for="coach in filteredCoaches"
							:key="coach.id"
							:id="coach.id"
							:firstName="coach.firstName"
							:lastName="coach.lastName"
							:rate="coach.hourlyRate"
							:areas="coach.areas"
						></coach-item>
					</ul>
				</div>
				<h2 v-else>No coaches found.</h2>
			</base-card>
		</section>
	</div>
</template>

<script>
import CoachItem from '@/components/coaches/CoachItem';
import CoachFilter from '@/components/coaches/CoachFilter.vue';

export default {
  components: {
    CoachItem,
    CoachFilter
	},
	data() {
		return {
			error: null,
			isLoading: false,
			activeFilters: {
				frontend: true,
				backend: true,
				career: true,
			}
		}
	},
  computed: {
		isLoggedIn() {
			return this.$store.getters.isAuthenticated
		},
    filteredCoaches() {
			const coaches =  this.$store.getters['coaches/coaches'];
			// console.log(coaches)
			return coaches.filter(coach => {
				if(this.activeFilters.frontend && coach.areas.includes('frontend')) {
					return true
				}
				if(this.activeFilters.backend && coach.areas.includes('backend')) {
					return true
				}
				if(this.activeFilters.career && coach.areas.includes('career')) {
					return true
				}
				return false
			})
    },
    hasCoaches() {
      // return this.$store.getters['coaches/hasCoaches'];
      return !this.isLoading && this.filteredCoaches.length;
		},
		isCoach() {
			return this.$store.getters['coaches/isCoach']
		},
	},
	methods: {
		setFilters(updatedFilter) {
			this.activeFilters = updatedFilter
		},
		async loadCoaches(refresh = false) {
			this.isLoading = true
			try {
				await this.$store.dispatch('coaches/loadCoaches', {forceRefresh: refresh})
			} catch(error) {
				this.error = error.message || 'Something went wrong'
			}
			this.isLoading = false
		},
		handleError() {
			this.error = null
		}
	},
	created() {
		this.loadCoaches()
	}
};
</script>

<style scoped>
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.controls {
  display: flex;
  justify-content: space-between;
}
</style>
