/* eslint-disable no-nested-ternary */
/* eslint-disable  operator-linebreak */
import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import { install } from 'resize-observer';

install();

interface IProps {
	//  local data. no need if is getting
	data: any[] | string;
	// change the data in the app to show results
	setData: React.Dispatch<React.SetStateAction<string[]>>;
	// current page
	currentPage?: number;
	// number of results per page
	perPage?: number;
	// scroll to the bottom to load next page
	autoLoad?: boolean;
	// get all the results with one call
	saveLocalJson?: boolean;
	// field of the object ( data.pathData, data.users, data.xxx)
	pathData?: string;
	// callback function after successfully change the page
	callbackChangePage?: Function;
	// class or id of the element that will calculate scroll to the bottom
	scrollDomReference?: string | null;
}

interface IRef {
	allContent: number;
	page: number;
	pages: number[];
	viewport: number;
	result: any[];
	dataTemp: any[];
	localData: any[];
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
	callbackChangePage,
	autoLoad = false,
	saveLocalJson = true,
	pathData = undefined,
	scrollDomReference = null,
}: IProps) => {
	const refContentScroll: React.MutableRefObject<IRef> = useRef({
		allContent: 0,
		page: currentPage,
		result: [],
		pages: [],
		viewport: 0,
		dataTemp: [],
		localData: [],
	});

	// check if is a endpoint or object
	let dataJson: any[] = [];
	let newContent: any[] = [];
	let pagesList: any[] = [];
	let totalResults: number = 0;
	let isLoadingServerScroll = false;

	const dataRetrieveFrom =
		typeof data === 'object' ? 'LOCAL' : saveLocalJson ? 'SERVER_LOCAL' : 'SERVER';

	// get data from local json
	const getDataFromJson = (json: any[], page: number = 1): any => {
		dataJson = json;

		refContentScroll.current = {
			...refContentScroll.current,
			localData: dataJson,
		};

		const totalResultsLength = dataJson.length;
		const indexCurrent = page * perPage - perPage;
		const indexCurrentFirst = indexCurrent;
		const indexLastResult = indexCurrent + perPage;
		const indexLast = indexLastResult > totalResultsLength ? totalResultsLength : indexLastResult;

		const serverResponse = {
			status: 1,
			dataRawArr: dataJson.slice(indexCurrentFirst, indexLast),
			totalResults: totalResultsLength,
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
					console.log('ENDPOINT NOT FOUND', errorData);
				});
		}

		// gettin data from server only the first time
		// after that, the json is treat like local json
		if (dataRetrieveFrom === 'SERVER_LOCAL') {
			if (refContentScroll.current.localData.length === 0) {
				await axios({
					url: `${data}`,
					method: 'get',
				})
					.then((responseData) => {
						dataJson = pathData ? responseData.data[pathData] : responseData.data;
						serverResponse = getDataFromJson(dataJson, page);
					})
					.catch((errorData) => {
						console.log('ENDPOINT NOT FOUND', errorData);
					});
			} else {
				serverResponse = getDataFromJson(refContentScroll.current.localData, page);
			}
		}

		// data is request from the local json passed
		if (dataRetrieveFrom === 'LOCAL') {
			if (typeof data === 'object') {
				dataJson = data;
			}
			serverResponse = getDataFromJson(dataJson, page);
		}

		return serverResponse;
	};

	const getResultPage = (page: number = currentPage) => {
		isLoadingServerScroll = true;
		getFullJsonResults(page).then((responseServerJson) => {
			if (responseServerJson.status === 1) {
				newContent = responseServerJson.dataRawArr;
				totalResults = responseServerJson.totalResults;

				// creating pages to front end
				const totalPages = Math.ceil(totalResults / perPage);
				pagesList = [];
				for (let i = 1; i <= totalPages; i += 1) {
					pagesList.push(i);
				}

				if (autoLoad) {
					refContentScroll.current = {
						...refContentScroll.current,
						page,
						result: [...refContentScroll.current.result, ...newContent],
						pages: pagesList,
					};
				} else {
					refContentScroll.current = {
						...refContentScroll.current,
						page,
						result: newContent,
						pages: pagesList,
					};
				}

				// update useData from the main page
				setData(refContentScroll.current.result);

				// return callback function with current page
				if (callbackChangePage) {
					callbackChangePage(page);
				}
			} else {
				console.log('COULD NOT GET DATA FROM THIS OBJECT OR THIS ENDPOINT');
			}
			isLoadingServerScroll = false;
		});
	};

	// click next page
	const handleNewPage = (page: number): void => {
		getResultPage(page);
	};

	// click prev page
	const handlePrevPage = (): void => {
		const pageGoesTo = refContentScroll.current.page === 1 ? 1 : refContentScroll.current.page - 1;
		getResultPage(pageGoesTo);
	};

	// click number page
	const handleNextPage = (): void => {
		const pageGoesTo =
			refContentScroll.current.page === refContentScroll.current.pages.length
				? refContentScroll.current.page
				: refContentScroll.current.page + 1;
		getResultPage(pageGoesTo);
	};

	useEffect(() => {
		const scrolling = () => {
			// eventListener scrolling to get bottom of the page
			// only load more results if is not loading something
			// remove event if has got everything
			if (!isLoadingServerScroll) {
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
					} else {
						window.removeEventListener('scroll', scrolling, false);
					}
				}
			}
		};
		if (scrollDomReference != null) {
			const contentScrollBox: Element | null = document.querySelector(scrollDomReference);

			if (autoLoad && contentScrollBox !== null) {
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
					window.addEventListener('scroll', scrolling, false);
				}
			}
		}

		getResultPage();
		return () => {
			window.removeEventListener('scroll', scrolling);
		};
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
