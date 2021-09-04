/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

interface IProps {
	data: any[] | string; //local data. no need if is getting
	setData: React.Dispatch<React.SetStateAction<string[]>>; // change the data in the app to show results
	currentPage?: number; // current page
	perPage?: number; // number of results per page
	autoLoad?: boolean; // scroll to the bottom to load next page
	saveLocalJson?: boolean; // get all the results with one call
	pathData?: string; // field of the object ( data.pathData, data.users, data.xxx)
	onChange?: Function; // callback function after successfully change the page
}

interface IRef {
	allContent: number;
	page: number;
	pages: number[];
	viewport: number;
	result: any[];
	dataTemp: any[];
}

type serverData = {
	status: number;
	dataRawArr: any[];
	totalResults: number;
};

const Pagination = ({
	data,
	setData,
	currentPage = 1,
	perPage = 10,
	onChange,
	autoLoad = false,
	saveLocalJson = true,
	pathData = undefined,
}: IProps) => {
	const refContentScroll: React.MutableRefObject<IRef> = useRef({
		allContent: 0,
		page: currentPage,
		result: [],
		pages: [],
		viewport: 0,
		dataTemp: [],
	});

	// save local json for server call
	const [localData, setLocalData] = useState<any[]>([]);

	// check if is a endpoint or object
	let dataJson: any[] = [];
	let newContent: any[] = [];
	let pagesList: any[] = [];
	let totalResults: number = 0;
	const dataRetrieveFrom =
		typeof data === 'object' ? 'LOCAL' : saveLocalJson ? 'SERVER_LOCAL' : 'SERVER';

	const scrolling = () => {
		let windowCurrentPosition = 0;
		if (window !== undefined) {
			windowCurrentPosition = window.pageYOffset;
		}
		if (
			refContentScroll.current.viewport + windowCurrentPosition >
			refContentScroll.current.allContent
		) {
			const nextPage = refContentScroll.current.page + 1;
			if (nextPage < refContentScroll.current.pages.length + 1) {
				getResultPage(nextPage);
				console.log('get result', nextPage);
			} else {
				document.removeEventListener('scroll', scrolling, false);
			}
		}
	};

	// get data from local json
	const getDataFromJson = (json: any[], page: number = 1, perPage: number = 3): any => {
		dataJson = json;
		setLocalData(dataJson);

		const totalResults = dataJson.length;
		const indexCurrent = page * perPage - perPage;
		const indexCurrentFirst = indexCurrent;
		const indexLastResult = indexCurrent + perPage;
		const indexLast = indexLastResult > totalResults ? totalResults : indexLastResult;

		const serverResponse = {
			status: 1,
			dataRawArr: dataJson.slice(indexCurrentFirst, indexLast),
			totalResults: totalResults,
		};
		return serverResponse;
	};

	// get Json from or rest from the endpoint from the server
	const getFullJsonResults = async (page: number): Promise<serverData> => {
		let serverResponse: serverData = {
			status: 0,
			dataRawArr: [],
			totalResults: 0,
		};

		// getting data from server each page
		if (dataRetrieveFrom === 'SERVER') {
			await axios({
				url: `${data}?page=${page}&perpage=${perPage}`,
				method: 'get',
			})
				.then((responseData) => {
					dataJson = pathData ? responseData.data[pathData] : responseData.data;
					totalResults = responseData.data.totalRows;
					serverResponse = {
						status: 1,
						dataRawArr: pathData ? responseData.data[pathData] : responseData.data,
						totalResults: responseData.data.totalRows,
					};
				})
				.catch((errorData) => {
					console.log('ENDPOINT NOT FOUND');
				});
		}

		// gettin data from server only the first time
		if (dataRetrieveFrom === 'SERVER_LOCAL') {
			if (localData.length === 0) {
				await axios({
					url: `${data}`,
					method: 'get',
				})
					.then((responseData) => {
						dataJson = pathData ? responseData.data[pathData] : responseData.data;
						serverResponse = getDataFromJson(dataJson, page, perPage);
					})
					.catch((errorData) => {
						console.log('ENDPOINT NOT FOUND');
					});
			} else {
				serverResponse = getDataFromJson(localData, page, perPage);
			}
		}

		// all data is paged from the passed json
		if (dataRetrieveFrom === 'LOCAL') {
			if (typeof data === 'object') {
				dataJson = data;
			}
			serverResponse = getDataFromJson(dataJson, page, perPage);
		}

		return serverResponse;
	};

	const getResultPage = (page: number = currentPage) => {
		getFullJsonResults(page).then((responseServerJson) => {
			if (responseServerJson.status === 1) {
				newContent = responseServerJson.dataRawArr;
				totalResults = responseServerJson.totalResults;

				// creating pages array
				const totalPages = Math.ceil(totalResults / perPage);
				pagesList = [];
				for (let i = 1; i <= totalPages; i += 1) {
					pagesList.push(i);
				}

				if (autoLoad) {
					refContentScroll.current = {
						...refContentScroll.current,
						page: page,
						result: [...refContentScroll.current.result, ...newContent],
						pages: pagesList,
					};
				} else {
					refContentScroll.current = {
						...refContentScroll.current,
						page: page,
						result: newContent,
						pages: pagesList,
					};
				}

				if (onChange) {
					onChange(page);
				}

				setData(refContentScroll.current.result);
			} else {
				console.log('COULD NOT GET DATA FROM THIS OBJECT OR THIS ENDPOINT');
			}
		});
	};

	const handleNewPage = (page: number): void => {
		getResultPage(page);
	};

	const handlePrevPage = (): void => {
		const pageGoesTo = refContentScroll.current.page === 1 ? 1 : refContentScroll.current.page - 1;
		getResultPage(pageGoesTo);
	};

	const handleNextPage = (): void => {
		const pageGoesTo =
			refContentScroll.current.page === refContentScroll.current.pages.length
				? refContentScroll.current.page
				: refContentScroll.current.page + 1;
		getResultPage(pageGoesTo);
	};

	useEffect(() => {
		const contentScrollBox: Element | null = document.querySelector('.check-scroll');
		if (autoLoad) {
			if (contentScrollBox instanceof HTMLElement) {
				// create an Observer instance
				const resizeObserver = new ResizeObserver(() => {
					refContentScroll.current = {
						...refContentScroll.current,
						allContent: contentScrollBox?.scrollHeight + contentScrollBox?.offsetTop,
						viewport: window?.innerHeight,
					};
				});
				// start observing a DOM node
				resizeObserver.observe(document.body);
				document.addEventListener('scroll', scrolling, false);
			}
		}

		getResultPage();
	}, []);

	return (
		<>
			{/* <pre>{JSON.stringify(refContentScroll, null, 1)}</pre> */}
			{/* <pre>{JSON.stringify(localData, null, 1)}</pre> */}
			{autoLoad ? (
				<>
					<p>Scroll to nextpage</p>
				</>
			) : (
				<>
					<h2>Pagination:</h2>
					<ul>
						{refContentScroll.current.page === 1 ? (
							<li>
								<button type="button" disabled onClick={handlePrevPage}>
									Prev
								</button>
							</li>
						) : (
							<li>
								<button type="button" onClick={handlePrevPage}>
									Prev
								</button>
							</li>
						)}

						{refContentScroll.current.pages.map((page: number) => {
							return (
								<li key={page}>
									{page === refContentScroll.current.page ? (
										<button type="button" disabled onClick={() => handleNewPage(page)}>
											pagina
											{page}
										</button>
									) : (
										<button type="button" onClick={() => handleNewPage(page)}>
											pagina
											{page}
										</button>
									)}
								</li>
							);
						})}

						{refContentScroll.current.page >= refContentScroll.current.pages.length ? (
							<li>
								<button type="button" disabled onClick={handleNextPage}>
									Next
								</button>
							</li>
						) : (
							<li>
								<button type="button" onClick={handleNextPage}>
									Next
								</button>
							</li>
						)}
					</ul>
				</>
			)}
		</>
	);
};

export default Pagination;
