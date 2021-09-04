/* eslint-disable */
import { useState } from 'react';
import PaginationJson from './components/PaginationJson';

interface IData {
	data: string[];
}

function App() {
	const jsonData: IData['data'] = [
		'1',
		'2',
		'3',
		'4',
		'5',
		'6',
		'7',
		'8',
		// '9',
		// '10',
		// '11',
		// '12',
		// '13',
		// '14',
		// '15',
		// '16',
		// '17',
		// '18',
		// '19',
		// '20',
		// '21',
		// '22',
		// '23',
		// '24',
		// '25',
		// '26',
		// '27',
		// '28',
		// '29',
		// '30',
		// '31',
		// '32',
		// '33',
		// '34',
		// '35',
		// '36',
		// '37',
		// '38',
		// '39',
		// '40',
		// '41',
		// '42',
		// '43',
		// '44',
		// '45',
		// '46',
		// '47',
		// '48',
		// '49',
		// '50',
		// '51',
		// '52',
		// '53',
		// '54',
		// '55',
		// '56',
		// '57',
		// '58',
		// '59',
		// '60',
		// '61',
		// '62',
		// '63',
		// '64',
		// '65',
		// '66',
		// '67',
		// '68',
		// '69',
		// '70',
		// '71',
		// '72',
		// '73',
		// '74',
		// '75',
		// '76',
		// '77',
		// '78',
		// '79',
		// '80',
		// '81',
		// '82',
		// '83',
		// '84',
		// '85',
		// '86',
		// '87',
		// '88',
		// '89',
		// '90',
		// '91',
		// '92',
		// '93',
		// '94',
		// '95',
		// '96',
		// '97',
		// '98',
		// '99',
		// '100',
		// '101',
		// '102',
		// '103',
		// '104',
		// '105',
		// '106',
		// '107',
		// '108',
		// '109',
		// '110',
		// '111',
		// '112',
		// '113',
		// '114',
		// '115',
		// '116',
		// '117',
		// '118',
		// '119',
		// '120',
		// '121',
		// '122',
		// '123',
		// '124',
		// '125',
		// '126',
		// '127',
		// '128',
		// '129',
		// '130',
		// '131',
		// '132',
		// '133',
		// '134',
		// '135',
		// '136',
		// '137',
		// '138',
		// '139',
		// '140',
		// '141',
		// '142',
		// '143',
		// '144',
		// '145',
		// '146',
		// '147',
		// '148',
		// '149',
		// '150',
		// '151',
		// '152',
		// '153',
		// '154',
		// '155',
		// '156',
		// '157',
		// '158',
		// '159',
		// '160',
		// '161',
	];
	const [paginationCurrentData, setPaginationCurrentData] = useState<IData['data']>([]);

	return (
		<div className="check-scroll">
			<h1>React Next + Typescript + Pagination</h1>
			<h2>Result:</h2>
			<ul className="list-box">
				{paginationCurrentData.map((result: any) => {
					return <li key={result}>{result}</li>;
				})}
			</ul>
			{/* <PaginationJson data={jsonData} setData={setPaginationCurrentData} perPage={3} /> */}
			<PaginationJson
				data="http://react-bhx-pagination/users.php"
				setData={setPaginationCurrentData}
				perPage={3}
			/>
			<p>
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi error iste nostrum,
				quidem cumque fugit ducimus autem modi provident qui in similique vitae porro dignissimos
				perspiciatis odio quis distinctio. Itaque adipisci, ut voluptas tempore quisquam iste sed
				vitae repudiandae odio animi quae. Deleniti vitae alias voluptate magni optio quis nostrum
				excepturi atque ab aperiam eos laudantium velit quidem in iusto, odio labore dolore modi
				officia. Aspernatur repellat non eligendi consequatur perferendis dolorem, mollitia ut, quas
				explicabo voluptatum iste similique. Placeat pariatur nihil iste omnis. Nulla sequi
				distinctio itaque nihil illo molestias nobis, at voluptatibus a, numquam tempore odit et
				dolore?
			</p>
		</div>
	);
}

export default App;
