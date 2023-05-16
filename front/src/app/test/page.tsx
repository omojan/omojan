"use client";

import { useEffect } from "react";


export default function Test () {

    const isEventSourceSupported = !!window.EventSource;
    console.log(isEventSourceSupported)
    const eventSource = new EventSource("http://localhost:8000/sse", {
        withCredentials: true
    });

    eventSource.onmessage = ({ data }: MessageEvent) => {
        console.log(data);
    };
	// useEffect(() => {

	// 	return () => {
	// 		eventSource.close();
	// 	};
	// }, []);
    return (
        <></>
    );
};