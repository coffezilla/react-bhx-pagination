/* eslint-disable */
import { useState } from 'react';
import PaginationJson from '../PaginationJson';

interface IData {
	data: string[];
}

const SampleJsonServer = () => {
	const [paginationCurrentData, setPaginationCurrentData] = useState<IData['data']>([]);
	return (
		<>
			<h1>Sample Json Local</h1>
			<h2>Result:</h2>
			<ul className="list-box">
				{paginationCurrentData.map((result: any) => {
					return (
						<li key={result.id}>
							{result.name} {result.id}
						</li>
					);
				})}
			</ul>
			<PaginationJson
				data="https://reqres.in/api/products"
				pathData="data"
				setData={setPaginationCurrentData}
				perPage={1}
			/>
		</>
	);
};

export default SampleJsonServer;
