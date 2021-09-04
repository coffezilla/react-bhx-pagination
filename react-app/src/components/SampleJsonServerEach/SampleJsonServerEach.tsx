/* eslint-disable */
import { useState } from 'react';
import PaginationJson from '../PaginationJson';

interface IData {
	data: string[];
}

const SampleJsonServerEach = () => {
	const [paginationCurrentData, setPaginationCurrentData] = useState<IData['data']>([]);
	return (
		<>
			<h1>Sample Json Local</h1>
			<h2>Result:</h2>
			<ul className="list-box-local">
				{paginationCurrentData.map((result: any) => {
					return <li key={result}>{result}</li>;
				})}
			</ul>
			<PaginationJson
				data="http://react-bhx-pagination/users.php"
				setData={setPaginationCurrentData}
				saveLocalJson={false}
				autoLoad
				pathData="list"
				perPage={20}
			/>
		</>
	);
};

export default SampleJsonServerEach;
