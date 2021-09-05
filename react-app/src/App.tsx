import { useState } from 'react';

import SampleJsonLocal from './components/SampleJsonLocal';
import SampleJsonServer from './components/SampleJsonServer';
import SampleJsonServerEach from './components/SampleJsonServerEach';
import SampleJsonLocalAuto from './components/SampleJsonLocalAuto';
import SampleJsonServerAuto from './components/SampleJsonServerAuto';
import SampleJsonServerEachAuto from './components/SampleJsonServerEachAuto';

function App() {
	const [sampleType, setSampleType] = useState<number>(1);

	return (
		<div>
			<h1>React Next + Typescript + Pagination</h1>
			<button onClick={() => setSampleType(1)} type="button">
				Sample 1 - Local Json
			</button>
			<br />
			<button onClick={() => setSampleType(2)} type="button">
				Sample 2 - Local Json - (AUTO)
			</button>
			<br />
			<button onClick={() => setSampleType(3)} type="button">
				Sample 3 - Endpoint to get the whole json and treat locally
			</button>
			<br />
			<button onClick={() => setSampleType(4)} type="button">
				Sample 4 - Endpoint to get the whole json and treat locally - (AUTO)
			</button>
			<br />
			<button onClick={() => setSampleType(5)} type="button">
				Sample 5 - Endpoint to request data each page loading
			</button>
			<br />
			<button onClick={() => setSampleType(6)} type="button">
				Sample 6 - Endpoint to request data each page loading - (AUTO)
			</button>
			<br />
			{sampleType === 1 && <SampleJsonLocal />}
			{sampleType === 2 && <SampleJsonLocalAuto />}
			{sampleType === 3 && <SampleJsonServer />}
			{sampleType === 4 && <SampleJsonServerAuto />}
			{sampleType === 5 && <SampleJsonServerEach />}
			{sampleType === 6 && <SampleJsonServerEachAuto />}
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
