/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

interface IProps {
	data: any[] | string; //local data. no need if is getting
	setData: React.Dispatch<React.SetStateAction<string[]>>; // change the data in the app to show results
	currentPage?: number; // current page
	perPage?: number; // number of results per page
	autoLoad?: boolean; // scroll to the bottom to load next page
	getAll?: boolean; // get all the results with one call
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
	users: any[];
	totalResults: number;
};

const Pagination = ({
	data,
	setData,
	currentPage = 1,
	perPage = 10,
	onChange,
	autoLoad = false,
	getAll = true,
}: IProps) => {
	const refContentScroll: React.MutableRefObject<IRef> = useRef({
		allContent: 0,
		page: currentPage,
		result: [],
		pages: [],
		viewport: 0,
		dataTemp: [],
	});

	const GET_ALL_SERVER = true;
	const [localData, setLocalData] = useState<any[]>([]);

	// check if is a endpoint or object
	let dataJson: any[] = [];
	let newContent: any[] = [];
	let pagesList: any[] = [];
	let totalResults: number = 0;
	const dataRetrieveFrom =
		typeof data === 'object' ? 'LOCAL' : GET_ALL_SERVER ? 'SERVER_LOCAL' : 'SERVER';

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
			} else {
				document.removeEventListener('scroll', scrolling, false);
			}
		}
	};

	// get Json from or rest from the endpoint from the server
	const getServerUsers = async (page: number): Promise<serverData> => {
		let serverResponse: serverData = {
			status: 0,
			users: [],
			totalResults: 0,
		};

		//check

		if (dataRetrieveFrom === 'SERVER') {
			await axios({
				url: `${data}?page=${page}&perpage=${perPage}`,
				method: 'get',
			})
				.then((responseData) => {
					dataJson = responseData.data.users;
					totalResults = responseData.data.results;
					serverResponse = {
						status: 1,
						users: responseData.data.users,
						totalResults: responseData.data.results,
					};
				})
				.catch((errorData) => {
					console.log('ENDPOINT NOT FOUND');
				});
		}
		if (dataRetrieveFrom === 'SERVER_LOCAL') {
			await axios({
				url: `${data}?page=${page}&perpage=${100}`,
				method: 'get',
			})
				.then((responseData) => {
					dataJson = responseData.data.users;
					totalResults = responseData.data.results;
					serverResponse = {
						status: 1,
						users: responseData.data.users,
						totalResults: responseData.data.results,
					};
				})
				.catch((errorData) => {
					console.log('ENDPOINT NOT FOUND');
				});
		}
		if (dataRetrieveFrom === 'LOCAL') {
			if (typeof data === 'object') {
				dataJson = data;
			}

			const totalResults = dataJson.length;
			const indexCurrent = page * perPage - perPage;
			const indexCurrentFirst = indexCurrent;
			const indexLastResult = indexCurrent + perPage;
			const indexLast = indexLastResult > totalResults ? totalResults : indexLastResult;

			serverResponse = {
				status: 1,
				users: dataJson.slice(indexCurrentFirst, indexLast),
				totalResults: totalResults,
			};
		}

		return serverResponse;
	};

	const getResultPage = (page: number = currentPage) => {
		getServerUsers(page).then((responseServerUser) => {
			if (responseServerUser.status === 1) {
				// console.log('getServerUsers', responseServerUser);
				newContent = responseServerUser.users;
				totalResults = responseServerUser.totalResults;

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
			<pre>{JSON.stringify(localData, null, 1)}</pre>
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
