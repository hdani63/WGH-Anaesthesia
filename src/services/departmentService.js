import { request } from './apiClient';

export const departmentService = {
	getProtocols() {
		return request('/protocols');
	},

	getTeachingSchedule() {
		return request('/teaching');
	},
};
