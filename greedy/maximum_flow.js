const { createNDimArray, copyNDimArray } = require('../util/ndim_arr');
const { floyd_warshall_alg_3, reconstructSimpleCycle } = require('../dynamic_programming/floyd_warshall_alg');
const assert = require('assert');

function find_maximum_flow(flow_network_capacity, source, sink) {
	let n = flow_network_capacity.length;

	let current_flow_value = 0;
	let current_flow = createNDimArray([n, n], 0);
	// available move capacity, including go-back
	let residual_capacity = copyNDimArray(flow_network_capacity);

	while(true) {
		let augment_path = find_augment_path();

		if(augment_path === null)
			break;

		let augment_flow = augment_path.min_flow;
		current_flow_value += augment_flow;

		for(let augment_edge of augment_path.edges) {
			let { u, v } = augment_edge;
			current_flow[u][v] += augment_flow;
			current_flow[v][u] -= augment_flow;
			residual_capacity[u][v] -= augment_flow;
			residual_capacity[v][u] += augment_flow;
		}
	}

	return { flow: current_flow, value: current_flow_value };

	function find_augment_path() {
		let traveled_nodes = new Set();
		let prev_link = [...Array(n)];

		let processing_queue = [source];
		traveled_nodes.add(source);

		while(processing_queue.length !== 0) {
			let u = processing_queue.shift();
			for(let v = 0; v < n; v++) {
				if(residual_capacity[u][v] > 0 && !traveled_nodes.has(v)) {
					processing_queue.push(v);
					traveled_nodes.add(v);

					prev_link[v] = u;

					if(v === sink) {
						processing_queue.length = 0;	// clear the queue to stop processing
						break;
					}
				}
			}
		}

		if(!traveled_nodes.has(sink))
			return null;	// no found augment path can reach the sink

		let edges = [];

		let [u, v] = [sink, undefined];
		while(true) {
			[u, v] = [prev_link[u], u];
			if(u === undefined) break;
			edges.unshift({ u, v });
		}

		return {
			edges,
			min_flow: edges.reduce((acc, {u, v}) => Math.min(acc, residual_capacity[u][v]), +Infinity),
		};
	}
}

// possible for directed graph
function find_maximum_flow_by_labeling(flow_network_capacity, source, sink) {
	const by_increase_input_from = '+', by_decrease_output_to = '-';

	let n = flow_network_capacity.length;

	let current_flow_value = 0;
	let current_flow = createNDimArray([n, n], 0);
	let residual_capacity = copyNDimArray(flow_network_capacity);

	while(true) {
		// compute the labels of the graph
		let current_label = createNDimArray([n], null); {

			current_label[source] = {
				potential_outflow: Infinity,
				target: null,
			};

			let processing_queue = [source];
			while(processing_queue.length !== 0) {
				let u = processing_queue.shift();

				for(let v = 0; v < n; v++) {
					if(current_label[v] !== null)
						continue;

					if(residual_capacity[u][v] > 0) {
						let potential_outflow = Math.min(
							current_label[u].potential_outflow,
							residual_capacity[u][v]
						);
						current_label[v] = {
							potential_outflow,
							method: by_increase_input_from,
							target: u,
						};
					} else if(current_flow[v][u] > 0) {
						let potential_outflow = Math.min(
							current_label[u].potential_outflow,
							current_flow[v][u]
						);
						current_label[v] = {
							potential_outflow,
							method: by_decrease_output_to,
							target: u,
						};
					} else {
						continue;
					}

					// if(v === sink) {
					// 	processing_queue.length = 0;		// clear the queue to stop processing
					// 	break;
					// }

					processing_queue.push(v);
				}
			}
		}

		// break if there is no more possible augment path to the sink
		if(current_label[sink] === null)
			break;

		// augment the flow to the sink
		let deltaFlow = current_label[sink].potential_outflow;
		let [u, v] = [null, sink];

		while(current_label[v].target !== null) {
			u = current_label[v].target;

			if(current_label[v].method === by_increase_input_from) {
				current_flow[u][v] += deltaFlow;
				residual_capacity[u][v] -= deltaFlow;
			} else if(current_label[v].method === by_decrease_output_to) {
				current_flow[v][u] -= deltaFlow;
				residual_capacity[v][u] += deltaFlow;
			}

			v = u;
		}

		current_flow_value += deltaFlow;
	}

	return { flow: current_flow, value: current_flow_value };
}

// warn cycle-finding is to be confirmed
function find_maxflow_with_mincost(flow_network_capacity, flow_network_cost, source, sink) {
	let n = flow_network_capacity.length;

	let current_flow = find_maximum_flow(flow_network_capacity, source, sink).flow;
	let current_flow_cost = 0;

	let residual_network_cost = createNDimArray([n, n], +Infinity);
	let residual_capacity = createNDimArray([n, n]);	// available move capacity, including go-back

	for(let i = 0; i < n; i++) {
		for(let j = 0; j < n; j++) {
			assert(
				flow_network_cost[i][j] >= 0,
				'the flow network cannot have a negative cost!'
			);
			if(current_flow[i][j] > 0)
				current_flow_cost += current_flow[i][j] * flow_network_cost[i][j];
			if(flow_network_cost[i][j] !== +Infinity) {
				residual_network_cost[i][j] = flow_network_cost[i][j];
			} else if(flow_network_cost[j][i] !== +Infinity) {
				residual_network_cost[i][j] = -flow_network_cost[j][i];
			}
			residual_capacity[i][j] = flow_network_capacity[i][j] - current_flow[i][j];
		}
	}

	while(true) {
		let negative_cycle = find_negative_cycle();

		if(negative_cycle === null)
			break;

		let augment_flow = negative_cycle.min_flow;

		for(let augment_edge of negative_cycle.edges) {
			let { u, v } = augment_edge;
			current_flow[u][v] += augment_flow;
			current_flow[v][u] -= augment_flow;

			current_flow_cost += residual_network_cost[u][v] * augment_flow;	// adjust cost

			residual_capacity[u][v] -= augment_flow;
			residual_capacity[v][u] += augment_flow;
		}
	}

	return { flow: current_flow, cost: current_flow_cost };

	function find_negative_cycle() {
		let adj_matrix = createNDimArray([n, n], +Infinity);

		for(let i = 0; i < n; i++)
			for(let j = 0; j < n; j++)
				if(residual_capacity[i][j] > 0)
					adj_matrix[i][j] = residual_network_cost[i][j];

		let edges;
		try {
			floyd_warshall_alg_3(adj_matrix);
		} catch(e) {
			let { distance_matrix, nextnode_matrix } = e.data;
			let index = [...Array(n)].findIndex((_, i) => distance_matrix[i][i] < 0);
			edges = reconstructSimpleCycle(index, nextnode_matrix);
		}
		if(edges === undefined)
			return null;

		return {
			edges: edges,
			min_flow: edges.reduce((acc, {u, v}) => Math.min(acc, residual_capacity[u][v]), +Infinity),
		};
	}
}

module.exports = {
	find_maximum_flow,
	find_maximum_flow_by_labeling,
	find_maxflow_with_mincost,
};
